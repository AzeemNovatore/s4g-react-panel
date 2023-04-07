import React from "react";
import { lock } from "../../../utils/image";
import { useState } from "react";
import { passwordHide, passwordShow } from "../../../utils/image";

export default function PasswordInput({
  label,
  name,
  handleChange,
  formError,
  placeholder = "Enter Your Password",
}) {
  const [toggle, setToggle] = useState(false);

  return (
    <label htmlFor="">
      {label}
      <div className="feild-icons d-flex">
        <div className="icons-feild">
          <img src={lock} alt="logo" />
        </div>
        <input
          type={`${toggle ? "text" : "password"}`}
          placeholder={placeholder}
          name={name}
          onChange={handleChange}
        />
        <div className="icons-feild-1">
          <img
            src={toggle ? passwordHide : passwordShow}
            alt=""
            onClick={() => setToggle(!toggle)}
          />
        </div>
      </div>
      {formError ? <p className="error__msg ">{formError}</p> : ""}
    </label>
  );
}
