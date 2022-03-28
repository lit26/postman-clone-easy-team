import React from "react";
import Request from "../components/Request";
import Response from "../components/Response";
import Sidebar from "../components/Sidebar";

const HomePage: React.FC = () => {
  return (
    <div className="d-flex" style={{ height: "100%" }}>
      <Sidebar />
      <div style={{ width: "calc(100% - 300px)" }}>
        <Request />
        <Response />
      </div>
    </div>
  );
};

export default HomePage;
