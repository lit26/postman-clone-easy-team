import React from "react";
import { useApi } from "../../../../../context/ApiContext";
import BasicAuth from "./BasicAuth";
import BearerAuth from "./BearerAuth";

const RequestAuth = () => {
  const { auth, setAuth } = useApi();

  const changeAuth = (token: string) => {
    setAuth({
      ...auth,
      token,
    });
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between py-1">
        <div>Type</div>
        <select
          className="form-select flex-grow-0 w-auto"
          value={auth.authType}
          onChange={(e) =>
            setAuth({
              authType: e.target.value,
              token: "",
            })
          }
        >
          <option value="">No Auth</option>
          <option value="basic">Basic Auth</option>
          <option value="bearer">Bearer Auth</option>
        </select>
      </div>
      {auth.authType === "basic" && <BasicAuth changeAuth={changeAuth} />}
      {auth.authType === "bearer" && (
        <BearerAuth auth={auth} changeAuth={changeAuth} />
      )}
    </div>
  );
};

export default RequestAuth;
