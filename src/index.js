import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authenticationContext";
import { LoaderContextProvider } from "./context/loadingContext";

import "../src/assets/css/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-sweet-progress/lib/style.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "remixicon/fonts/remixicon.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <LoaderContextProvider>
        <App />
      </LoaderContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
