// import Routes from "./routes";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
// import Loader from "./component/loader";
const Routes = React.lazy(() => import("./routes"));
const Loader = React.lazy(() => import("./component/loader"));

export default function App() {
  return (
    <>
      <Loader />
      <ToastContainer />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes />
      </Suspense>
    </>
  );
}
