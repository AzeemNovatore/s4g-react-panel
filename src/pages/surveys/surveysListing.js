import React, { useContext } from "react";
import { useState, useEffect } from "react";
import {
  passwordShow,
  edit,
  Delete,
  NoImage,
  AddIcon,
  Notifications,
} from "../../utils/image";
import { useHistory } from "react-router-dom";
import Pagination from "../../component/pagination/reactPaginate";
import useSurveys from "../../hooks/useSurveys";
import { addSurvey, updateSurvey, viewSurvey } from "../../routes/pathnames";
import { LoaderContext } from "../../context/loadingContext";
import { deleteSurveyDoc } from "../../services/firebase/actions";
import DeleteDataModal from "../../Modals/deleteModal";
import { toast } from "react-toastify";
import ItemsPerPage from "../../component/pagination/itemsPerPage";
import SearchBar from "../../component/pagination/searchBar";
import AddSurveyNotification from "../../Modals/addSurveyNotification";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { collections, db } from "../../services/firebase";

export default function Surveys() {
  const [singleItemSurvey, setSingleItemSurvey] = useState([]);
  const [surveyUpdatedItem, setSurveyUpdatedItem] = useState([]);
  const [itemSurvey, setItemSurvey] = useState();
  const [currentItems, setCurrentItems] = useState(null);
  const { setLoading } = useContext(LoaderContext);
  const { getSurveys, surveys, allSubmissions } = useSurveys();
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemSinglePage, setItemSinglePage] = useState(10);
  const [searchSurvey, setSearchSurvey] = useState("");
  const [singleItemSurveyBoolean, setSingleItemSurveyBoolean] = useState(false);
  const [surveyUpdateBoolean, setSurveyUpdateBoolean] = useState(false);
  const [data, setData] = useState([]);
  const [reminderNotifityUsers, setReminderNotifityUsers] = useState([]);
  const [surveyActive, setSurveyActive] = useState(false);
  const [notificationSubmission, setNotificationSubmission] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [show, setShow] = useState(false);

  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(false);

  const initialNotificationValues = {
    title: "",
    description: "",
  };

  const [notificationValues, setNotificationValues] = useState({
    ...initialNotificationValues,
  });


  const notifyAllUsers = async (
    selectedAges,
    genders,
    relations,
    kids,
    education,
    surveyActive,
    surveyId
  ) => {

    const userRef = collection(db, collections.users);
    const snapshot = await getDocs(userRef);
   
    const usersList = snapshot.docs.reduce((acc, doc) => {
      const user = doc.data();
      const demographics = user.demographics || {};
      const genderMatch =
        demographics.gender && genders.includes(demographics.gender);
      const relationMatch =
        demographics.relationship &&
        relations.includes(demographics.relationship);
      const childrensMatch =
        demographics.childrens && kids.includes(demographics.childrens);
      const educationMatch =
        demographics.education && education.includes(demographics.education);
      const dateOfBirth = demographics.dateofbirth;
      const ageMatch =
        dateOfBirth &&
        selectedAges.includes(getAgeFromDateOfBirth(dateOfBirth).toString());

      if (
        genderMatch &&
        relationMatch &&
        childrensMatch &&
        educationMatch &&
        ageMatch
      ) {
        acc.push({
          data: user,
          id: doc.id,
        });
      }
      return acc;
    }, []);

    if (usersList?.length > 0) {
      const submissions = await surveySubmission(surveyId);
      const filterUsers = usersList.filter(
        (item1) => !submissions.includes(item1.id)
      );
      setReminderNotifityUsers(filterUsers);
      setSurveyActive(surveyActive);
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
    return age;
  };

  const sentNotification = async (usersList, surveyActive, surveyId) => {
    try {
      const promises = [];
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
            id: surveyId,
          },
        };

        const promise = fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            Authorization:
              "key=AAAAzdEApQU:APA91bFpk0pFFeFCwjDP6TxhoS8piWUim8tan4X0LuiqVB8px-ZSApHc71dioSMS9Ao3bTCHk_n-Qf4I5-pfY_cmjiaAXDqm84AxwAbKmxeciXShj6G-8o6CTEA_4IeP31wLSFy84nA2",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });

        promises.push(promise);
      }

      await Promise.all(promises);
      if (notification && surveyActive) {
        setNotificationValues(initialNotificationValues);
        toast.success("Notification sent!");
      }
    } catch (error) {
      console.error("Error sending notification", error);
      toast.error("Error sending notification");
    }
  };

  const history = useHistory();

  const surveySubmission = async (surveyId) => {
    let collectionRef = collection(
      db,
      collections.survey,
      surveyId,
      collections.submissions
    );
    try {
      const querySnapshot = await new Promise((resolve, reject) => {
        onSnapshot(collectionRef, resolve, reject);
      });
  
      if (querySnapshot !== null) {
        const submissionsarr = querySnapshot.docs.map((doc) => (
          doc.data().userid
        ));
        return submissionsarr;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemSinglePage) % surveys?.length;
    setItemOffset(newOffset);
  };

  const handlePagination = () => {
    const endOffset = itemOffset + itemSinglePage;

    const liveList = surveys.filter(
      (item) => item?.data?.target?.isDraft === false
    );
    setCurrentItems(liveList.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(liveList?.length / itemSinglePage));
  };

  const surveyRoute = () => {
    history.push(addSurvey);
  };

  const deleteSurveyModal = (item) => {
    setItemSurvey(item);
    handleShow();
  };
  const deleteSurvey = async () => {
    try {
      setLoading(true);
      await deleteSurveyDoc(itemSurvey?.id);
    } catch (error) {
      console.log(error);
    } finally {
      toast.success("Survey is Deleted Successfully");
      setLoading(false);
    }
    getSurveys();
    handleClose();
  };
  const convertSecondsToDate = (seconds) => {
    const milliseconds = seconds * 1000;
    return new Date(milliseconds);
  };
  const isDatePassed = (date) => {
    const currentDate = Date.now();
    const passedDate = convertSecondsToDate(date?.seconds);
    return passedDate < currentDate;
  };
  useEffect(() => {
    if (notificationSubmission === true) {
      sentNotification(
        reminderNotifityUsers,
        surveyActive,
        selectedId
      );
    }
  }, [notificationSubmission]);

  useEffect(() => {
    setItemOffset(0);
  }, [itemSinglePage]);

  useEffect(() => {
    getSurveys();
  }, []);

  useEffect(() => {
    if (surveys?.length > 0) {
      allSubmissions();
      handlePagination();
    } else {
      setCurrentItems([]);
      setPageCount(0);
    }
  }, [surveys]);

  useEffect(() => {
    handlePagination();
  }, [itemOffset, itemSinglePage]);

  useEffect(() => {
    if (singleItemSurveyBoolean) {
      history.push({
        pathname: viewSurvey,
        state: { detail: singleItemSurvey },
      });
      setSingleItemSurveyBoolean(false);
    }
  }, [singleItemSurvey]);

  useEffect(() => {
    if (surveyUpdateBoolean) {
      history.push({
        pathname: updateSurvey,
        state: { detail: surveyUpdatedItem },
      });
      setSurveyUpdateBoolean(false);
    }
  }, [surveyUpdatedItem]);

  useEffect(() => {
    const filtered = currentItems?.filter(
      (item) =>
        // item.data.survey.title.toLowerCase().includes(searchSurvey.toLowerCase())
        item.data.target?.isDraft === false &&
        item.data.survey.title
          .toLowerCase()
          .includes(searchSurvey.toLowerCase())
    );

    setData(filtered);
  }, [searchSurvey, currentItems]);

  return (
    <>
      <DeleteDataModal
        show={show}
        handleClose={handleClose}
        item={itemSurvey}
        deleteData={deleteSurvey}
        type="Survey"
      />

      <AddSurveyNotification
        setShowModal={setShowModal}
        show={showModal}
        notificationValues={notificationValues}
        setNotificationValues={setNotificationValues}
        setNotification={setNotification}
        modalTitle={"Reminder Survey Notifcation"}
        setNotificationSubmission={setNotificationSubmission}
        notificationStatus="notificationReminder"
      />

      <div className="d-flex align-items-center justify-content-between form-sec-mac">
        <div className="d-flex align-items-center gap-2">
          <ItemsPerPage
            itemSinglePage={itemSinglePage}
            setItemSinglePage={setItemSinglePage}
          />

          <SearchBar setSearch={setSearchSurvey} />
        </div>
        <div className="add__charity p-2" onClick={surveyRoute}>
          <button>
            <img src={AddIcon} alt="" />
            Add Surveys
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table class=" table text-white">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Sr</th>
              <th scope="col">Survey Details</th>
              <th scope="col" className="charity-tag-line">
                Survey Title
              </th>
              <th scope="col">Survey Tag Line</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.map((item, i) => (
                <tr key={i}>
                  <td className="first-td">{i + itemOffset + 1}</td>
                  <td className="d-flex second-img">
                    {item.data?.survey?.surveyImage ? (
                      <>
                        <img
                          src={item.data.survey.surveyImage}
                          alt="charityimage"
                        />
                      </>
                    ) : (
                      <>
                        <img src={NoImage} alt="" />
                      </>
                    )}
                  </td>
                  <td>
                    <p>{item.data?.survey?.title}</p>
                  </td>
                  <td>
                    <p>{item.data?.survey?.tagline}</p>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        onClick={() => {
                          setSingleItemSurvey(item);
                          setSingleItemSurveyBoolean(true);
                        }}
                      >
                        <img
                          src={passwordShow}
                          alt="eyes"
                          className="w-100 cursor"
                        />
                      </div>
                      <div
                        onClick={() => {
                          setSurveyUpdateBoolean(true);
                          setSurveyUpdatedItem(item);
                        }}
                      >
                        <img src={edit} alt="edit" className="w-100 cursor" />
                      </div>
                      <div onClick={() => deleteSurveyModal(item)}>
                        <img src={Delete} alt="del" className="w-100 cursor" />
                      </div>
                      <div
                        onClick={() => {
                          setNotificationSubmission(false);
                          if (!item?.data?.target?.active)
                            toast.error("Survey is not active");
                          else if (
                            isDatePassed(item?.data?.target?.to) === true
                          )
                            toast.error("Survey is already completed");
                          else {
                            setShowModal(true);                     
                            setSelectedId(item.data?.surveyid);
                            notifyAllUsers(
                              item?.data?.target?.age,
                              item?.data?.target?.gender,
                              item?.data?.target?.relationStatus,
                              item?.data?.target?.kids,
                              item?.data?.target?.education,
                              item?.data?.target?.active,
                              item.data?.surveyid
                            );
                          }
                        }}
                      >
                        <img
                          src={Notifications}
                          className="blue-icons w-100 cursor"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan="5" className="text-center">
                  {" "}
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div>
          <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
        </div>
      </div>
    </>
  );
}
