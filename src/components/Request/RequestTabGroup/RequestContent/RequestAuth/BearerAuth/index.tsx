import React from "react";
import { ReqAuth } from "../../../../../../types/data";

interface BearerAuthProps {
  auth: ReqAuth;
  changeAuth: (token: string) => void;
}

const BearerAuth: React.FC<BearerAuthProps> = ({ auth, changeAuth }) => {
  return (
    <div className="d-flex align-items-center justify-content-between py-1">
      <div>Token</div>
      <textarea
        className="form-control"
        style={{ width: "250px" }}
        value={auth.token}
        onChange={(e) => changeAuth(e.target.value)}
      />
    </div>
  );
};

export default BearerAuth;
