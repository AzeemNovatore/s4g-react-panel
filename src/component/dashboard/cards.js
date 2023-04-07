import React from "react";

export default function Cards({ icon, data, label }) {
  return (
    <div className="col-xl-4 col-lg-6">
      <div className="count__section d-flex gap-4 align-items-center">
        <div className="HeartIcon">
          <img src={icon} alt="img" />
        </div>
        <div className="flex-1">
          <h2>{data}</h2>
          <p>{label}</p>
        </div>
      </div>
    </div>
  );
}
