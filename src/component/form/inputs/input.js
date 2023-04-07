import React from "react";

export default function InputField({
  label,
  name,
  handleChange,
  formError,
  icon,
}) {
  return (
    <label htmlFor="" className="email">
      {label}
      <div className="feild-icons d-flex">
        {icon ? (
          <div className="icons-feild-2">
            <img src={icon} alt="logo" />
          </div>
        ) : (
          ""
        )}
        <input
          type="email"
          placeholder="Enter your Email"
          name={name}
          onChange={handleChange}
        />
      </div>
      {formError ? <p className="error__msg">{formError}</p> : ""}
    </label>
  );
}
