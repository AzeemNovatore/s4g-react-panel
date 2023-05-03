import React from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Tooltip from "react-simple-tooltip";

export default function SingleItemSurvey() {
  const location = useLocation();

  const data = location.state;

  const history = useHistory();

  const movetosurvey = () => {
    history.push("/surveys");
  };
  
  const handleClick=()=> {
    history.goBack();
  };
  return (
    <>
      <div className="main-add-charity">
        <div className="container">
          <div className="row surveydetail-bg">
            <div className="col-lg-6 main-survey-img">
              <div className="survey-img">
                <img src={data?.detail?.data?.survey?.surveyImage} alt="" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="survey-desc">
                <div className="d-flex w-100">
                  <div className="w-50">
                    <h5 className="">Survey Title</h5>
                    <p className="mb-0">{data?.detail?.data?.survey?.title}</p>
                  </div>
                  <div className="w-50">
                    <h5>Survey TagLine</h5>
                    <p className="pb-2 helping-survey mb-0">
                      {data?.detail?.data?.survey?.tagline}
                    </p>
                  </div>
                </div>
                <div className="d-flex w-100 mt-2">
                  <div className="w-50">
                    <h5>Company / Client Name</h5>
                    <p className="mb-0">
                      {data?.detail?.data?.client?.clientName}
                    </p>
                  </div>
                  <div className="w-50">
                    <h5>Reward Tokens</h5>
                    <p className="mb-0">{data?.detail?.data?.reward?.tokens}</p>
                  </div>
                </div>
                <div className="d-flex w-100 mt-2">
                  <div className="w-50">
                    <h5>Gender</h5>
                    <div className="d-flex gap-2">
                      <p className="mb-0 bricks-data">
                        {data?.detail?.data?.target?.gender[0]}
                      </p>
                      {data?.detail?.data?.target?.gender.length > 1 ? (
                        <Tooltip
                          border=""
                          background="#fff"
                          content=<div className="tooltip-item">
                            {" "}
                            {data?.detail?.data?.target?.gender?.map((item) => (
                              <div className="d-flex align-items-center gap-2">
                                <p className="mb-0">{item}</p>
                              </div>
                            ))}
                          </div>
                        >
                          {data?.detail?.data?.target?.relationStatus.length >
                          1 ? (
                            <p className="mb-0 bricks-data">More</p>
                          ) : (
                            ""
                          )}
                        </Tooltip>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="w-50">
                    <h5>Survey Response</h5>
                    <p className="mb-0">
                      {data?.detail?.data?.target?.surveyresponse}
                    </p>
                  </div>
                </div>
                <div className="d-flex w-100 mt-2">
                  <div className="w-50">
                    <h5>Relationship Status</h5>
                    <div className="d-flex gap-2">
                      <p className="mb-0 bricks-data">
                        {data?.detail?.data?.target?.relationStatus[0]}
                      </p>
                      {data?.detail?.data?.target?.relationStatus.length > 1 ? (
                        <Tooltip
                          border=""
                          background="#fff"
                          content=<div className="tooltip-item">
                            {" "}
                            {data?.detail?.data?.target?.relationStatus?.map(
                              (item) => (
                                <div className="d-flex align-items-center gap-2">
                                  <p className="mb-0">{item}</p>
                                </div>
                              )
                            )}
                          </div>
                        >
                          {data?.detail?.data?.target?.relationStatus.length >
                          1 ? (
                            <p className="mb-0 bricks-data">More</p>
                          ) : (
                            ""
                          )}
                        </Tooltip>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="w-50">
                    <h5>Education</h5>
                    <div className="d-flex gap-2">
                      <p className="mb-0 bricks-data">
                        {data?.detail?.data?.target?.education[0]}
                      </p>
                      {data?.detail?.data?.target?.education.length > 1 ? (
                        <Tooltip
                          border=""
                          background="#fff"
                          content=<div className="tooltip-item">
                            {" "}
                            {data?.detail?.data?.target?.education?.map(
                              (item) => (
                                <div className="d-flex align-items-center gap-2">
                                  <p className="mb-0">{item}</p>
                                </div>
                              )
                            )}
                          </div>
                        >
                          {data?.detail?.data?.target?.education.length > 1 ? (
                            <p className="mb-0 bricks-data">More</p>
                          ) : (
                            ""
                          )}
                        </Tooltip>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex w-100 mt-2">
                  <div className="w-50">
                    <h5>Kids</h5>
                    <div className="d-flex gap-2">
                      <p className="mb-0 bricks-data">
                        {data?.detail?.data?.target?.kids[0]}
                      </p>
                      {data?.detail?.data?.target?.kids.length > 1 ? (
                        <Tooltip
                          border=""
                          background="#fff"
                          content=<div className="tooltip-item">
                            {" "}
                            {data?.detail?.data?.target?.kids?.map((item) => (
                              <div className="d-flex align-items-center gap-2">
                                <p className="mb-0">{item}</p>
                              </div>
                            ))}
                          </div>
                        >
                          {data?.detail?.data?.target?.kids.length > 1 ? (
                            <p className="mb-0 bricks-data">More</p>
                          ) : (
                            ""
                          )}
                        </Tooltip>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="w-50">
                    <h5>Age</h5>
                    <div className="d-flex gap-2">
                      <p className="mb-0 bricks-data">
                        {data?.detail?.data?.target?.age[0]}
                      </p>
                      {data?.detail?.data?.target?.age.length > 1 ? (
                        <Tooltip
                          border=""
                          background="#fff"
                          content=<div className="tooltip-item">
                            {" "}
                            {data?.detail?.data?.target?.age?.map((item) => (
                              <div className="d-flex align-items-center gap-2">
                                <p className="mb-0">{item}</p>
                              </div>
                            ))}
                          </div>
                        >
                          {data?.detail?.data?.target?.age.length > 1 ? (
                            <p className="mb-0 bricks-data">More</p>
                          ) : (
                            ""
                          )}
                        </Tooltip>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="charity_ques d-flex justify-content-between">
              <h3>Questions :</h3>
            </div>
            {data?.detail?.data?.survey?.questions?.map((item) => (
              <div className="col-lg-6">
                <div className="single-ques">
                  <label htmlFor="">
                    {item.questionType || item.questiontype}
                  </label>
                  <div className="view_question">
                    <div>
                      <input
                        type="text"
                        value={item.title}
                        // placeholder="Is this video helpful for you or not?"
                      />
                    </div>
                    <div className="imageReference__placeholder">
                      {item.imageref ? <img src={item.imageref} alt="" /> : ""}
                    </div>
                  </div>

                  <div className="main-ques w-100 d-flex">
                    <div className="options w-50">
                      {item.questionType === "VIDEOQUESTION" ||
                      item.questiontype === "VIDEOQUESTION" ||
                      item.questiontype === "FormQuestion" ||
                      item.questionType === "FormQuestion" ? (
                        ""
                      ) : (
                        <h5>Options :</h5>
                      )}
                      {item?.options?.map((item2) => (
                        <p className="px-2">
                          <span> {item2.value}</span>{" "}
                          {item2.title.includes("https://") ? (
                            <img
                              src={item2.title}
                              alt=""
                              className="w-25 mt-5"
                            />
                          ) : (
                            item2.title
                          )}
                        </p>
                      ))}
                    </div>
                    {item.questionType === "VIDEOQUESTION" ||
                    item.questiontype === "VIDEOQUESTION" ? (
                      <div className="ques-video w-50 mt-3">
                        <div id="outer">
                          <video
                            controls
                            class="video"
                            src={item.videoRef}
                          ></video>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <label htmlFor="" className="ps-5 mb-4">
        <input
          type="checkbox"
          className="me-2"
          checked={data?.detail?.data?.target.active}
        />

        {data?.detail?.data?.target.active === true
          ? "Survey is active"
          : "Survey is not Active"}
      </label>
      <div className="check-button">
        <div className="check-box-charity"></div>
        <div class="single_button">
          <div class="back_btn" onClick={() => handleClick()}>
            <button>Back</button>
          </div>
        </div>
      </div>
    </>
  );
}
