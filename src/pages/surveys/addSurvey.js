import React from "react";
import { uploadImg, Delete, NoImage } from "../../utils/image";
import { useState, useEffect } from "react";
import { collection, doc } from "firebase/firestore";
import DateTimePicker from "react-datetime-picker";
import { collections, db, storageGet } from "../../services/firebase";
import moment from "moment";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Ages, Genders, Educations, Relations, Kids } from "../../constants";
import { ref, uploadBytesResumable } from "firebase/storage";
import Addquestionmodal from "../../Modals/addquestionmodal";
import Dropdowndemographics from "../../component/dropdown/dropdowndemographics";
import { LoaderContext } from "../../context/loadingContext";
import { useContext } from "react";
import {
  addSurveyDoc,
  downloadImageUrl,
} from "../../services/firebase/actions";
import { surveys, drafts } from "../../routes/pathnames";
import { dimensions } from "../../constants";
import useClients from "../../hooks/useClients";
import Dropdownclientsurvey from "../../component/dropdown/dropdownclientsurvey";

export default function AddSurvey() {
  // sruveys add all values
  const initialformvalues = {
    client: {
      clientName: "",
      clientid: "",
    },
    reward: {
      tokens: "",
    },
    survey: {
      questions: [],
      surveyImage: null,
      tagline: "",
      title: "",
    },
    target: {
      active: false,
      age: [],
      gender: [],
      surveyresponse: "",
      relationshipstatus: [],
      kids: [],
      education: [],
      from: null,
      to: null,
    },
  };
  //add questions values
  const initialquestoinsvalues = {
    title: "",
    fieldid: "",
    fieldtype: "",
    questionType: "",
    imageref: null,
    options: [],
    videoRef: "",
    // specify: ""
  };

  //add options values
  const initialoptionvalues = {
    value: "",
    title: "",
    imageUrl: [],
  };
  const history = useHistory();
  const [formvalues, setFormvalues] = useState({ ...initialformvalues });
  const [previewImage, setPreviewImage] = useState(uploadImg);
  const [isDraft, setIsDraft] = useState(false);
  const [formError, setFormError] = useState({});
  const [videoFile, setVideoFile] = useState(null);
  const { setLoading } = useContext(LoaderContext);
  const [uploadVideoBoolean, setUploadVideoBoolean] = useState(true);
  // const [otherOptionBoolean, setOtherOptionBoolean] = useState(false);
  const [questionvalues, setQuestionvalues] = useState({
    ...initialquestoinsvalues,
  });
  const { clients } = useClients();
  const [clientsNames, setClientsNames] = useState([]);
  const [optionvalues, setOptionvalues] = useState(initialoptionvalues);

  //main handle change
  const handleChange = (e) => {
    const { name, type, value, dataset, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormvalues((prev) =>
      dataset?.obj
        ? {
            ...prev,
            [dataset.obj]: {
              ...prev?.[dataset.obj],
              [name]: val,
            },
          }
        : {
            ...prev,
            [name]: val,
          }
    );
  };
  //from datetime handler
  const fromChangeHandler = (event) => {
    const newState = { ...formvalues };
    newState.target.from = event;
    setFormvalues(newState);
  };

  //to datetime Handler
  const toChangeHandler = (event) => {
    const newState = { ...formvalues };
    newState.target.to = event;
    setFormvalues(newState);
  };

  const onSelectedChangeDrop = (name, value) => {
    setFormvalues({
      ...formvalues,
      target: { ...formvalues.target, [name]: value },
    });
  };
  

  const imageHandler = (e) => {
    const { dataset } = e.target;

    setFormvalues((prev) =>
      dataset?.obj
        ? {
            ...prev,
            [dataset.obj]: {
              ...prev?.[dataset.obj],
              surveyImage: e.target.files[0],
            },
          }
        : ""
    );
  };

  //question handle change
  const questionimagehandler = (e) => {
    setQuestionvalues({ ...questionvalues, imageref: e.target.files[0] });
  };

  const questionvideohandler = (e) => {
    if (e.target.files[0].size > 104857600) {
      toast.error(`File Size must be 100MB or less`);
      setUploadVideoBoolean(false);
    } else {
      console.log("file", e.target.files[0]);
      // setQuestionvalues({ ...questionvalues, videoRef: e.target.files[0] });
      if (e.target.files[0].type === "video/mp4") {
        setUploadVideoBoolean(true);
        setVideoFile(e.target.files[0]);
      } else {
        toast.error("Your File must be .mp4");
      }
    }
    // }
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionvalues({ ...questionvalues, [name]: value });
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptionvalues({ ...optionvalues, [name]: value });
  };

  const imageReffile = (e) => {
    // const { name, value } = e.target.files[0];
    setQuestionvalues({ ...questionvalues, imageref: e.target.files[0] });
  };

  const onSelectChange = (name, value) =>
    setQuestionvalues({ ...questionvalues, [name]: value });
     
  const addqustions = () => {
    const updated = { ...formvalues };
    updated.survey.questions.push({ ...questionvalues });
    setFormvalues({ ...formvalues, ...updated });

    setQuestionvalues({ ...questionvalues, ...initialquestoinsvalues });
    setVideoFile(null);
  };

  const addoptions = () => {
    const updated = { ...questionvalues };

    updated.options.push({ ...optionvalues });
    setQuestionvalues({ ...questionvalues, ...updated });

    setOptionvalues({
      ...optionvalues,
      ...initialoptionvalues,
    });
  };

  const deleteQuestion = (index) => {
    formvalues?.survey?.questions?.splice(index, 1);
    setFormvalues({ ...formvalues, questions: formvalues?.survey?.questions });
  };


  const onClientChange = (value, step,key) =>{
    setFormvalues((prev)=> ({
      ...prev,
      [step]:{
        ...prev[step],
        [key]: value?.label,
        clientid: value?.id,
      }
    }))
    
  } 
  
  useEffect(() => {
    if (clients?.length > 0) {
      let client = []
      const clientsNames = clients?.map((item,idx)=> {
        const obj = {
          label: item?.data?.client_name,
          value: item?.data?.client_name,
          id: item?.data?.clientid
      }
      client.push(obj)
      
    })
    setClientsNames(client)
  }
  }, [clients]);

  useEffect(() => {
    if (isDraft) {
      handleSubmit();
    }
  }, [isDraft]);

  // const addToDraft = () => {
  //   setFormvalues({...formvalues , target : { ...formvalues.target, isDraft: true }});
  //   console.log("first", formvalues?.target?.isDraft);
  // };

  const handleSubmit = async (e) => {
    //   e.preventDefault();
    // const validateForm = validate(formValues);
    // setFormError(validateForm);

    const storage = storageGet;
    let surveyimagefile = formvalues.survey.surveyImage;
    const d = new Date();
    let ms = d.getMilliseconds();

    var storagePath =
      "surveys/surveyImages/" + `${surveyimagefile?.name}_${ms}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, surveyimagefile);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setLoading(true);
    try {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progrss function ....
          // const progress =
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },

        (error) => {
          // error function ....
          alert(error);
        },

        async () => {
          await downloadImageUrl(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              const children = [...formvalues.target.age];
              const mappedData = children?.length
                ? children.map((el) => el.value)
                : [];
              const selectedAges = [].concat.apply([], mappedData);
              const ageIds = formvalues.target.age.map((item) => item.id);
              const genderval = formvalues.target.gender.map(
                (item) => item.value
              );
              const kidsval = formvalues.target.kids.map((item) => item.value);
              const relationval = formvalues.target.relationshipstatus.map(
                (item) => item.value
              );
              const educationval = formvalues.target.education.map(
                (item) => item.value
              );

              const currentDate = new Date();

              const newDocRef = doc(collection(db, collections.survey));
              const payload = {
                client: {
                  clientName: formvalues?.client?.clientName,
                  clientid: formvalues.client.clientid,
                },
                reward: {
                  tokens: parseInt(formvalues.reward.tokens),
                },

                survey: {
                  questions: formvalues.survey.questions,
                  surveyImage: surveyimagefile?.name ? downloadURL : NoImage,
                  tagline: formvalues.survey.tagline,
                  title: formvalues.survey.title,
                },

                surveyid: newDocRef.id,
                target: {
                  active:
                    formvalues.target.from > currentDate
                      ? false
                      : isDraft
                      ? false
                      : formvalues.target.active,
                  isDraft: isDraft ? true : false,
                  ageIds: ageIds,
                  age: selectedAges,
                  gender: genderval,
                  relationStatus: relationval,
                  surveyresponse: parseInt(formvalues.target.surveyresponse),
                  kids: kidsval,
                  education: educationval,
                  from: formvalues.target.from,
                  to: formvalues.target.to,
                },
              };
              await addSurveyDoc(newDocRef, payload);
            }
          );
          toast.success("Survey is Added Successfully");
          setLoading(false);
          if (isDraft) {
            history.push(drafts);
          } else {
            history.push(surveys);
          }
        }
      );
      setFormvalues({ ...formvalues, ...initialformvalues });
    } catch (error) {
      alert(error);
    }
  };

  const addDataList = () => {
    // if (formvalues.target.active) {
    const validateForm = validate(formvalues);
    setFormError(validateForm);

    if (Object.keys(validateForm)?.length > 0)
      return toast.error("Fields are Empty");
    // }

    handleSubmit();
  };

  const validate = (values) => {
    const errors = {
      survey: {},
      client: {},
      target: {},
      reward: {},
    };
    if (!values?.survey?.title) {
      errors.survey.title = "Survey Title is Required";
    }
    if (!values?.survey?.tagline) {
      errors.survey.tagline = "Survey Tag Line is Required";
    }
    if (!values?.survey?.surveyImage) {
      errors.survey.surveyImage = "Survey Image is Required";
    }
    if (!values?.survey?.questions || values.survey?.questions?.length === 0) {
      errors.survey.questions = "Questions is Required";
    }
    if (!values?.client?.clientName) {
      errors.client.clientName = "Client Name is Required";
    }
    // if (!values?.client?.clientid) {
    //   errors.client.clientid = "Client ID is Required";
    // }
    if (!values?.target?.age || values.target?.age?.length === 0) {
      errors.target.age = "Age is Required";
    }
    if (!values?.reward?.tokens) {
      errors.reward.tokens = "Tokens is Required";
    }
    if (!values?.target?.gender || values.target.gender.length === 0) {
      errors.target.gender = "Gender is Required";
    }
    if (
      !values?.target?.relationshipstatus ||
      values.target?.relationshipstatus?.length === 0
    ) {
      errors.target.relationshipstatus = "Relation Status is Required";
    }
    if (!values?.target?.kids || values.target?.kids?.length === 0) {
      errors.target.kids = "Kids is Required";
    }
    if (!values?.target?.education || values.target?.education?.length === 0) {
      errors.target.education = "Education is Required";
    }
    if (!values?.target?.surveyresponse) {
      errors.target.surveyresponse = "Survey Response is Required";
    }
    if (!values?.target?.from) {
      errors.target.from = "From Date is Required";
    }
    if (!values?.target?.to) {
      errors.target.to = "To Date is Required";
    }

    Object.keys(errors).map((key) => {
      if (Object.keys(errors[key])?.length === 0) delete errors[key];
    });

    return errors;
  };

  const movetosurvey = () => {
    history.push(surveys);
  };

  useEffect(() => {
    if (!formvalues?.survey?.surveyImage) {
      return;
    }
    const filereader = new FileReader();
    filereader.onload = () => {
      setPreviewImage(filereader.result);
    };
    filereader.readAsDataURL(formvalues?.survey?.surveyImage);
  }, [formvalues?.survey?.surveyImage]);
  // console.log(formvalues?.client?.clientName,"client name");
  // console.log(formvalues?.client?.clientid,"client id");
  return (
    <>
      <Addquestionmodal
        handleOptionChange={handleOptionChange}
        questionimagehandler={questionimagehandler}
        addoptions={addoptions}
        optionvalues={optionvalues}
        addqustions={addqustions}
        onSelectChange={onSelectChange}
        questionvalues={questionvalues}
        handleChange={handleQuestionChange}
        setQuestionvalues={setQuestionvalues}
        questionvideohandler={questionvideohandler}
        imageReffile={imageReffile}
        initialquestoinsvalues={initialquestoinsvalues}
        uploadVideoBoolean={uploadVideoBoolean}
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        setOptionvalues={setOptionvalues}
      />
      <div class="back_btn mt-3 ms-4" onClick={() => movetosurvey()}>
        <button>Back</button>
      </div>
      <div className="main-add-charity">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  {" "}
                  Survey Title <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="text"
                  name="title"
                  value={formvalues?.survey?.title}
                  data-obj="survey"
                  placeholder="enter your survey title"
                  onChange={handleChange}
                />
                {formError?.survey?.title ? (
                  <p className="error__msg ">{formError?.survey?.title}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity ">
                <label>
                  {" "}
                  Survey Tag Line <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="text"
                  name="tagline"
                  value={formvalues?.survey?.tagline}
                  data-obj="survey"
                  placeholder="enter your survey tag line"
                  onChange={handleChange}
                />
                {formError?.survey?.tagline ? (
                  <p className="error__msg ">{formError?.survey?.tagline}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="">
                <label className="fw-bold">
                  {" "}
                  Company / Client Name <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdownclientsurvey 
                  options={clientsNames ?? []} 
                  defaultValue={formvalues?.client?.clientName} 
                  handleChange={onClientChange} 
                  />
                {formError?.client?.clientName ? (
                  <p className="error__msg ">
                    {formError?.client?.clientName}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity ">
                <label>
                  {" "}
                  Client ID <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="text"
                  name="clientid"
                  value={formvalues?.client?.clientid}
                  data-obj="client"
                  placeholder=""
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>

            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity ">
                <label>
                  {" "}
                  Survey Response <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="number"
                  name="surveyresponse"
                  value={formvalues?.target?.surveyresponse}
                  data-obj="target"
                  placeholder="Ex : 100"
                  onChange={handleChange}
                />
                {formError?.target?.surveyresponse ? (
                  <p className="error__msg ">
                    {formError?.target?.surveyresponse}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="">
                <label className="fw-bold">
                  {" "}
                  Age <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Ages}
                  selected={formvalues?.target?.age}
                  handleChange={onSelectedChangeDrop}
                  label="age"
                />
                {formError?.target?.age ? (
                  <p className="error__msg ">{formError?.target?.age}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity ">
                <label>
                  {" "}
                  Reward <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="number"
                  name="tokens"
                  value={formvalues?.reward?.tokens}
                  data-obj="reward"
                  placeholder="Ex : 0"
                  onChange={handleChange}
                />
                {formError?.reward?.tokens ? (
                  <p className="error__msg ">{formError?.reward?.tokens}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="">
                <label className="fw-bold">
                  {" "}
                  Gender <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Genders}
                  selected={formvalues?.target?.gender}
                  handleChange={onSelectedChangeDrop}
                  label="gender"
                />
                {formError?.target?.gender ? (
                  <p className="error__msg ">{formError?.target?.gender}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="">
                <label className="fw-bold">
                  {" "}
                  RelationShip Status <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Relations}
                  selected={formvalues?.target?.relationshipstatus ?? []}
                  handleChange={onSelectedChangeDrop}
                  label="relationshipstatus"
                />
                {formError?.target?.relationshipstatus ? (
                  <p className="error__msg ">
                    {formError?.target?.relationshipstatus}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="">
                <label className="fw-bold">
                  {" "}
                  Kids <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Kids}
                  selected={formvalues?.target?.kids ?? []}
                  handleChange={onSelectedChangeDrop}
                  label="kids"
                />
                {formError?.target?.kids ? (
                  <p className="error__msg">{formError?.target?.kids}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="">
                <label className="fw-bold">
                  {" "}
                  Education <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Educations}
                  selected={formvalues?.target?.education}
                  handleChange={onSelectedChangeDrop}
                  label="education"
                />
                {formError?.target?.education ? (
                  <p className="error__msg">{formError?.target?.education}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="">
                <label className="fw-bold">
                  {" "}
                  From <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <DateTimePicker
                  calendarIcon
                  minDate={moment().toDate()}
                  value={formvalues?.target?.from}
                  // disabled={formvalues?.target?.from ? true : false}
                  onChange={fromChangeHandler}
                />
                {formError?.target?.from ? (
                  <p className="error__msg">{formError?.target?.from}</p>
                ) : (
                  ""
                )}
              </div>
            </div>

            {formvalues.target?.from ? (
              <div className="col-xl-4 col-lg-6 mb-3">
                <div className="">
                  <label className="fw-bold">
                    {" "}
                    To <span className="redColor">*</span>{" "}
                  </label>{" "}
                  <br />
                  <DateTimePicker
                    calendarIcon
                    minDate={
                      formvalues.target.from
                        ? moment().toDate() && formvalues.target.from
                        : moment().toDate()
                    }
                    //&& formvalues.target.from
                    readOnly
                    value={formvalues.target.to}
                    onChange={toChangeHandler}
                  />
                  {formError?.target?.to ? (
                    <p className="error__msg">{formError?.target?.to}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity-1 d-flex ">
                <div className="add-charity-img">
                  {previewImage && <img src={previewImage} alt="img" />}
                </div>
                <div className="img-field-1 ">
                  <label for="num">
                    survey image <span className="redColor">*</span>{" "}
                    <span className="fw-normal">{dimensions.surveyImage}</span>{" "}
                  </label>
                  <input
                    type="file"
                    id="myfile"
                    accept=".jpg,.png,.jpeg"
                    data-obj="survey"
                    onChange={imageHandler}
                  />
                  {formError?.survey?.surveyImage ? (
                    <p className="error__msg ">
                      {formError?.survey?.surveyImage}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="charity_ques d-flex justify-content-between">
              <h3>
                Questions <span className="redColor">*</span>
              </h3>
              <button data-bs-toggle="modal" data-bs-target="#exampleModal">
                + Add Question
              </button>
            </div>
            {formError?.survey?.questions ? (
              <p className="error__msg ">{formError?.survey?.questions}</p>
            ) : (
              ""
            )}
            {formvalues?.survey?.questions?.length !== 0 ? (
              <div className="row">
                {formvalues?.survey?.questions?.map((item, i) => (
                  <div className="col-lg-6" key={i}>
                    <div className="single-ques">
                      <label htmlFor="">{item.questionType}</label>
                      <input
                        type="text"
                        value={item.title}
                        //   placeholder="Is this video helpful for you or not?"
                      />
                      <img
                        className="del-img"
                        src={Delete}
                        alt="img"
                        onClick={() => deleteQuestion(i)}
                      />
                      <div className="options">
                        {item.questionType === "FormQuestion" ||
                        item.questionType === "VIDEOQUESTION" ? (
                          ""
                        ) : (
                          <h5>Options :</h5>
                        )}
                        {item?.options?.map((item2) => (
                          <p className="image-url-eclips">
                            <span>{item2?.value}</span> {item2.title}
                          </p>
                        ))}

                        {item.questionType === "VIDEOQUESTION" ||
                        item.questiontype === "VIDEOQUESTION" ? (
                          <div className="ques-video w-100 mt-3 d-flex justify-content-end">
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
            ) : (
              <p className="text-center">No Question is Added Yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="check-button">
        <div className="check-box-charity">
          <p>
            {" "}
            <input
              type="checkbox"
              name="active"
              data-obj="target"
              checked={formvalues?.target?.active}
              onChange={handleChange}
            />{" "}
            If you want to active this survey then please check{" "}
          </p>
        </div>
        <div class="single_button ">
          <div className="draft_btn me-2" onClick={() => setIsDraft(true)}>
            <button>Add to Draft</button>
          </div>

          <div class="donate_btn" onClick={() => addDataList()}>
            <button>Add Survey</button>
          </div>
        </div>
      </div>
    </>
  );
}
