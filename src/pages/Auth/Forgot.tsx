import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import AuthContainer from "../../components/AuthContainer";
import ErrorText from "../../components/ErrorText";
import { auth } from "../../config/firebase";

const ForgotPasswordPage: React.FC = () => {
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const resetPasswordRequest = () => {
    if (error !== "") {
      setError("");
    }

    setSending(true);

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log("Email sent.");
        setSent(true);
        setSending(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setSending(false);
      });
  };

  return (
    <AuthContainer header="Send Password Reset">
      {sent ? (
        <p>A link has been sent to your email with instructions.</p>
      ) : (
        <>
          <Form className="Login__form">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Please enter your email.</Form.Label>
              <Form.Control
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </Form.Group>
            <Button
              disabled={sending}
              color="success"
              block
              onClick={resetPasswordRequest}
            >
              Send Reset Link
            </Button>
            <ErrorText error={error} />
          </Form>
        </>
      )}
    </AuthContainer>
  );
};

export default ForgotPasswordPage;
