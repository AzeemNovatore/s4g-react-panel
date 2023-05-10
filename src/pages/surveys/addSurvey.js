import React from "react";
import { uploadImg, Delete, NoImage } from "../../utils/image";
import { useState, useEffect } from "react";
import { collection, doc, getDocs, query, where} from "firebase/firestore";
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
import AddSurveyNotification from "../../Modals/addSurveyNotification";
import useUsers from "../../hooks/useUser";

export default function AddSurvey() {
  // sruveys add all values
  const initialformvalues = {
    client: {
      label: "",
      value: "",
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
  const [questionvalues, setQuestionvalues] = useState({
    ...initialquestoinsvalues,
  });
  const { clients } = useClients();
  const [clientsNames, setClientsNames] = useState([]);
  const [optionvalues, setOptionvalues] = useState(initialoptionvalues);
  const [showModal, setShowModal] = useState(false);
  const initialNotificationValues = {
    title: "",
    description: "",
  };
  const [notificationValues, setNotificationValues] = useState({ ...initialNotificationValues });
  
  const notifyAllUsers = async (
    selectedAges,
    genders,
    relations,
    kids,
    education
  ) => {
    const userRef = collection(db, collections.users);
  
    const snapshot = await getDocs(userRef);
  
    const usersList = snapshot.docs.reduce((acc, doc) => {
      const user = doc.data();
      const demographics = user.demographics || {};
      const genderMatch = demographics.gender && genders.includes(demographics.gender);
      const relationMatch = demographics.relationship && relations.includes(demographics.relationship);
      const childrensMatch = demographics.childrens && kids.includes(demographics.childrens);
      const educationMatch = demographics.education && education.includes(demographics.education);
      const dateOfBirth = demographics.dateofbirth;
      const ageMatch = dateOfBirth && selectedAges.includes(getAgeFromDateOfBirth(dateOfBirth).toString());

      if (genderMatch && relationMatch && childrensMatch && educationMatch && ageMatch) {
        acc.push({
          data: user,
          id: doc.id,
        });
      }
      return acc;
    }, []);
    if (usersList?.length >0) {
    sentNotification(usersList);
    }
  };

  
const getAgeFromDateOfBirth = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  debugger
  return age;
};
  // const notifyAllUsers = async (
  //   selectedAges,
  //   genders,
  //   relations,
  //   kids,
  //   education
  // ) => {
  //   debugger;
  //   await getDocs(
  //   query(
  //     collection(db, collections.users),
  //     where("demographics.gender", "in", genders),
  //     where("demographics.relationship", "in", relations),
  //     where("demographics.childrens", "array-contains-any", kids),
  //     where("demographics.education", "array-contains-any", education)
  //   )
  //   ).then((snapshot) => {
  //     const listData = snapshot ? snapshot.docs : [];
  //     const usersList = listData.map((doc) => ({
  //       data: doc.data(),
  //       id: doc.id,
  //     }));
  //     console.log(usersList, "usersList"); 
  //     debugger;
  //   });
  // };


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

  const onClientChange = (value) => {
    setFormvalues((prev) => ({
      ...prev,
      client: value,
    }));
  };

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
              await addSurveyDoc(newDocRef, {
                client: {
                  clientName: formvalues?.client?.label,
                  clientid: formvalues.client.value,
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
              });

              if (!isDraft) {
                await notifyAllUsers(
                  selectedAges,
                  genderval,
                  relationval,
                  kidsval,
                  educationval
                );
              }
            }
          );
          toast.success("Survey is Added Successfully");
          setLoading(false);
          history.push(isDraft ? drafts : surveys);
        }
      );
      setFormvalues({ ...formvalues, ...initialformvalues });
    } catch (error) {
      alert(error);
    }
  };

  const sentNotification = async (usersList) =>{
    for (let i = 0; i < usersList.length; i++) {
      const message = {
        notification: {
          title: notificationValues.title,
          body: notificationValues.description,
        },
        to: `/topics/${usersList[i].id}`,
        priority: "high",
        data: {
          status: "done",
        },
      };
  
      try {
        // Send the push notification via Firebase API
        const response = await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            Authorization:
              "key=AAAAzdEApQU:APA91bFpk0pFFeFCwjDP6TxhoS8piWUim8tan4X0LuiqVB8px-ZSApHc71dioSMS9Ao3bTCHk_n-Qf4I5-pfY_cmjiaAXDqm84AxwAbKmxeciXShj6G-8o6CTEA_4IeP31wLSFy84nA2",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
  
        if (response.ok) {
          setNotificationValues(initialNotificationValues);
          toast.success("Notification sent!");
        } else {
          console.error(`Firebase API returned ${response.status} error`);
          toast.error("Error sending notification");
        }
      } catch (error) {
        console.error("Error sending notification", error);
        toast.error("Error sending notification");
      }
    };
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
    if (!values?.client?.label) {
      errors.client.label = "Client Name is Required";
    }
    // if (!values?.client?.value) {
    //   errors.client.value = "Client ID is Required";
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

      <AddSurveyNotification 
      setShowModal={setShowModal} 
      show={showModal} 
      notificationValues={notificationValues} 
      setNotificationValues={setNotificationValues} 
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
                  options={clientsNames}
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
                  {" "}
                  Client ID <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="text"
                  name="clientid"
                  value={formvalues?.client?.value}
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
          <p>
            {" "}
            <input
              type="checkbox"
              onChange={() => setShowModal(true)}
              checked={ notificationValues?.title && notificationValues?.description ? true : false}
            />{" "}
            If you send notification please check{" "}
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
