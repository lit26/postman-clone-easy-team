import React from "react";
import "./AuthContainer.scss";

interface AuthContainerProps {
  children: React.ReactNode;
  header: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children, header }) => {
  return (
    <div className="AuthContainer p-5">
      <h2>Postman easy team</h2>
      <div className="AuthContainer__form p-30">
        <h2>{header}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
