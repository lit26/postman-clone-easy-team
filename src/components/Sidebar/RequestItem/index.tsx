import React, { useState } from "react";
import { useApi } from "../../../context/ApiContext";
import { AiFillDelete } from "react-icons/ai";
import { GoPrimitiveDot } from "react-icons/go";
import { RequestItemType } from "../../../types/data";

interface RequestItemProps {
  requestItem: RequestItemType;
}

const RequestItem: React.FC<RequestItemProps> = ({ requestItem }) => {
  const [showAction, setShowAction] = useState(false);
  const { selectRequestItem, removeRequestItem } = useApi();
  const { method } = requestItem;
  const methodClass =
    method === "GET"
      ? "method-get"
      : method === "POST"
      ? "method-post"
      : method === "PUT"
      ? "method-put"
      : method === "DELETE"
      ? "method-del"
      : "";

  const methodText =
    method === "DELETE" ? "DEL" : method === "PATCH" ? "PAT" : method;

  return (
    <div
      className="d-flex align-items-center py-2 RequestItem"
      onMouseEnter={() => setShowAction(true)}
      onMouseLeave={() => setShowAction(false)}
    >
      <strong
        className={methodClass}
        style={{ width: "38px", flexShrink: 0, fontSize: "11px" }}
        onClick={() => selectRequestItem(requestItem)}
      >
        {methodText}
      </strong>
      <span
        style={{
          width: "calc(100%-30px)",
          letterSpacing: "0px",
          minHeight: "24px",
          flexGrow: 1,
        }}
        onClick={() => selectRequestItem(requestItem)}
      >
        {requestItem.requestName}
      </span>
      {showAction ? (
        <AiFillDelete
          className="RequestItem__action"
          onClick={() => removeRequestItem(requestItem)}
        />
      ) : (
        requestItem.edit && (
          <GoPrimitiveDot style={{ color: "rgb(238, 197, 18)" }} />
        )
      )}
    </div>
  );
};
export default RequestItem;
