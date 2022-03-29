import React, { useContext, useState, ReactNode } from "react";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { database, firestore } from "../config/firebase";
import {
  Folder,
  Param,
  ReqAuth,
  RequestItemType,
  ResHeader,
  ResStatus,
} from "../types/data";

interface ApiContextProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  requestItem?: RequestItemType;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requestName: string;
  url: string;
  auth: ReqAuth;
  setAuth: React.Dispatch<React.SetStateAction<ReqAuth>>;
  queryParams: Param[];
  headers: Param[];
  doc: any;
  changeRequestItem: (
    requestKey: string,
    requestValue: string | Param[]
  ) => void;
  sendRequest: (e: React.MouseEvent<HTMLButtonElement>) => void;
  resStatus: ResStatus;
  resData: any;
  resHeaders: ResHeader;
  loading: boolean;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  requestItems: RequestItemType[];
  setRequestItems: React.Dispatch<React.SetStateAction<RequestItemType[]>>;
  history: RequestItemType[];
  setHistory: React.Dispatch<React.SetStateAction<RequestItemType[]>>;
  addFolder: () => void;
  updateFolder: (updateFolder: Folder, folderName: string) => void;
  deleteFolder: (folderId: string) => void;
  addRequestItem: (folderId: string) => void;
  selectRequestItem: (requestItem: RequestItemType) => void;
  updateRequestItemOrder: (
    folderId: string,
    newIds: (string | undefined)[]
  ) => void;
  saveRequestItem: () => void;
  removeRequestItem: (removeRequestItem: RequestItemType) => void;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

const ApiContext = React.createContext<ApiContextProps | undefined>(undefined);

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useContext must be within Provider");
  }
  return context;
}

axios.interceptors.request.use((req) => {
  const newReq = {
    ...req,
    customData: {
      startTime: new Date().getTime(),
    },
  };
  // req.customData = req && req.customData ? req.customData : {};
  // req.customData.startTime = new Date().getTime();
  return newReq;
});

const updateEndTime = (res: any) => {
  res.customData = res.customData || {};
  res.customData.time = new Date().getTime() - res.config.customData.startTime;
  return res;
};

axios.interceptors.response.use(updateEndTime, (e) => {
  return Promise.reject(updateEndTime(e.response));
});
interface ProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ProviderProps> = ({ children }) => {
  const [search, setSearch] = useState("");
  const [currentRequestItemId, setCurrentRequestItemId] = useState("");
  const [auth, setAuth] = useState<ReqAuth>({
    authType: "",
    token: "",
  });
  const [resStatus, setResStatus] = useState<any>({ status: "" });
  const [resData, setResData] = useState({});
  const [resHeaders, setResHeaders] = useState<ResHeader>({});
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [requestItems, setRequestItems] = useState<RequestItemType[]>([]);
  const [history, setHistory] = useState<RequestItemType[]>([]);
  const [mode, setMode] = useState("Collections");

  const changeRequestItem = (
    requestKey: string,
    requestValue: string | Param[]
  ) => {
    setRequestItems(
      requestItems.map((item) =>
        item.id === currentRequestItemId
          ? { ...item, [requestKey]: requestValue, edit: true }
          : item
      )
    );
  };

  const formatReqKeyValue = (params: Param[]) => {
    return params.reduce(
      (acc, param) =>
        param.key === "" ? acc : { ...acc, [param.key]: param.value },
      {}
    );
  };

