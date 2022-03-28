import React from "react";
import { Redirect } from "react-router-dom";
import { auth } from "../../config/firebase";
import Navbar from "../Navbar";
// import './AuthRoute.scss';

const AuthRoute: React.FC = ({ children }) => {
  if (!auth.currentUser) {
    console.log("No user detected, redirecting");
    return <Redirect to="/login" />;
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="AuthRoute__page flex-grow-1">
        {/* Content */}
        {children}
      </div>
    </>
  );
};

export default AuthRoute;
