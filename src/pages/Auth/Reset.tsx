import React, { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import AuthContainer from "../../components/AuthContainer";
import ErrorText from "../../components/ErrorText";
import { auth } from "../../config/firebase";
import queryString from "querystring";

interface PageProps {
  name: string;
}

const ResetPasswordPage: React.FC<PageProps & RouteComponentProps> = (
  props
) => {
  const [verifying, setVerifying] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);
  const [changing, setChanging] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [oobCode, setOobCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const history = useHistory();

  useEffect(() => {
    console.log("Extracting code");

    let stringParams = queryString.parse(props.location.search);

    if (stringParams) {
      let oobCode = stringParams.oobCode as string;

      if (oobCode) {
        console.log("Code found");
        verifyPasswordResetLink(oobCode);
      } else {
        console.log("Unable to find code");
        setVerified(false);
        setVerifying(false);
      }
    } else {
      console.log("Unable to find code");
      setVerified(false);
      setVerifying(false);
    }
  }, [props]);

  const verifyPasswordResetLink = (_oobCode: string) => {
    auth
      .verifyPasswordResetCode(_oobCode)
      .then((result) => {
        console.log(result);
        setOobCode(_oobCode);
        setVerified(true);
        setVerifying(false);
      })
      .catch((error) => {
        console.log(error);
        setVerified(false);
        setVerifying(false);
      });
  };

  const passwordResetRequest = () => {
    if (password !== confirm) {
      setError("Make sure your passwords are matching");
      return;
    }

    if (error !== "") {
      setError("");
    }

    setChanging(true);

    auth
      .confirmPasswordReset(oobCode, password)
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setChanging(false);
      });
  };

  return (
    <AuthContainer header="Reset Password">
      <Form>
        {verifying ? (
          <Spinner animation="border" variant="secondary" />
        ) : (
          <>
            {verified ? (
              <>
                <p>Please enter a strong password.</p>
                <Form.Group>
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
                <Form.Group>
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
                  onClick={passwordResetRequest}
                >
                  Reset Password
                </Button>
                <ErrorText error={error} />
              </>
            ) : (
              <p>Invalid link.</p>
            )}
          </>
        )}
      </Form>
    </AuthContainer>
  );
};

export default ResetPasswordPage;
