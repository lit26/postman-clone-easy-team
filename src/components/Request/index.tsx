import React from "react";
import RequestTabGroup from "./RequestTabGroup";
import RequestUrl from "./RequestUrl";
import RequestName from "./RequestName";

const Request: React.FC = () => {
  return (
    <div className="p-4">
      <form>
        <RequestName />
        <RequestUrl />
        <RequestTabGroup />
      </form>
    </div>
  );
};

export default Request;
