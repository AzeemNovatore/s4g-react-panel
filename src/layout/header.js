import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authenticationContext";

export default function Header({ title }) {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="d-flex justify-content-between align-items-center bg-light">
      <div className="d-flex align-items-center gap-3">
        <h4 className="mb-0 fw-bold">{title}</h4>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <span className="user__profile">
          <i class="ri-user-fill"></i>
        </span>
        <p className="mb-0 email-head">{currentUser.email}</p>
      </div>
    </div>
  );
}
