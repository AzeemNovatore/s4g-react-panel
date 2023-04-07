import React from "react";

export default function ItemsPerPage({ itemSinglePage, setItemSinglePage }) {
  return (
    <form action="" className="form-action">
      <label for="num"> Show </label>
      <select
        value={itemSinglePage}
        onChange={(e) => setItemSinglePage(e.target.value)}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </form>
  );
}
