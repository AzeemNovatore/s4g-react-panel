import React from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function SingleItemClient() {
  const location = useLocation();
  const data = location.state;
  const history = useHistory();

  const handleClick = () => {
    history.goBack();
  };

  return (
    <>
      <div className="main-add-charity">
        <div className="row single-desc">
          <div className="col-md-6 mb-3">
            <h5>Company/ Client Name </h5>
            <p>{data?.detail?.data?.client_name}</p>
          </div>
          <div className="col-md-6 mb-3">
            <h5>Contact Name</h5>
            <p>{data?.detail?.data?.cont_name}</p>
          </div>
          <div className="col-md-6 mb-3">
            <h5>Contact Email Address </h5>
            <p>{data?.detail?.data?.email}</p>
          </div>
          <div className="col-md-6 mb-3">
            <h5>Address</h5>
            <p>
              {data?.detail?.data?.address != ""
                ? data?.detail?.data?.address
                : "No Address Found"}
            </p>
          </div>
          <div className="col-md-6 mb-3">
            <h5>Phone Number </h5>
            <p>
              {data?.detail?.data?.ph_no != ""
                ? data?.detail?.data?.address
                : "No Phone Number Found"}
            </p>
          </div>
          <div className="col-md-6 mb-3">
            <h5>Notes </h5>
            <p>{data?.detail?.data?.note}</p>
          </div>
          <div class="single_button">
            <div class="back_btn" onClick={() => handleClick()}>
              <button>Back</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
