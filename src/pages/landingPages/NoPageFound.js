import React from "react";
import { NoPageFoundImage } from "../../utils/image";
import { useHistory } from "react-router-dom";

export default function NoPageFound() {
  const history = useHistory();

  const loginPage = () => history.push("/");

  return (
    <div className="no_page_found">
      <div>
        <h1>404</h1>
        <h5>Oops! Page not found.</h5>
        <p>We couldn’t find the page you are looking for.</p>
        <button onClick={loginPage}>Go to Login</button>
        <img src={NoPageFoundImage} alt="" />
      </div>
    </div>
  );
}
