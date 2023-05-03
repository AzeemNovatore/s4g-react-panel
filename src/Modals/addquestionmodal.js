import React, { useContext, useState } from "react";
import { storageGet } from "../services/firebase";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { Delete, Question, edit } from "../utils/image";

import TooltipQuestion from "../component/tooltip/tooltipQuestion";
import { LoaderContext } from "../context/loadingContext";
import { useEffect } from "react";
import { compressFile } from "../utils/compressImageFile";
import { async } from "@firebase/util";

export default function Addquestionmodal({
  handleChange,
  questionvalues,
  addqustions,
  setQuestionvalues,
  questionvideohandler,
  imageReffile,
  initialquestoinsvalues,
  uploadVideoBoolean,
  otherOptionBoolean,
  videoFile,
  setOptionvalues,
  optionvalues,
}) {
  const [loading, setloading] = useState(0);
  const [loadingVideo, setLoadingVideo] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);
  const [toggle4, setToggle4] = useState(false);
  const [optionImageFile, setOptionImageFile] = useState(null);
  const [updateImage, setUpdateImage] = useState(null);
  const [index, setIndex] = useState();
  const [addInput, setAddInput] = useState(false);


  const { setLoading } = useContext(LoaderContext);

  const serviceadd = () => {
    setQuestionvalues({
      ...questionvalues,
      options: [...questionvalues?.options, { title: "", value: "" }],
    });
  };

  const optionAddHandler = (e, index) => {
    const { name, value } = e.target;
    const list = [...questionvalues.options];
    list[index][name] = value;
    setQuestionvalues({ ...questionvalues, options: list });
  };

  // const optionAddHandler = (e, index) => {
  //   const { name, value } = e.target;
  //   const list = [...questionvalues.options];
  //   list[index][name] = value;
  //   if (list[index].title && list[index].value && list[index].title !== list[index].value) {
  //     list[index].error = "Title and Value must be same";
  //   } else {
  //     delete list[index].error;
  //   }
  //   setQuestionvalues({ ...questionvalues, options: list });
  // };
  

  const optionImageHandler = async (e) => {
    console.log("e.target.files[0]", e.target.files[0]);
    const file = await compressFile(e.target.files[0]);
    setOptionImageFile(file);
  };

  const updateImageHandler = async (e) => {
    const file = await compressFile(e.target.files[0]);
    setUpdateImage(file);
  };
  console.log("index", index);

  const formReset = () => {
    setQuestionvalues({ ...questionvalues, ...initialquestoinsvalues });
    setloading(0);
    setLoadingVideo(0);
  };

  // const handleInputClick= (i)=>{
  //   if(!addInput){
  //   setAddInput(true)
  //   setQuestionvalues({...questionvalues, isOther: true})
  //   setIndex(i)
  //   // setQuestionvalues({
  //   //   ...questionvalues,
  //   //   options: [...questionvalues?.options, { title: "", value: "" }],
  //   // });
  //   }
  //   else{
  //     setAddInput(false)
  //     setIndex(null)
  //     setQuestionvalues(current => {
  //       const {isOther, ...rest} = current;

  //       return rest;
  //     });
  //   }
  // }

  const handleInputClick = (i) => {
    if (!addInput) {
      setAddInput(true);
      setIndex(i);

      setQuestionvalues((current) => {
        const list = [...current.options];
        list[i].isOther = true;
        return { ...current, options: list };
      });
    } else {
      setAddInput(false);
      setIndex(null);

      setQuestionvalues((current) => {
        const list = [...current.options];
        delete list[i].isOther;
        return { ...current, options: list };
      });
    }
  };
  

  const imageupload = () => {
    setLoading(true);
    try {
      const storage = storageGet;
      let imagetypefilename = questionvalues?.imageref;
      var storagePath = "surveys/imageRefImage/" + imagetypefilename?.name;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, imagetypefilename);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progrss function ....
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const imagetype = Math.trunc(progress);
          setloading(imagetype);
        },
        (error) => {
          // error function ....
          alert(error);
        },

        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then(
            (downloadURL) => {
              setQuestionvalues({
                ...questionvalues,
                imageref: imagetypefilename.name ? downloadURL : "",
              });
            },
            setLoading(false),
            toast.success("Question Image Added Successfully")
          );
        }
        // setQuestionvalues({ ...questionvalues, imageref: null })
      );
    } catch (error) {
      alert(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      videoFile === null &&
      questionvalues.questionType !== "FormQuestion" &&
      questionvalues.questionType !== "SINGLEQUESTION" &&
      questionvalues.questionType !== "MULTIPLEQUESTION" &&
      questionvalues.questionType !== "Choice"
    ) {
      toast.error("File Size must be 100MB or less");
    }

    // if (videoFile && videoFile === null) {
    //   toast.error("error");
    // } else {
    else {
      toast.success("Question is Added Successfully");
      addqustions();
      setloading(0);
      setLoadingVideo(0);
    }
    // }
  };

  const deleteOption = (index) => {
    questionvalues.options?.splice(index, 1);
    setQuestionvalues({
      ...questionvalues,
      options: [...questionvalues?.options],
    });
  };

  useEffect(() => {
    if (questionvalues) {
      console.log("first");
    }
  }, [uploadVideoBoolean]);

  useEffect(() => {
    const uploadFile4 = () => {
      setLoading(true);
      // const storage = storageGet;
      // const name = new Date().getTime() + charityBackImageFile.name;
      // const storagePath = `charities/charityCoverImages/${name}`;
      // const storageRef = ref(storage, storagePath);
      const storage = storageGet;
      const name = new Date().getTime() + videoFile.name;

      var storagePath = "surveys/surveyvideos/" + name;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, videoFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const percent = Math.trunc(progress);
          setLoadingVideo(percent);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },

        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then(
            (url) => {
              setQuestionvalues({ ...questionvalues, videoRef: url });
            },
            setLoading(false),
            toast.success("Video is added Successfully")
            // setVideoFile(null)
          );
        }
      );
    };

    videoFile && uploadFile4();
  }, [videoFile]);

  useEffect(() => {
    const uploadFile5 = () => {
      setLoading(true);
      const storage = storageGet;
      const name = new Date().getTime() + optionImageFile.name;

      var storagePath = "surveys/questionOptionImages/" + name;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, optionImageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const percent = Math.trunc(progress);
          setLoadingVideo(percent);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },

        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then(
            (url) => {
              // setImageUrl((prev) => [...prev, url]);
              // setOptionvalues({
              //   ...optionvalues,
              //   imageUrl: [...imageUrl, url],
              // });

              setQuestionvalues({
                ...questionvalues,
                options: [...questionvalues?.options, { title: url }],
              });
            },
            setLoading(false),
            toast.success("Option Image is added Successfully"),
            setOptionImageFile(null)
            // setVideoFile(null)
          );
        }
      );
    };

    optionImageFile && uploadFile5();
  }, [optionImageFile]);
  useEffect(() => {
    const uploadFile5 = () => {
      setLoading(true);
      const storage = storageGet;
      const name = new Date().getTime() + updateImage.name;

      var storagePath = "surveys/questionOptionImages/" + name;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, updateImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const percent = Math.trunc(progress);
          setLoadingVideo(percent);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },

        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then(
            (url) => {
              const state = { title: url, value: `${index + 1}A` };
              questionvalues.options.splice(index, 1, state);
              setQuestionvalues({
                ...questionvalues,
                ...questionvalues.options,
              });
            },
            setLoading(false),
            toast.success("Option Image is Updated Successfully"),
            setOptionImageFile(null)
            // setVideoFile(null)
          );
        }
      );
    };

    updateImage && uploadFile5();
  }, [updateImage]);

  return (
    <>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header modal-question">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Add Survey
              </h1>
              <span
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={formReset}
              ></span>
            </div>
            <form onSubmit={(e)=>handleSubmit(e)}>
              <div class="modal-body modal-question">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mt-2 mb-0">Question Title</p>
                  <div>
                    <TooltipQuestion
                      title="Question title"
                      subtitle="Question Subtitle Question Subtitle Question Subtitle"
                      toggle={toggle}
                    />
                    <div className="d-flex justify-content-end">
                      <img
                        src={Question}
                        alt=""
                        onClick={() => setToggle(!toggle)}
                      />
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  data-obj="survey"
                  name="title"
                  required
                  className="form-control w-100 mt-2"
                  value={questionvalues.title}
                  placeholder="Enter your question title"
                  onChange={handleChange}
                />

                <div className="d-flex justify-content-between align-items-center">
                  <p className="mt-2 mb-0">Question Field ID</p>
                  <div>
                    <TooltipQuestion
                      title="Question Field ID"
                      subtitle="Question Field id Question Field id Question Field id"
                      toggle2={toggle2}
                    />
                    <div className="d-flex justify-content-end">
                      <img
                        src={Question}
                        alt=""
                        onClick={() => setToggle2(!toggle2)}
                      />
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  data-obj="survey"
                  name="fieldid"
                  required
                  value={questionvalues.fieldid}
                  className=" form-control w-100 mt-2"
                  placeholder="Enter your question fieldid"
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mt-2 mb-0 field__compulsory">
                    Question Type <span>*</span>{" "}
                  </p>

                  <div>
                    <TooltipQuestion
                      title="Question Field Type"
                      subtitle="Question Type id Question Type id Question Field Type"
                      toggle3={toggle3}
                    />
                    <div className="d-flex justify-content-end">
                      <img
                        src={Question}
                        alt=""
                        onClick={() => setToggle3(!toggle3)}
                      />
                    </div>
                  </div>
                </div>
                <div className="position-relative">
                  <select
                    id="fieldtype"
                    required
                    className="w-100 p-2 mt-2"
                    value={questionvalues.fieldtype}
                    onChange={(e) =>
                      setQuestionvalues({
                        ...questionvalues,
                        fieldtype: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Image">Image</option>
                    <option value="Choice">Choice</option>
                    <option value="Video">Video</option>
                    <option value="Answer">Answer</option>
                  </select>
                  {loading !== 0 && loading !== 100 ? (
                    <ProgressBar
                      now={loading}
                      label={`${loading}%`}
                      className="mt-2"
                    />
                  ) : (
                    ""
                  )}

                  <div className="question__placeholder__img">
                    {questionvalues.fieldtype === "Image" ||
                    questionvalues.fieldtype === "Choice" ||
                    questionvalues.fieldtype === "Answer" ? (
                      <>
                        <input
                          type="file"
                          id="imageinput"
                          onChange={imageReffile}
                          className="question-answertype-input"
                        />
                        <label htmlFor="imageinput" id="imageinput">
                          <i class="ri-image-add-fill fs-5"></i>
                        </label>{" "}
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mt-2 mb-0 field__compulsory">
                    {" "}
                    Answer Field Type <span>*</span>{" "}
                  </p>
                  <div>
                    <TooltipQuestion
                      title="Question Type"
                      subtitle="Question Type Question Type  Question Type"
                      toggle4={toggle4}
                    />
                    <div className="d-flex justify-content-end">
                      <img
                        src={Question}
                        alt=""
                        onClick={() => setToggle4(!toggle4)}
                      />
                    </div>
                  </div>
                </div>
                <select
                  id="questionType"
                  required
                  className="w-100 p-2 mt-2"
                  value={questionvalues.questionType}
                  onChange={(e) =>
                    setQuestionvalues({
                      ...questionvalues,
                      questionType: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  {questionvalues?.fieldtype === "Image" ? (
                    <>
                      {" "}
                      <option value="SINGLEQUESTION">Check Box</option>
                      <option value="MULTIPLEQUESTION">
                        Multiple Choice
                      </option>{" "}
                    </>
                  ) : questionvalues?.fieldtype === "Choice" ? (
                    <>
                      <option value="SINGLEQUESTION">Check Box</option>
                      <option value="MULTIPLEQUESTION">Multiple Choice</option>
                    </>
                  ) : (
                    ""
                  )}
                  {questionvalues?.fieldtype === "Answer" ? (
                    <option value="FormQuestion">Free Form</option>
                  ) : (
                    ""
                  )}
                  {questionvalues?.fieldtype === "Video" ? (
                    <option value="VIDEOQUESTION">VIDEOQUESTION</option>
                  ) : (
                    ""
                  )}
                </select>
                {(questionvalues?.questionType === "SINGLEQUESTION" ||
                  questionvalues?.questionType === "MULTIPLEQUESTION") &&
                questionvalues?.fieldtype === "Choice" ? (
                  <>
                    {/* {questionvalues?.options?.length === 4 ? (
                      ""
                    ) : (
                      
                    )} */}

                    <div className="options__section mt-3">
                        <div className="options__empty">
                          <p>
                            {questionvalues?.options.length === 0
                              ? "No option is Added"
                              : `${questionvalues?.options.length} Option is Added`}
                          </p>
                        </div>
                        <input
                          type="text"
                          className="w-100 option-values"
                          required
                          value={questionvalues?.options}
                        />
                        <div className="option__add">
                          <i
                            class="ri-add-box-fill"
                            onClick={() => serviceadd()}
                          ></i>
                        </div>
                      </div>

                    {questionvalues?.options?.map((item, i) => (

                      <>
                      {console.log(item,"specify value")}
                        <p className="mb-1 mt-2">Options {i + 1}</p>

                        <div className="d-flex justify-content-end mb-2 me-2">
                          <img
                            src={Delete}
                            className="delete__option__icon"
                            onClick={() => deleteOption(i)}
                          />
                        </div>

                        <input
                          type="text"
                          name="title"
                          required
                          className="form-control"
                          placeholder="Enter Option Title"
                          value={item.title}
                          onChange={(e) => optionAddHandler(e, i)}
                        />
                        <input
                          type="text"
                          name="value"
                          required
                          className="form-control mt-2"
                          placeholder="Enter Option Value"
                          value={item.value = item.title}
                          // onChange={(e) => optionAddHandler(e, i)}
                          disabled
                          hidden
                        />
                        {questionvalues?.questionType === "SINGLEQUESTION" ?
                        <>
                        { addInput && index === i ? 
                        <input
                          type="text"
                          name="Other"
                          className="form-control mt-2"
                          placeholder="Other"
                          disabled
                        />:<></>
                        }
                        {index === i || !addInput ? <div className="draft_btn d-flex justify-content-end mt-3 me-2">
                        <button className="m-0" onClick={()=> {
                         handleInputClick(i)}} type="button"
                          >{addInput ? "Remove Field" :"Add Field"}</button>
                      </div>:<></>}</>: <></>}
                      </>
                    ))}
                  </>
                ) : (questionvalues?.questionType === "SINGLEQUESTION" ||
                    questionvalues?.questionType === "MULTIPLEQUESTION") &&
                  questionvalues?.fieldtype === "Image" ? (
                  <>
                    {/* {questionvalues?.options?.length === 4 ? (
                      ""
                    ) : (
                      // <input type="file" onChange={optionImageHandler} />
                    
                    )} */}

                  <div className="options__section mt-3">
                        <div className="options__empty">
                          <p>
                            {questionvalues?.options.length === 0
                              ? "No option is Added"
                              : `${questionvalues?.options.length} Option is Added`}
                          </p>
                        </div>
                        <input
                          type="text"
                          className="w-100 option-values"
                          required
                          value={questionvalues?.options}
                        />
                        <input
                          type="file"
                          id="optionImage"
                          onChange={optionImageHandler}
                          style={{ display: "none" }}
                        />
                        <div className="option__add">
                          <label htmlFor="optionImage" id="optionImage">
                            <i class="ri-add-box-fill"></i>
                          </label>
                        </div>
                      </div>

                    {questionvalues?.options?.map((item, i) => (
                      <>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <p className="mb-1 mt-2">Options {i + 1}</p>
                          <div className="d-flex justify-content-end me-2">
                            <img
                              src={Delete}
                              className="delete__option__icon"
                              onClick={() => deleteOption(i)}
                            />

                            <input
                              type="file"
                              id="updateImage"
                              onChange={updateImageHandler}
                              style={{ display: "none" }}
                            />
                            <label htmlFor="updateImage" id="updateImage">
                              <img
                                src={edit}
                                style={{ width: "20px" }}
                                className="ms-1"
                                onClick={() => setIndex(i)}
                              />
                            </label>
                          </div>
                        </div>
                        <img
                          src={item?.title}
                          alt="optionImage"
                          className="w-100"
                          style={{ height: "200px" }}
                        />
                        {/* <input
                          type="url"
                          name="title"
                          required
                          readOnly
                          className="form-control"
                          placeholder="http://Pixabay1604535739.com"
                          defaultValue={item?.title}
                          onChange={(e) => optionAddHandler(e, i)}
                    /> */}
                        <input
                          type="text"
                          name="value"
                          required
                          className="form-control mt-2"
                          placeholder="Ex : 1A"
                          value={item.value}
                          onChange={(e) => optionAddHandler(e, i)}
                        />
                      </>
                    ))}
                  </>
                ) : questionvalues?.questionType === "VIDEOQUESTION" &&
                  questionvalues?.fieldtype === "Video" ? (
                  <>
                    <input
                      type="file"
                      accept="video/mp4,video/x-m4v,video/*"
                      required
                      onChange={questionvideohandler}
                      className="mt-2 video-upload-input w-100 mb-3"
                    />

                    {loadingVideo !== 0 ? (
                      <ProgressBar
                        now={loadingVideo}
                        label={`${loadingVideo}%`}
                        className=""
                      />
                    ) : (
                      ""
                    )}
                    {questionvalues.videoRef && (
                      <video
                        width="100%"
                        height="200px"
                        className="mt-2"
                        controls
                        autoplay
                        src={questionvalues.videoRef}
                      ></video>
                    )}
                  </>
                ) : questionvalues?.questionType === "Image" &&
                  questionvalues?.fieldtype === "Image" ? (
                  <div>
                    <>
                      {/* {questionvalues?.options?.length === 4 ? (
                        ""
                      ) : (
                      
                      )} */}
                      <div className="add-question">
                          <p className="add-option">add option</p>
                          <i
                            class="ri-add-box-fill"
                            onClick={() => serviceadd()}
                          ></i>
                        </div>
                    </>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div class="modal-footer modal-question">
                <span
                  className="cancel-btn text-center"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={formReset}
                >
                  Cancel
                </span>
                {questionvalues.imageref?.name ? (
                  <span
                    className="add-question-btn text-center"
                    onClick={() => imageupload()}
                  >
                    Upload Image
                  </span>
                ) : !questionvalues.imageref?.name ? (
                  <button className="add-question-btn" type="submit">
                    Add Question
                  </button>
                ) : (
                  ""
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
