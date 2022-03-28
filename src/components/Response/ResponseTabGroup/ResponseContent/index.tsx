import React from "react";
import { useApi } from "../../../../context/ApiContext";
import CodeEditorContainer from "../../../CodeEditorContainer";

interface ResponseContentProps {
  tab: number;
}

const ResponseContent: React.FC<ResponseContentProps> = ({ tab }) => {
  const { resHeaders, resData } = useApi();
  const jsonResponse = JSON.stringify(resData, null, 2);

  return (
    <div className="tab-content p-3 border-top-0 border">
      <div
        className={`tab-pane fade show ${tab === 0 ? "active" : ""}`}
        role="tabpanel"
      >
        <div className="overflow-auto" style={{ maxHeight: "350px" }}>
          <CodeEditorContainer doc={jsonResponse} isEditable={false} />
        </div>
      </div>
      <div
        className={`tab-pane fade show ${tab === 1 ? "active" : ""}`}
        role="tabpanel"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: ".5rem 2rem",
          }}
        >
          {Object.entries(resHeaders).map(([key, value]) => (
            <React.Fragment key={`resHeader_${key}`}>
              <div>{key}</div>
              <div>{value}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponseContent;
