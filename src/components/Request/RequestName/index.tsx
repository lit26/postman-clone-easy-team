import React from "react";
import { useApi } from "../../../context/ApiContext";

const RequestName: React.FC = () => {
  const { requestName, saveRequestItem, changeRequestItem } = useApi();

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    saveRequestItem();
  };

  return (
    <div className="input-group mb-4">
      <input
        required
        className="form-control"
        type="text"
        placeholder="New request"
        value={requestName}
        onChange={(e) => changeRequestItem("requestName", e.target.value)}
      />
      <button className="btn btn-warning" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default RequestName;
