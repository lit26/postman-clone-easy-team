import React from "react";
import { useApi } from "../../../../context/ApiContext";
import RequestAuth from "./RequestAuth";
import CodeEditorContainer from "../../../CodeEditorContainer";
import RequestDetail from "./RequestDetail";

interface RequestContentProps {
  tab: number;
}

const RequestContent: React.FC<RequestContentProps> = ({ tab }) => {
  const { doc, queryParams, headers, changeRequestItem } = useApi();

  return (
    <div className="tab-content p-3 border-top-0 border">
      <div
        className={`tab-pane fade show ${tab === 0 ? "active" : ""}`}
        role="tabpanel"
      >
        <RequestDetail
          details={queryParams}
          requestDetailKey="queryParams"
          changeRequestItem={changeRequestItem}
        />
      </div>
      <div
        className={`tab-pane fade show ${tab === 1 ? "active" : ""}`}
        role="tabpanel"
      >
        <RequestDetail
          details={headers}
          requestDetailKey="headers"
          changeRequestItem={changeRequestItem}
        />
      </div>
      <div
        className={`tab-pane fade show ${tab === 2 ? "active" : ""}`}
        role="tabpanel"
      >
        <RequestAuth />
      </div>
      <div
        className={`tab-pane fade show ${tab === 3 ? "active" : ""}`}
        role="tabpanel"
      >
        <div className="overflow-auto" style={{ maxHeight: "200px" }}>
          <CodeEditorContainer
            doc={doc}
            changeRequestItem={changeRequestItem}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestContent;
