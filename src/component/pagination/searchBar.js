import React from "react";
import { Search } from "../../utils/image";

export default function SearchBar({ setSearch }) {
  return (
    <div className="search-filter">
      <img src={Search} alt="" />
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
