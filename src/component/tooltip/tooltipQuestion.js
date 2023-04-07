import React from "react";

import { Polygon } from "../../utils/image";
export default function TooltipQuestion({
  title,
  subtitle,
  toggle,
  toggle2,
  toggle3,
  toggle4,
  toggle5,
  toggle6,
  toggle7,
  toggle8,
  toggle9,
}) {
  return (
    <div>
      {toggle ||
      toggle2 ||
      toggle3 ||
      toggle4 ||
      toggle5 ||
      toggle6 ||
      toggle7 ||
      toggle8 ||
      toggle9 ? (
        <div>
          <div className="tooltip__question">
            <h5 className="mb-0">{title}</h5>
            <p className="mb-0 sub">{subtitle}</p>
          </div>
          <div className="tooltip-corn">
            <img src={Polygon} alt="" />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
