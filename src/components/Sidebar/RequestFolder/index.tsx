import React, { useState, useRef } from "react";
import RequestItem from "../RequestItem";
import "./RequestFolder.scss";
import { GrAdd } from "react-icons/gr";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { useEffect } from "react";
import { useApi } from "../../../context/ApiContext";

interface RequestFolderProps {
  folder: any;
}

const RequestFolder: React.FC<RequestFolderProps> = ({ folder }) => {
  const [folderName, setFolderName] = useState("");
  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editFolder, setEditFolder] = useState(false);
  const { requestItems, addRequestItem, updateFolder } = useApi();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editFolder && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editFolder]);

  const saveFolder = () => {
    setEditFolder(false);
    updateFolder(folder, folderName);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveFolder();
    }
  };

  const requestSubItems = requestItems.filter(
    (requestItem) => requestItem.folderId === folder.id
  );

  const handleAdd = () => {
    addRequestItem(folder.id);
    setShow(true);
  };

  useEffect(() => {
    setFolderName(folder.name);
  }, [folder.name]);

  return (
    <>
      <div
        className="RequestFolder mt-3"
        onMouseEnter={() => setShowAdd(true)}
        onMouseLeave={() => setShowAdd(false)}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center flex-grow-1">
            {show ? (
              <IoIosArrowDown className="me-3" onClick={() => setShow(false)} />
            ) : (
              <IoIosArrowForward
                className="me-3"
                onClick={() => setShow(true)}
              />
            )}
            {editFolder ? (
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyPress={handleKeyPress}
                ref={inputRef}
                onBlur={saveFolder}
              />
            ) : (
              <div className="flex-grow-1" onClick={() => setEditFolder(true)}>
                {folder.name}
              </div>
            )}
          </div>
          {showAdd && <GrAdd onClick={handleAdd} />}
        </div>
      </div>
      {show && (
        <div>
          {requestSubItems.map((requestItem: any, index: number) => (
            <RequestItem
              key={`requestItem_${index}`}
              requestItem={requestItem}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default RequestFolder;
