import React from "react";
import { useLocation } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import { Delete, QuestionUpdate } from "../../utils/image";
import { ref, uploadBytesResumable } from "firebase/storage";
import { doc } from "firebase/firestore";
import { collections, db, storageGet } from "../../services/firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import Updatequestionmodal from "../../Modals/updatequestionmodal";
import Addquestionmodal from "../../Modals/addquestionmodal";
import Dropdowndemographics from "../../component/dropdown/dropdowndemographics";
import { Ages, Genders, Educations, Relations, Kids } from "../../constants";
import { LoaderContext } from "../../context/loadingContext";
import { useContext } from "react";
import {
  downloadImageUrl,
  updateSurveyDoc,
} from "../../services/firebase/actions";
import { drafts, surveys } from "../../routes/pathnames";
import { dimensions } from "../../constants";
import Dropdownclientsurvey from "../../component/dropdown/dropdownclientsurvey";
import useClients from "../../hooks/useClients";
import { useEffect } from "react";

export default function UpdateSurvey() {
  const location = useLocation();
  const data = location.state;
  const history = useHistory();
  const { clients } = useClients();
  const [clientsNames, setClientsNames] = useState([]);

  useEffect(() => {
    if (clients?.length > 0) {
      let client = [];
      clients?.map((item, idx) => {
        client.push({
          label: item?.data?.client_name,
          value: item?.data?.clientid,
        });
      });
      setClientsNames(client);
    }
  }, [clients]);

  const initialformvalues = {
    client: {
      label: data?.detail?.data?.client?.clientName,
      value: data?.detail?.data?.client?.clientid,
    },
    reward: {
      tokens: data?.detail?.data?.reward?.tokens,
    },
    survey: {
      questions: data?.detail?.data?.survey?.questions,
      surveyImage: data?.detail?.data?.survey?.surveyImage,
      tagline: data?.detail?.data?.survey?.tagline,
      title: data?.detail?.data?.survey?.title,
    },
    surveyid: data?.detail?.data?.surveyid,
    target: {
      active: data?.detail?.data?.target?.active,
      isDraft: data?.detail?.data?.target?.isDraft,
      surveyresponse: data?.detail?.data?.target?.surveyresponse,
      age: Ages?.filter((el) =>
        data?.detail?.data?.target?.ageIds?.includes(el.id)
      ),
      gender: Genders?.filter((el) =>
        data?.detail?.data?.target?.gender?.includes(el.value)
      ),
      relationshipstatus: Relations?.filter((el) =>
        data?.detail?.data?.target?.relationStatus.includes(el.value)
      ),
      kids: Kids?.filter((el) =>
        data?.detail?.data?.target?.kids?.includes(el.value)
      ),
      education: Educations?.filter((el) =>
        data?.detail?.data?.target?.education?.includes(el.value)
      ),
      from: data?.detail?.data?.target?.from
        ? new Date(
            data?.detail?.data?.target?.from?.seconds * 1000 +
              data?.detail?.data?.target?.from?.nanoseconds / 1000000000
          )
        : null,
      to: data?.detail?.data?.target?.to
        ? new Date(
            data?.detail?.data?.target?.to?.seconds * 1000 +
              data?.detail?.data?.target?.to?.nanoseconds / 1000000000
          )
        : null,
    },
  };
  const initialquestoinsvalues = {
    title: "",
    fieldid: "",
    fieldtype: "",
    questiontype: "",
    options: [],
    videoRef: null,
    imageref: null,
  };
  const initialoptionvalues = {
    value: "",
    title: "",
    imageUrl: [],
  };

  const [show, setShow] = useState(false);
  const [formError, setFormError] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [questionindex, setQuestionindex] = useState();
  const [videoFile, setVideoFile] = useState(null);
  const { setLoading } = useContext(LoaderContext);
  const [formvalues, setFormvalues] = useState({ ...initialformvalues });
  const [uploadVideoBoolean, setUploadVideoBoolean] = useState(true);
  const [questionvalues, setQuestionvalues] = useState({
    ...initialquestoinsvalues,
  });
  const [optionvalues, setOptionvalues] = useState({ ...initialoptionvalues });

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

  //main hanle change
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

  const surveyRoute = () => {
    history.push(surveys);
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

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptionvalues({ ...optionvalues, [name]: value });
  };

  const questionimagehandler = (e) => {
    setQuestionvalues({ ...questionvalues, imageref: e.target.files[0] });
  };

  const questionvideohandler = (e) => {
    if (e.target.files[0].size > 104857600) {
      toast.error(`File Size must be 100MB or less`);
      setUploadVideoBoolean(false);
    } else {
      if (e.target.files[0].type === "video/mp4") {
        setUploadVideoBoolean(true);
        setVideoFile(e.target.files[0]);
      } else {
        toast.error("Your File must be .mp4");
      }
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionvalues({ ...questionvalues, [name]: value });
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

  const imageReffile = (e) => {
    // const { name, value } = e.target.files[0];
    setQuestionvalues({ ...questionvalues, imageref: e.target.files[0] });
  };

  const handleUpdateSurvey = async (e) => {
    //   e.preventDefault();

    // setFormError(validate(formvalues));

    // if (
    //   formvalues.survey.title &&
    //   formvalues.survey.tagline &&
    //   formvalues.customer.customerReference &&
    //   formvalues.customer.customerid &&
    //   formvalues.target.age &&
    //   formvalues.target.age.length !== 0 &&
    //   formvalues.reward.tokens &&
    //   formvalues.target.gender &&
    //   formvalues.target.surveyresponse &&
    //   formvalues.target.gender.length !== 0 &&
    //   formvalues.target.relationshipstatus &&
    //   formvalues.target.relationshipstatus.length !== 0 &&
    //   formvalues.target.kids &&
    //   formvalues.target.kids.length !== 0 &&
    //   formvalues.target.education &&
    //   formvalues.target.education.length !== 0 &&
    //   formvalues.target.from &&
    //   formvalues.target.to &&
    //   formvalues.survey.questions &&
    //   formvalues.survey.questions.length !== 0
    // ) {
    const storage = storageGet;

    let surveyupdateimagefile = formvalues.survey.surveyImage;

    const d = new Date();
    let ms = d.getMilliseconds();

    var storagePath =
      "surveys/surveyImages/" + `${surveyupdateimagefile.name}_${ms}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, surveyupdateimagefile);
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
              // const ageval = formvalues.target.age.map((item) => item.value);

              const children = [...formvalues.target.age];
              const mappedData = children.length
                ? children.map((el) => el.value)
                : [];
              const selectedAges = [].concat.apply([], mappedData);

              const ageIds = formvalues.target.age.map((item) => item.id);
              console.log("Ids", ageIds);

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

              const surveyRef = doc(db, collections.survey, data?.detail?.id);
              const currentDate = new Date();
              const payload = {
                client: {
                  clientName: formvalues?.client?.label,
                  clientid: formvalues?.client?.value,
                },
                reward: {
                  tokens: parseInt(formvalues.reward.tokens),
                },

                survey: {
                  questions: formvalues.survey.questions,
                  surveyImage: surveyupdateimagefile.name
                    ? downloadURL
                    : formvalues.survey.surveyImage,
                  tagline: formvalues.survey.tagline,
                  title: formvalues.survey.title,
                },
                surveyid: formvalues.surveyid,
                target: {
                  active:
                    formvalues.target.from > currentDate
                      ? false
                      : formvalues.target?.isDraft === true
                      ? false
                      : Object.keys(validate(formvalues)).length > 0
                      ? false
                      : formvalues.target.active,
                  isDraft:
                    Object.keys(validate(formvalues)).length > 0 ? true : false,
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
              await updateSurveyDoc(surveyRef, payload);
            }
          );
          toast.success("Survey is Updated Successfully");
          setLoading(false);
          if (Object.keys(validate(formvalues)).length > 0) {
            history.push(drafts);
          } else {
            history.push(surveys);
          }
        }
      );
    } catch (error) {
      alert(error);
    }
    // }
  };

  const updateDataList = () => {
    // if (formvalues.target.active) {
    // const validateForm = validate(formvalues);
    // setFormError(validateForm);

    // if (Object.keys(validateForm).length > 0)
    //   return toast.error("Fields are Empty");
    // }

    handleUpdateSurvey();
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
    if (!values?.survey?.questions || values.survey.questions.length === 0) {
      errors.survey.questions = "Questions is Required";
    }
    if (!values?.client?.label) {
      errors.client.label = "Client Name is Required";
    }
    // if (!values?.customer?.customerid) {
    //   errors.customer.customerid = "Customer ID is Required";
    // }
    if (!values?.target?.age || values.target.age.length === 0) {
      errors.target.age = "Age is Required";
    }
    // if (!values?.target?.active) {
    //   errors.target.active = "Survey Active or Not Active is Required";
    // }
    if (!values?.reward?.tokens) {
      errors.reward.tokens = "Tokens is Required";
    }
    if (!values?.target?.gender || values.target.gender.length === 0) {
      errors.target.gender = "Gender is Required";
    }
    if (
      !values?.target?.relationshipstatus ||
      values.target.relationshipstatus.length === 0
    ) {
      errors.target.relationshipstatus = "Relation Status is Required";
    }
    if (!values?.target?.kids || values.target.kids.length === 0) {
      errors.target.kids = "Kids is Required";
    }
    if (!values?.target?.education || values.target.education.length === 0) {
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
      if (Object.keys(errors[key]).length === 0) delete errors[key];
    });

    return errors;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onClientChange = (value) => {
    setFormvalues((prev) => ({
      ...prev,
      client: value,
    }));
  };

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
      />

      <Updatequestionmodal
        handleQuestionChange={handleQuestionChange}
        questionvalues={selectedItem}
        index={questionindex}
        formvalues={formvalues}
        setQuestionvalues={setQuestionvalues}
        questionvideohandler={questionvideohandler}
        setFormvalues={setFormvalues}
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        handleClose={handleClose}
        show={show}
      />

      <div className="main-survey-update">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  Update Survey Title <span className="redColor">*</span>{" "}
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
                  Update Survey Tag Line <span className="redColor">
                    *
                  </span>{" "}
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
                  Company / Client Name <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                {/* <input
                  type="text"
                  name="customerName"
                  value={formvalues?.customer?.customerName}
                  data-obj="customer"
                  placeholder="enter your customer reference"
                  onChange={handleChange}
                /> */}
                <Dropdownclientsurvey
                  options={clientsNames ?? []}
                  defaultValue={formvalues?.client}
                  handleChange={onClientChange}
                />
                {formError?.client?.label ? (
                  <p className="error__msg ">{formError?.client?.label}</p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity ">
                <label>
                  Update Client ID <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="text"
                  name="clientid"
                  value={formvalues?.client?.value}
                  data-obj="client"
                  placeholder="enter your client ID"
                  onChange={handleChange}
                  disabled
                />
                {formError?.client?.value ? (
                  <p className="error__msg ">{formError?.client?.value}</p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity ">
                <label>
                  Update Survey Response <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="number"
                  name="surveyresponse"
                  value={formvalues?.target?.surveyresponse}
                  data-obj="target"
                  placeholder="enter your Suvey Respone"
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
                  Update Age <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Ages}
                  selected={formvalues.target.age ?? []}
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
                  Update Reward <span className="redColor">*</span>{" "}
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
                  Update Gender <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Genders}
                  selected={formvalues.target.gender ?? []}
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
                  Update RelationShip Status <span className="redColor">
                    *
                  </span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Relations}
                  selected={formvalues.target.relationshipstatus ?? []}
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
                  Update Kids <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Kids}
                  selected={formvalues.target.kids ?? []}
                  handleChange={onSelectedChangeDrop}
                  label="kids"
                />
                {formError?.target?.kids ? (
                  <p className="error__msg ">{formError?.target?.kids}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="">
                <label className="fw-bold">
                  Update Education <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowndemographics
                  options={Educations}
                  selected={formvalues.target.education ?? []}
                  handleChange={onSelectedChangeDrop}
                  label="education"
                />
                {formError?.target?.education ? (
                  <p className="error__msg ">{formError?.target?.education}</p>
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
                  readOnly
                  value={formvalues?.target?.from}
                  onChange={fromChangeHandler}
                />
                {formError?.target?.from ? (
                  <p className="error__msg ">{formError?.target?.from}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="">
                <label className="fw-bold">
                  {" "}
                  To <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <DateTimePicker
                  calendarIcon
                  minDate={moment().toDate()}
                  readOnly
                  value={formvalues?.target?.to ?? null}
                  onChange={toChangeHandler}
                />
                {formError?.target?.to ? (
                  <p className="error__msg ">{formError?.target?.to}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity-1 d-flex ">
                <div className="add-charity-img">
                  <img src={formvalues.survey.surveyImage} alt="img" />
                </div>
                <div className="img-field-1 ">
                  <label for="num">
                    Survey Image <span className="redColor">*</span>{" "}
                    <span className="fw-normal">{dimensions.surveyImage}</span>{" "}
                  </label>
                  <input
                    type="file"
                    id="myfile"
                    accept=".jpg,.png,.jpeg"
                    data-obj="survey"
                    onChange={imageHandler}
                  />
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
            {formvalues?.survey?.questions?.map((item, i) => (
              <>
                <div className="col-lg-6">
                  <div className="single-ques">
                    <label htmlFor="">
                      {item.questionType || item.questiontype}
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      // placeholder="Is this video helpful for you or not?"
                    />

                    <img
                      className="del-img"
                      src={Delete}
                      alt="img"
                      onClick={() => deleteQuestion(i)}
                    />

                    <img
                      onClick={() => {
                        setSelectedItem(item);
                        setQuestionindex(i);
                        handleShow();
                      }}
                      className="update-img"
                      src={QuestionUpdate}
                      alt="img"
                    />

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
                              loop="true"
                              autoplay="autoplay"
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
              </>
            ))}
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
            <span className="redColor">*</span>{" "}
          </p>
        </div>
        <div class="single_button">
          <div class="back_btn" onClick={() => surveyRoute()}>
            <button>Back</button>
          </div>
          <div class="donate_btn" onClick={() => updateDataList()}>
            <button>Update Survey</button>
          </div>
        </div>
      </div>
    </>
  );
}
