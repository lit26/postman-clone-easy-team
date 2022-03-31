import React from "react";
import Request from "../components/Request";
import Response from "../components/Response";
import Sidebar from "../components/Sidebar";

const HomePage: React.FC = () => {
  return (
    <div className="d-flex" style={{ height: "100%" }}>
      <Sidebar />
      <div style={{ width: "70%" }}>
        <Request />
        <Response />
      </div>
    </div>
  );
};

export default HomePage;
