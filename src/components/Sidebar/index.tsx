import React, { useEffect } from "react";
import RequestFolder from "./RequestFolder";
import "./Sidebar.scss";
import { database } from "../../config/firebase";
import "firebase/firestore";
import { useApi } from "../../context/ApiContext";
import { GrAdd } from "react-icons/gr";
import RequestItem from "./RequestItem";
import { Folder, RequestItemType } from "../../types/data";
import { BsClockHistory, BsCollection } from "react-icons/bs";
import SidebarNav from "./SidebarNav";

const Sidebar: React.FC = () => {
  const {
    search,
    setSearch,
    folders,
    setFolders,
    setRequestItems,
    addFolder,
    mode,
    setMode,
    history,
    setHistory,
    selectRequestItem,
  } = useApi();

  const getFolders = async () => {
    const snapshot = await database.folders.get();
    return snapshot.docs.map((doc) => database.formatDoc(doc));
  };
  const getRequestItems = async () => {
    const snapshot = await database.requestItems.get();
    return snapshot.docs.map((doc) => database.formatDoc(doc));
  };

  const getHistory = async () => {
    const snapshot = await database.history.get();
    return snapshot.docs.map((doc) => database.formatDoc(doc));
  };

  useEffect(() => {
    getFolders().then((res) => {
      setFolders(res);
      getRequestItems().then((resp) => {
        setRequestItems(resp.map((item) => ({ ...item, edit: false })));
        if (resp.length > 0) {
          selectRequestItem(resp[0]);
        }
      });
    });
    getHistory().then((res) => {
      setHistory(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFolders, setRequestItems, setHistory]);

  const displayHistory = history.filter((item) =>
    item.requestName.toLowerCase().includes(search.toLowerCase())
  );

  const clickHandle = (nav: string) => {
    setMode(nav);
  };

  return (
    <div
      className="p-2 flex-shrink-0 d-flex flex-column"
      style={{ width: "30%" }}
    >
      <div className="d-flex justify-content-around">
        <SidebarNav
          Icon={BsCollection}
          title="Collection"
          clickHandle={clickHandle}
        />
        <SidebarNav
          Icon={BsClockHistory}
          title="History"
          clickHandle={clickHandle}
        />
      </div>
      <hr />
      <div className="flex-grow-1 d-flex flex-column">
        <div className="input-group">
          <div className="Sidebar__addfolder d-flex align-items-center justify-content-center">
            <GrAdd onClick={addFolder} style={{ cursor: "pointer" }} />
          </div>

          <input
            className="form-control"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="SidebarItems flex-grow-1 my-2">
          <div>
            {mode !== "History"
              ? folders.map((folder: Folder, index: number) => (
                  <RequestFolder key={`folder_${index}`} folder={folder} />
                ))
              : displayHistory.map(
                  (requestItem: RequestItemType, index: number) => (
                    <RequestItem
                      key={`requestItem_${index}`}
                      requestItem={requestItem}
                    />
                  )
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
