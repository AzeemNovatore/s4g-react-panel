import React, { useContext } from "react";
import { LoaderContext } from "../context/loadingContext";

export default function Loader() {
  const { loading } = useContext(LoaderContext);

  return (
    <>
      {loading && (
        <div className="loader-spinner">
          <div class="spinner"></div>
          {/*<div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
      </div>*/}
        </div>
      )}
    </>
  );
}
