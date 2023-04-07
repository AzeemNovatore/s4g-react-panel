import React, { useContext } from "react";
import { AuthContext } from "../../context/authenticationContext";
import Layout from "../../layout";
import { Redirect } from "react-router-dom";

export default function PrivateRoute(props) {
  const Component = props.component;
  const route = props.route;
  const { currentUser } = useContext(AuthContext);

  return currentUser ? (
    <Layout title={props.title}>
      <Component route={route} />
    </Layout>
  ) : (
    <Redirect to="/" />
  );
}
