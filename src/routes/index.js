import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./private/route";
import privateRoutes from "./private";
import authRoutes from "./authentication";
import NoPageFound from "../pages/landingPages/NoPageFound";

export default function Routes() {
  return (
    <Router>
      <Switch>
        {authRoutes.map((item, index) => (
          <Route
            key={index}
            exact
            path={item.path}
            component={item.component}
          />
        ))}

        {privateRoutes.map((item, index) => (
          <Route
            key={index}
            path={item.path}
            exact
            render={() => (
              <PrivateRoute
                title={item.title}
                component={item.component}
                route={item.path}
              />
            )}
          />
        ))}

        {/* No Page Found Route*/}

        <Route path={"*"} component={NoPageFound} />
      </Switch>
    </Router>
  );
}
