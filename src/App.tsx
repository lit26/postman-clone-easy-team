import React, { useEffect, useState } from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import AuthRoute from "./components/AuthRoute";
import { auth } from "./config/firebase";
import routes from "./config/routes";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        console.log("User detected.");
      } else {
        console.log("No user detected");
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="secondary" />;
  }

  return (
    <div className="app">
      <div className="page d-flex flex-column" style={{ height: "100vh" }}>
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={(routeProps: RouteComponentProps<any>) => {
                if (route.protected)
                  return (
                    <AuthRoute>
                      <route.component {...routeProps} />
                    </AuthRoute>
                  );

                return <route.component {...routeProps} />;
              }}
            />
          ))}
        </Switch>
      </div>
    </div>
  );
};

export default App;
