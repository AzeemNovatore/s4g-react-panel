import React from "react";

export default function HomeBannerImages({
  homeBannerImages,
  deleteBannerHome,
}) {
  return (
    <div className="banner-image-scroll">
      {homeBannerImages?.map((item, i) => (
        <div className="position-relative">
          <img src={item} alt="" className="update__banner__home" />
          <div
            className="cross-banner-home"
            onClick={() => deleteBannerHome(i)}
          >
            <p className="mb-0">X</p>
          </div>
        </div>
      ))}
    </div>
  );
}
