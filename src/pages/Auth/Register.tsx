import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import ErrorText from "../../components/ErrorText";
import { auth } from "../../config/firebase";
import AuthContainer from "../../components/AuthContainer";

const RegisterPage: React.FC = () => {
  const [registering, setRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");

  const history = useHistory();

  const signUpWithEmailAndPassword = () => {
    if (password !== confirm) {
      setError("Please make sure your passwords match.");
      return;
    }

    if (error !== "") {
      setError("");
    }

    setRegistering(true);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
        history.push("/login");
      })
      .catch((error) => {
        console.log(error);
        if (error.code.includes("auth/weak-password")) {
          setError("Please enter a stronger password.");
        } else if (error.code.includes("auth/email-already-in-use")) {
          setError("Email already in use.");
        } else {
          setError("Unable to register.  Please try again later.");
        }
        setRegistering(false);
      });
  };

  return (
    <AuthContainer header="Create Account">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            id="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
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
          disabled={registering}
          color="success"
          block
          onClick={signUpWithEmailAndPassword}
        >
          Sign Up
        </Button>
        <small>
          <p className="m-1 text-center">
            Already have an account? <Link to="/login">Login.</Link>
          </p>
        </small>
        <ErrorText error={error} />
      </Form>
    </AuthContainer>
  );
};

export default RegisterPage;
