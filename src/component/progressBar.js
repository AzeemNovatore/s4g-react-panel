import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
export default function ProgressLoading({ progressBar }) {
  return (
    <div>
      {progressBar > 0 && progressBar < 100 ? (
        <ProgressBar
          now={progressBar}
          label={`${progressBar}%`}
          className="mt-2"
        />
      ) : (
        ""
      )}
    </div>
  );
}
