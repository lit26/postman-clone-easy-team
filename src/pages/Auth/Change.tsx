import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Container, Button, Form } from "react-bootstrap";
import ErrorText from "../../components/ErrorText";
import { auth } from "../../config/firebase";

const ChangePasswordPage: React.FC = () => {
  const [changing, setChanging] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");

  const history = useHistory();

  const passwordChangeRequest = () => {
    if (password !== confirm) {
      setError("Make sure your passwords are matching");
      return;
    }

    if (error !== "") {
      setError("");
    }

    setChanging(true);

    auth.currentUser
      ?.updatePassword(password)
      .then(() => {
        console.log("Password change successful.");
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
        setChanging(false);
        setError(error.message);
      });
  };

  return (
    <Container>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirm"
                id="confirm"
                placeholder="Confirm Password"
                onChange={(e) => setConfirm(e.target.value)}
                value={confirm}
              />
            </Form.Group>

            <Button
              disabled={changing}
              color="success"
              block
              type="submit"
              onClick={passwordChangeRequest}
            >
              Change
            </Button>
            <ErrorText error={error} />
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ChangePasswordPage;
