import React from "react";
import { Col } from "reactstrap";
import ReactSlick from "../reactSlick";

export default function BannerCards({
  label,
  dimension,
  images,
  icon,
  type,
  onUpdate,
}) {
  return (
    <Col lg="5" md="5" sm="5" xs="5" className="home-banner">
      <h5 className="mb-0 mt-0">{label}</h5>
      <p className="">
        Total Image ({images?.length})
        <span className="ms-3">
          <span className="fw-normal">{dimension}</span>
        </span>
      </p>
      {images.length > 1 ? (
        <ReactSlick homeBannerList={images ?? []} id="1" />
      ) : (
        <div className="bannerImg">
          <img className="banner-survey" src={images} alt="homeScreen" />
        </div>
      )}
      <button className="update-img-btn" onClick={() => onUpdate(type)}>
        <div className="update-img">
          <img src={icon} alt="img" />
        </div>
        Update Image
      </button>
    </Col>
  );
}
