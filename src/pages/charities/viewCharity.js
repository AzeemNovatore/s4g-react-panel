import React from "react";
import { useLocation } from "react-router-dom";
import ReactSlick from "../../component/reactSlick";
import { useHistory } from "react-router-dom";
import { NoImage } from "../../utils/image";
import Tooltip from "react-simple-tooltip";
import { charities } from "../../routes/pathnames";

export default function SingleItemCharity() {
  const location = useLocation();
  const data = location.state;
  const history = useHistory();

  const movetoCharity = () => {
    history.push(charities);
  };

  return (
    <>
      <div className="main-single-char">
        <div>
          <div className="row">
            <div className="col-lg-5">
              <h4 className="charity-images-head">Charity Image</h4>
              <div className="single-img position-relative">
                <img
                  src={data.detail.charityImage}
                  alt="img"
                  className="w-100"
                />
              </div>
            </div>
            <div className="col-lg-7">
              <div className="single-desc">
                <h5>Charity Name</h5>
                <p>{data.detail.charityName}</p>
                <h5>Charity Tag Line</h5>
                <p>{data.detail.charityTagLine}</p>
                <h5>Raised</h5>
                <p>$ {data.detail.raised}</p>
                {data.detail?.charityCategories?.length === 0 ? (
                  ""
                ) : (
                  <>
                    {" "}
                    <h5 className="mt-2">Category</h5>
                    <div className="d-flex gap-2">
                      <p className="mb-0 bricks-data">
                        {data.detail?.charityCategories[0]}
                      </p>
                      {data.detail?.charityCategories.length > 1 ? (
                        <Tooltip
                          border=""
                          background="#fff"
                          content=<div className="tooltip-item">
                            {" "}
                            {data.detail?.charityCategories?.map((item) => (
                              <div className="d-flex align-items-center gap-2">
                                <p className="mb-0">{item}</p>
                              </div>
                            ))}
                          </div>
                        >
                          {data.detail?.charityCategories.length > 1 ? (
                            <p className="mb-0 bricks-data">More</p>
                          ) : (
                            ""
                          )}
                        </Tooltip>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="desc-data mt-4">
                <h3> Description 1 :</h3>

                <p>{data?.detail?.charityDescription}</p>
              </div>

              <div className="row d-flex justify-content-center">
                <div className="col-xl-3 col-lg-6 mb-3">
                  <div>
                    <h4 className="charity-images-head">Charity Logo Image</h4>
                    {data?.detail?.charityLogoImage ? (
                      <img
                        className="images__view__section"
                        src={data?.detail?.charityLogoImage}
                        alt=""
                      />
                    ) : (
                      <img
                        className="images__view__section"
                        src={NoImage}
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 mb-3">
                  <div>
                    <h4 className="charity-images-head">
                      Charity Head Line Image
                    </h4>

                    {data?.detail?.charityHeadlineImage ? (
                      <img
                        className="images__view__section"
                        src={data?.detail?.charityHeadlineImage}
                        alt=""
                      />
                    ) : (
                      <img
                        className="images__view__section"
                        src={NoImage}
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 mb-3">
                  <div>
                    <h4 className="charity-images-head">Charity Cover Image</h4>
                    {data?.detail?.charityBackgroungImage ? (
                      <img
                        className="images__view__section"
                        src={data?.detail?.charityBackgroungImage}
                        alt=""
                      />
                    ) : (
                      <img
                        className="images__view__section"
                        src={NoImage}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="single-slider">
                <h3 className="mt-3">Secondary Pictures</h3>
                {data.detail.secondaryPictures.length > 3 ? (
                  <ReactSlick singleitem={data.detail.secondaryPictures} />
                ) : (
                  <div className="row">
                    {data.detail.secondaryPictures.map((item) => (
                      <div className="col-xl-4 col-lg-6">
                        <img src={item} alt="" className="sec-pics" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="desc-data mt-4">
                <h3> Description 2 :</h3>

                <p>{data?.detail?.charityDescription2}</p>
              </div>

              <div className="single_button">
                <div className="back_btn">
                  <button onClick={() => movetoCharity()}>back</button>
                </div>
                <div className="donate_btn">
                  <a target="_blank" href={data.detail.donateLink}>
                    <button
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight2"
                      aria-controls="offcanvasRight2"
                    >
                      Donate Link
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <label htmlFor="" className="ps-5 mb-4">
        <input
          type="checkbox"
          className="me-2"
          checked={data.detail.charityActive}
        />

        {data.detail.charityActive === true
          ? "Charity is active"
          : "Charity is Active"}
      </label>
    </>
  );
}