  const sendRequest = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let data;
    try {
      data = JSON.parse(doc.toString());
    } catch (e) {
      alert("Something is wrong with the JSON data.");
    }
    setLoading(true);
    let authHeader = {};
    if (auth.authType !== "" && auth.token !== "") {
      authHeader = {
        Authorization: `${auth.authType} ${auth.token}`,
      };
    }
    axios({
      url,
      method,
      params: formatReqKeyValue(queryParams),
      headers: { ...formatReqKeyValue(headers), ...authHeader },
      data,
    })
      .catch((e) => e)
      .then((res) => {
        setResStatus({
          status: res.status,
          time: res.customData.time,
          size: prettyBytes(
            JSON.stringify(res.data).length + JSON.stringify(res.headers).length
          ),
        });
        setResData(res.data);
        setResHeaders(res.headers);
        setLoading(false);
        if (mode !== "History") {
          saveRequestItem();
        }
      });
  };

  const addFolder = () => {
    database.folders
      .add({ name: "New folder" })
      .then((res) =>
        setFolders([...folders, { id: res.id, name: "New folder", order: [] }])
      );
  };

  const updateFolder = (updateFolder: Folder, folderName: string) => {
    database.folders
      .doc(updateFolder.id)
      .update({ name: folderName })
      .then((res) => {
        setFolders(
          folders.map((folder) =>
            folder.id === updateFolder.id
              ? { ...folder, name: folderName }
              : folder
          )
        );
      });
  };

  const deleteRequestItems = async (folderId: string) => {
    const emptyFolder = await database.requestItems
      .where("folderId", "==", folderId)
      .get();
    const batch = firestore.batch();
    emptyFolder.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    setRequestItems(requestItems.filter((item) => item.folderId !== folderId));
  };

  const deleteFolder = (folderId: string) => {
    deleteRequestItems(folderId);
    database.folders
      .doc(folderId)
      .delete()
      .then((res) => {
        setFolders(folders.filter((folder) => folder.id !== folderId));
      });
  };

  const addRequestItem = (folderId: string) => {
    const addItem: RequestItemType = {
      requestName: "New request",
      folderId,
      method: "GET",
      url: "",
      queryParams: [{ key: "", value: "" }],
      headers: [{ key: "", value: "" }],
      doc: "{\n\t\n}",
      createdAt: database.getCurrentTimestamp(),
    };
    database.requestItems.add(addItem).then((res) => {
      if (requestItems.length === 0) {
        selectRequestItem({
          ...addItem,
          id: res.id,
        });
      }
      setRequestItems([
        ...requestItems,
        {
          ...addItem,
          id: res.id,
        },
      ]);
      const updateFolder = folders.find((folder) => folder.id === folderId);
      if (updateFolder) {
        const oldOrder = updateFolder.order ? updateFolder.order : [];
        const newOrder = [...oldOrder, res.id];
        database.folders
          .doc(folderId)
          .update({ order: newOrder })
          .then(() => {
            setFolders(
              folders.map((folder) =>
                folder.id === folderId
                  ? {
                      ...folder,
                      order: newOrder,
                    }
                  : folder
              )
            );
          });
      }
    });
  };

  const saveRequestItem = () => {
    database.requestItems
      .doc(currentRequestItemId)
      .update({
        requestName,
        url,
        method,
        queryParams,
        headers,
        doc,
      })
      .then((res) => {
        setRequestItems(
          requestItems.map((requestItem) =>
            requestItem.id === currentRequestItemId
              ? {
                  ...requestItem,
                  requestName,
                  url,
                  method,
                  queryParams,
                  headers,
                  doc,
                  edit: false,
                }
              : requestItem
          )
        );
      });

    if (mode !== "History") {
      const addItem: RequestItemType = {
        requestName,
        url,
        method,
        queryParams,
        headers,
        doc,
        auth,
      };
      database.history.add(addItem).then((res) => {
        setHistory([
          ...history,
          {
            ...addItem,
            id: res.id,
          },
        ]);
      });
    }
  };

  const removeRequestItem = (removeRequestItem: RequestItemType) => {
    if (mode === "History") {
      database.history
        .doc(removeRequestItem.id)
        .delete()
        .then((res) => {
          setHistory(
            history.filter(
              (requestItem) => requestItem.id !== removeRequestItem.id
            )
          );
        });
    } else {
      database.requestItems
        .doc(removeRequestItem.id)
        .delete()
        .then((res) => {
          setRequestItems(
            requestItems.filter(
              (requestItem) => requestItem.id !== removeRequestItem.id
            )
          );
        });
    }
  };

  const selectRequestItem = (requestItem: RequestItemType) => {
    if (requestItem.id) {
      setCurrentRequestItemId(requestItem.id);
      if (mode === "History" && requestItem.auth) {
        setAuth(requestItem.auth);
      }
      setResStatus({
        status: "",
      });
      setResData({});
      setResHeaders({});
    }
  };

  const updateRequestItemOrder = (
    folderId: string,
    newIds: (string | undefined)[]
  ) => {
    if (
      Array.isArray(newIds) &&
      newIds.length &&
      newIds.every((item) => typeof item === "string")
    ) {
      setFolders(
        folders.map((folder) =>
          folder.id === folderId ? { ...folder, order: newIds } : folder
        )
      );
      database.folders.doc(folderId).update({ order: newIds });
    }
  };

  const requestItem =
    requestItems.find((item) => item.id === currentRequestItemId) ||
    history.find((item) => item.id === currentRequestItemId);

  const requestName = requestItem ? requestItem.requestName : "";
  const url = requestItem ? requestItem.url : "";
  const method = requestItem ? requestItem.method : "GET";
  const headers = requestItem ? requestItem.headers : [{ key: "", value: "" }];
  const queryParams = requestItem
    ? requestItem.queryParams
    : [{ key: "", value: "" }];
  const doc = requestItem ? requestItem.doc : "{\n\t\n}";

  const value = {
    search,
    setSearch,
    requestItem,
    method,
    requestName,
    url,
    auth,
    setAuth,
    queryParams,
    headers,
    doc,
    changeRequestItem,
    sendRequest,
    resStatus,
    resData,
    resHeaders,
    loading,
    folders,
    setFolders,
    requestItems,
    setRequestItems,
    history,
    setHistory,
    addFolder,
    updateFolder,
    deleteFolder,
    addRequestItem,
    selectRequestItem,
    saveRequestItem,
    updateRequestItemOrder,
    removeRequestItem,
    mode,
    setMode,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
