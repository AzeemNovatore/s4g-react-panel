import React from "react";
import ReactPaginate from "react-paginate";
export default function Pagination({ pageCount, handlePageClick }) {
  return (
    <div>
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageClick}
        previousLabel="<"
        nextLabel=">"
        className="paginationBttns"
        activeClassName="activepage"
      />
    </div>
  );
}
