import React, { useEffect } from "react";
import RequestFolder from "./RequestFolder";
import "./Sidebar.scss";
import { database } from "../../config/firebase";
import "firebase/firestore";
import { useApi } from "../../context/ApiContext";
import { GrAdd } from "react-icons/gr";
import { Dropdown } from "react-bootstrap";
import RequestItem from "./RequestItem";
import { Folder, RequestItemType } from "../../types/data";

const Sidebar: React.FC = () => {
  const {
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
        selectRequestItem(resp[0]);
      });
    });
    getHistory().then((res) => {
      setHistory(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFolders, setRequestItems, setHistory]);

  return (
    <div
      className="p-2 flex-shrink-0 d-flex flex-column"
      style={{ width: "300px" }}
    >
      <Dropdown>
        <Dropdown.Toggle variant="link" className="Sidebar__header">
          <h2>{mode}</h2>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setMode("Collections")}>
            Collections
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setMode("History")}>
            History
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <hr />
      <div className="flex-grow-1 d-flex flex-column">
        <div className="input-group">
          <div className="Sidebar__addfolder d-flex align-items-center justify-content-center">
            <GrAdd onClick={addFolder} style={{ cursor: "pointer" }} />
          </div>

          <input
            required
            className="form-control"
            type="url"
            placeholder="Search"
          />
        </div>
        <div className="SidebarItems flex-grow-1 my-2">
          <div>
            {mode !== "History"
              ? folders.map((folder: Folder, index: number) => (
                  <RequestFolder key={`folder_${index}`} folder={folder} />
                ))
              : history.map((requestItem: RequestItemType, index: number) => (
                  <RequestItem
                    key={`requestItem_${index}`}
                    requestItem={requestItem}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
