import React from "react";
import { useApi } from "../../context/ApiContext";
import ResponseTabGroup from "./ResponseTabGroup";

const Response: React.FC = () => {
  const { resStatus, loading } = useApi();
  return (
    <div
      className="mt-5 p-4"
      style={{ backgroundColor: loading ? "#8080801a" : "" }}
    >
      <h3>Response</h3>
      <div className="d-flex my-2">
        <div className="me-3">
          Status: <span>{resStatus.status}</span>
        </div>
        <div className="me-3">
          Time: <span>{resStatus.time ? `${resStatus.time}ms` : ""}</span>
        </div>
        <div className="me-3">
          Size: <span>{resStatus.size}</span>
        </div>
      </div>
      <ResponseTabGroup />
    </div>
  );
};

export default Response;
