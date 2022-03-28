import React, { useContext, useState, ReactNode } from "react";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { database } from "../config/firebase";
import {
  Folder,
  Param,
  ReqAuth,
  RequestItemType,
  ResHeader,
  ResStatus,
} from "../types/data";

interface ApiContextProps {
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
  addRequestItem: (folderId: string) => void;
  selectRequestItem: (requestItem: RequestItemType) => void;
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
        setFolders([...folders, { id: res.id, name: "New folder" }])
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
      setRequestItems([
        ...requestItems,
        {
          ...addItem,
          id: res.id,
        },
      ]);
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

  const requestItem = (mode !== "History" ? requestItems : history).find(
    (item) => item.id === currentRequestItemId
  );

  const requestName = requestItem ? requestItem.requestName : "";
  const url = requestItem ? requestItem.url : "";
  const method = requestItem ? requestItem.method : "GET";
  const headers = requestItem ? requestItem.headers : [{ key: "", value: "" }];
  const queryParams = requestItem
    ? requestItem.queryParams
    : [{ key: "", value: "" }];
  const doc = requestItem ? requestItem.doc : "{\n\t\n}";

  const value = {
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
    addRequestItem,
    selectRequestItem,
    saveRequestItem,
    removeRequestItem,
    mode,
    setMode,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
