import React from "react";
import { Param } from "../../../../../types/data";
import KeyValuePair from "../KeyValuePair";

interface RequestDetailProps {
  details: Param[];
  requestDetailKey: string;
  changeRequestItem: (
    requestKey: string,
    requestValue: string | Param[]
  ) => void;
}

const RequestDetail: React.FC<RequestDetailProps> = ({
  details,
  requestDetailKey,
  changeRequestItem,
}) => {
  const addDetail = () => {
    changeRequestItem(requestDetailKey, [...details, { key: "", value: "" }]);
  };

  const removeHeader = (removeIndex: number) => {
    changeRequestItem(
      requestDetailKey,
      details.filter((detail, index) => index !== removeIndex)
    );
  };

  const changeHeader = (changeIndex: number, keyValue: Param) => {
    changeRequestItem(
      requestDetailKey,
      details.map((detail, index) =>
        index !== changeIndex ? detail : keyValue
      )
    );
  };

  return (
    <>
      <div>
        {details.map((detail, index) => (
          <KeyValuePair
            key={`detail_${index}`}
            keyValue={detail}
            index={index}
            change={changeHeader}
            remove={removeHeader}
          />
        ))}
      </div>
      <button
        className="mt-2 btn btn-outline-success"
        type="button"
        onClick={addDetail}
      >
        Add
      </button>
    </>
  );
};

export default RequestDetail;
