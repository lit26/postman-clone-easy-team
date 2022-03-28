import React from "react";
import { Param } from "../../../../../types/data";

interface KeyValuePairProps {
  keyValue: Param;
  index: number;
  change: (changeIndex: number, keyValue: Param) => void;
  remove: (removeIndex: number) => void;
}

const KeyValuePair: React.FC<KeyValuePairProps> = ({
  keyValue,
  index,
  change,
  remove,
}) => {
  return (
    <div className="input-group my-2">
      <input
        type="text"
        className="form-control"
        placeholder="Key"
        value={keyValue.key}
        onChange={(e) =>
          change(index, { key: e.target.value, value: keyValue.value })
        }
      />
      <input
        type="text"
        className="form-control"
        placeholder="Value"
        value={keyValue.value}
        onChange={(e) =>
          change(index, { key: keyValue.key, value: e.target.value })
        }
      />
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={() => remove(index)}
      >
        Remove
      </button>
    </div>
  );
};

export default KeyValuePair;
