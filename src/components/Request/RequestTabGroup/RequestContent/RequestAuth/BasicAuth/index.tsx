import React, { useState } from "react";
import { Buffer } from "buffer";

interface BasicAuthProps {
  changeAuth: (token: string) => void;
}

const BasicAuth: React.FC<BasicAuthProps> = ({ changeAuth }) => {
  const [auth, setAuth] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuth = {
      ...auth,
      [e.target.name]: e.target.value,
    };
    setAuth(newAuth);
    const token = Buffer.from(
      `${auth.username}:${auth.password}`,
      "utf8"
    ).toString("base64");
    changeAuth(token);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between py-1">
        <div>Username</div>
        <div>
          <input
            className="form-control"
            type="text"
            name="username"
            value={auth.username}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between py-1">
        <div>Password</div>
        <div>
          <input
            className="form-control"
            type="text"
            name="password"
            value={auth.password}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default BasicAuth;
