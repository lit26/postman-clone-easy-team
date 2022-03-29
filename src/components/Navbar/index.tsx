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
              <div>
                <img
                  className="avatar"
                  src={require("../../assets/profilePic.png").default}
                  alt=""
                />
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
