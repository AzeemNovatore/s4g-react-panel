import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";

export default function Layout(props) {
  return (
    <div className="main__section">
      <Sidebar />
      <div className="each__section">
        <Header title={props.title} />
        {props.children}
      </div>
    </div>
  );
}
