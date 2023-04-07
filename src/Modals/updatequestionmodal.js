import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storageGet } from "../services/firebase";
import { LoaderContext } from "../context/loadingContext";
import { toast } from "react-toastify";
import { Camera, Delete, edit } from "../utils/image";
import { ProgressBar } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { compressFile } from "../utils/compressImageFile";
import { async } from "@firebase/util";

export default function Updatequestionmodal({
  questionvalues,
  index,
  formvalues,
  setFormvalues,
  handleClose,
  show,
}) {
  const { setLoading } = useContext(LoaderContext);
  const [loading, setloading] = useState(0);
  const [loadingVideo, setLoadingVideo] = useState(0);
  const [file, setFile] = useState(null);
  const [imgRefFile, setImgRefFile] = useState(null);
  const [optionImageFile, setOptionImageFile] = useState(null);
  const [updateImage, setUpdateImage] = useState(null);
  const [indexImage, setIndexImage] = useState();

  const [state, setState] = useState({
    title: "",
    fieldtype: "",
    fieldid: "",
    questionType: "",
    options: [],
    videoRef: "",
    imageref: "",
  });

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const updateImageHandler = async (e) => {
    const file = await compressFile(e.target.files[0]);
    setUpdateImage(file);
  };

  const handleChange = (e) => {
    if (e.target.files[0].size > 104857600) {
      toast.error(`File Size must be 100MB or less`);
    } else {
      if (e.target.files[0].type === "video/mp4") {
        setFile(e.target.files[0]);
      } else {
        toast.error("Your File must be .mp4");
      }
    }
  };

  const optionImageHandler = async (e) => {
    const file = await compressFile(e.target.files[0]);
    setOptionImageFile(file);
  };

  useEffect(() => {
    const imageUpload = () => {
      setLoading(true);
      try {
        const storage = storageGet;
        // let imagetypefilename = questionvalues?.imageref;
        const name = new Date().getTime() + imgRefFile.name;
        var storagePath = "surveys/imageRefImage/" + name;
        const storageRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(storageRef, imgRefFile);
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
                setState({
                  ...state,
                  imageref: downloadURL,
                });
              },
              setLoading(false),
              toast.success("Question Image Updated Successfully")
            );
          }
          // setQuestionvalues({ ...questionvalues, imageref: null })
        );
      } catch (error) {
        alert(error);
      }
    };
    imgRefFile && imageUpload();
  }, [imgRefFile]);

  useEffect(() => {
    const uploadFile4 = () => {
      setLoading(true);

      const storage = storageGet;
      const name = new Date().getTime() + file.name;

      var storagePath = "surveys/surveyvideos/" + name;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file);
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
              setState({ ...state, videoRef: url });
            },
            setLoading(false),
            toast.success("Video is Updated Successfully")
            // setVideoFile(null)
          );
        }
      );
    };

    file && uploadFile4();
  }, [file]);

  const handleOptionChange = (e, index) => {
    const { name, value } = e.target;

    const list = [...state.options];
    list[index][name] = value;
    setState({ ...state, options: list });
  };

  const update = (e) => {
    e.preventDefault();
    const updated = { ...formvalues };
    updated.survey.questions.splice(index, 1, state);
    setFormvalues({ ...formvalues, ...updated });
    setLoadingVideo(0);
    toast.success("Question Updated Successfully");
    handleClose();
  };

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
          // setLoadingVideo(percent);
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

              // setQuestionvalues({
              //   ...questionvalues,
              //   options: [...questionvalues?.options, { title: url }],
              setState({
                ...state,
                options: [...state?.options, { title: url }],
              });
              // });
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
    setState({
      title: questionvalues?.title,
      fieldtype: questionvalues?.fieldtype,
      fieldid: questionvalues?.fieldid,
      questionType: questionvalues?.questionType,
      options: questionvalues?.options,
      videoRef: questionvalues?.videoRef,
      imageref: questionvalues?.imageref,
    });
  }, [questionvalues]);

  const serviceadd = () => {
    setState({
      ...state,
      options: [...state?.options, { title: "", value: "" }],
    });
  };

  const deleteOption = (index) => {
    state.options?.splice(index, 1);
    setState({
      ...state,
      options: [...state?.options],
    });
  };

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
          // setLoadingVideo(percent);
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
              console.log("imageIndex", indexImage);
              const data = { title: url, value: `${indexImage + 1}A` };
              state.options.splice(indexImage, 1, data);
              setState({
                ...state,
                ...state.options,
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
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Survey Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="" onSubmit={update}>
          <label htmlFor="" className="w-100 fw-bold">
            Title
            <input
              type="text"
              value={state?.title}
              required
              name={"title"}
              onChange={handleValueChange}
              className="form-control mt-1"
            />
          </label>
          <label htmlFor="" className="w-100 fw-bold mt-2">
            Field ID
            <input
              type="text"
              name="fieldid"
              required
              value={state?.fieldid}
              onChange={handleValueChange}
              className="form-control mt-1"
            />
          </label>

          <label htmlFor="" className="w-100 fw-bold mt-2">
            Question Type
            <input
              type="text"
              name="fieldtype"
              value={state?.fieldtype}
              readOnly
              className="form-control mt-1"
            />
          </label>

          <label htmlFor="" className="w-100 fw-bold mt-2">
            Answer Field Type
            <input
              type="text"
              name="questionType"
              value={state?.questionType}
              readOnly
              className="form-control mt-1"
            />
          </label>

          {state?.videoRef && (
            <video
              width="100%"
              height="200px"
              loop="true"
              autoplay="autoplay"
              className="mt-2"
              controls
              src={state.videoRef}
            ></video>
          )}

          {state?.fieldtype === "Video" &&
          state?.questionType === "VIDEOQUESTION" ? (
            <input
              type="file"
              onChange={handleChange}
              className="mt-2 video-upload-input w-100 mb-3"
            />
          ) : (
            ""
          )}
          {loadingVideo !== 0 ? (
            <ProgressBar
              now={loadingVideo}
              label={`${loadingVideo}%`}
              className=""
            />
          ) : (
            ""
          )}

          <div>
            {questionvalues?.questionType === "SINGLEQUESTION" ||
            (questionvalues?.questionType === "MULTIPLEQUESTION" &&
              questionvalues?.fieldtype === "Choice") ||
            questionvalues?.fieldtype === "Image" ? (
              <>
                {state?.imageref && (
                  <>
                    <label htmlFor="" className="w-100 fw-bold mt-2">
                      Image Reference
                    </label>
                    <div className="position-relative">
                      <input
                        type="file"
                        id="imgRef"
                        onChange={(e) => setImgRefFile(e.target.files[0])}
                        className="update_ImgRef"
                      />
                      <label for="imgRef" id="imgRef" className="cameraIcon">
                        <img src={Camera} alt="" />
                      </label>
                      <img
                        src={state.imageref}
                        alt=""
                        className="update_imgRef"
                      />
                    </div>
                  </>
                )}
                <h6 className="mt-3 fw-bold text-center">OPTIONS</h6>
                {questionvalues?.fieldtype === "Choice" ? (
                  state?.options?.length === 4 ? (
                    ""
                  ) : (
                    <div
                      className="d-flex justify-content-between align-items-center py-2 px-3 rounded-3"
                      style={{ background: "skyblue" }}
                    >
                      <div className="position-relative">
                        <input
                          type="text"
                          required
                          className="position-absolute update-option"
                          style={{
                            color: "transparent",
                            background: "transparent",
                            border: "none",
                          }}
                          value={state?.options}
                        />
                        <p className="mb-0">
                          {state?.options?.length === 0
                            ? "No Option is Added"
                            : `${state?.options?.length} Option is Added`}
                        </p>
                      </div>

                      <div className="">
                        <i
                          class="ri-add-box-fill"
                          onClick={() => serviceadd()}
                        ></i>
                      </div>
                    </div>
                  )
                ) : (
                  ""
                )}
                {questionvalues?.fieldtype === "Choice" &&
                  state?.options?.map((item, i) => (
                    <div className="mt-4">
                      <div className="d-flex justify-content-between">
                        <label className="fw-bold">Option {i + 1} </label>

                        <img
                          src={Delete}
                          alt=""
                          style={{ width: "22px" }}
                          onClick={() => deleteOption(i)}
                        />
                      </div>

                      <input
                        type="text"
                        name="value"
                        value={item.value}
                        placeholder="Ex : 1A"
                        onChange={(e) => handleOptionChange(e, i)}
                        className="form-control mt-1"
                      />
                      <input
                        type={`${
                          questionvalues?.fieldtype === "Image" ? "url" : "text"
                        }`}
                        name="title"
                        placeholder={`${
                          questionvalues?.fieldtype === "Image"
                            ? "  https://cdn.pixabay.com/photo/2022/11/20/09/43/moorea-7603918_960_720.jpg"
                            : "Ex : Which is the best place to visit"
                        }`}
                        required
                        value={item.title}
                        onChange={(e) => handleOptionChange(e, i)}
                        className="form-control mt-1"
                      />
                    </div>
                  ))}
              </>
            ) : (
              ""
            )}
            {questionvalues?.fieldtype === "Image" &&
              (state.options?.length === 4 ? (
                ""
              ) : (
                <div
                  className="d-flex justify-content-between align-items-center py-2 px-3 rounded-3"
                  style={{ background: "skyblue" }}
                >
                  <div className="position-relative">
                    <input
                      type="text"
                      required
                      className="position-absolute update-option"
                      style={{
                        color: "transparent",
                        background: "transparent",
                        border: "none",
                      }}
                      value={state?.options}
                    />
                    <p className="mb-0">
                      {state?.options?.length === 0
                        ? "No Option is Added"
                        : `${state?.options?.length} Option is Added`}
                    </p>
                  </div>

                  <div>
                    <input
                      type="file"
                      id="optionImage"
                      onChange={optionImageHandler}
                      style={{ display: "none" }}
                    />
                    <div className="d-flex justify-content-end">
                      <label htmlFor="optionImage" id="optionImage">
                        <i class="ri-add-box-fill"></i>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            {questionvalues?.fieldtype === "Image" &&
              state?.options?.map((item, i) => (
                <div className="mt-4">
                  <div className="d-flex justify-content-between">
                    <label className="fw-bold">Option {i + 1} </label>
                    <div className="d-flex  align-items-center">
                      <img
                        src={Delete}
                        alt=""
                        style={{ width: "24px" }}
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
                          onClick={() => setIndexImage(i)}
                        />
                      </label>
                    </div>
                  </div>
                  <img
                    src={item?.title}
                    alt="optionImage"
                    className="w-100 mt-1"
                    style={{ height: "200px" }}
                  />
                  <input
                    type="text"
                    name="value"
                    required
                    value={item.value}
                    placeholder="Ex : 1A"
                    onChange={(e) => handleOptionChange(e, i)}
                    className="form-control mt-1"
                  />
                  {/* <input
                type={`${
                  questionvalues?.fieldtype === "Image" ? "url" : "text"
                }`}
                name="title"
                required
                readOnly
                value={item.title}
                onChange={(e) => handleOptionChange(e, i)}
                className="form-control mt-1"
              />*/}
                </div>
              ))}
          </div>

          <div class="d-flex justify-content-between mt-3 gap-2 w-100">
            <span
              className="cancel_update_question w-50"
              onClick={handleClose}
              aria-label="Close"
            >
              Cancel
            </span>
            <button className=" update_question w-50" type="submit">
              Update Question
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
