import React from "react";
import RequestTabGroup from "./RequestTabGroup";
import RequestUrl from "./RequestUrl";
import RequestName from "./RequestName";
import { useApi } from "../../context/ApiContext";

const Request: React.FC = () => {
  const { requestItem } = useApi();

  return (
    <div className="p-4">
      {requestItem ? (
        <form>
          <RequestName />
          <RequestUrl />
          <RequestTabGroup />
        </form>
      ) : (
        <h2>Please add a request item</h2>
      )}
    </div>
  );
};

export default Request;
