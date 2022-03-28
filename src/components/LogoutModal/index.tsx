import React from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { auth } from "../../config/firebase";

interface LogoutProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogoutModal: React.FC<LogoutProps> = ({ show, setShow }) => {
  const history = useHistory();

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        history.push("/login");
      })
      .catch((error) => console.log(error));
  };

  return (
    <Modal show={show} onHide={setShow}>
      <Modal.Header>
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to logout?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={logout}>
          Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutModal;
