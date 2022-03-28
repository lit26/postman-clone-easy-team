import React from "react";
import { useApi } from "../../../context/ApiContext";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const RequestUrl: React.FC = () => {
  const { method, url, sendRequest, changeRequestItem } = useApi();
  return (
    <div className="input-group mb-4">
      <select
        className="form-select flex-grow-0 w-auto"
        value={method}
        onChange={(e) => changeRequestItem("method", e.target.value)}
      >
        {METHODS.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
      <input
        required
        className="form-control"
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => changeRequestItem("url", e.target.value)}
      />
      <button type="submit" className="btn btn-primary" onClick={sendRequest}>
        Send
      </button>
    </div>
  );
};

export default RequestUrl;
