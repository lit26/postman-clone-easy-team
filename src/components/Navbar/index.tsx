import React, { useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import "./Navbar.scss";
import { NavLink } from "react-router-dom";
import LogoutModal from "../LogoutModal/";
import { useHistory } from "react-router-dom";

const Navbar: React.FC = () => {
  const [logoutShow, setLogoutShow] = useState<boolean>(false);
  const history = useHistory();

  return (
    <div className="Narbar d-flex align-items-center justify-content-between">
      <div className="Navbar__left d-flex">
        <h1 style={{ cursor: "pointer" }} onClick={() => history.push("/")}>
          Postman easy team
        </h1>
      </div>
      <div className="Navbar__right d-flex">
        <Nav className="Navbar__links">
          <NavDropdown
            title={
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  height: "38px",
                  width: "38px",
                  border: "3px solid #ccc8c8",
                }}
              >
                <div
                  style={{
                    height: "30px",
                    width: "30px",
                    backgroundColor: "#ccc8c8",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
            }
            style={{ padding: 0, marginLeft: "5px" }}
            id="nav-dropdown"
          >
            <Nav.Link className="Navbar__link" as={NavLink} to="/change">
              Change
            </Nav.Link>
            <NavDropdown.Divider />
            <NavDropdown.Item
              className="Navbar__link"
              onClick={() => setLogoutShow(true)}
            >
              Logout
            </NavDropdown.Item>
            <LogoutModal show={logoutShow} setShow={setLogoutShow} />
          </NavDropdown>
        </Nav>
      </div>
    </div>
  );
};

export default Navbar;
