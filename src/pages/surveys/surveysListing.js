import React, { useContext } from "react";
import { useState, useEffect } from "react";
import {
  passwordShow,
  edit,
  Delete,
  NoImage,
  AddIcon,
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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const history = useHistory();

  // const allSubmissions = () => {
  //   try {
  //     for (let i = 0; i < surveys?.length; i++) {
  //       let collectionRef = collection(
  //         db,
  //         collections.survey,
  //         surveys[i].id,
  //         collections.submissions
  //       );

  //       const fromDate = new Date(
  //         surveys[i].data?.target?.from.seconds * 1000 +
  //           surveys[i].data?.target?.from.nanoseconds / 1000000000
  //       );

  //       const currentDate = new Date();
  //       if (fromDate?.getTime() > currentDate.getTime()) {
  //         console.log("greater");
  //       }
  //       onSnapshot(collectionRef, async (querySnapshot) => {
  //         if (querySnapshot !== null) {
  //           const submissionsarr = querySnapshot.docs.map((doc) => ({
  //             data: doc.data(),
  //             id: doc.id,
  //           }));

  //           // if (submissionsarr?.length >= surveys[i].data.target.surveyresponse) {
  //           const submissionRef = doc(db, collections.survey, surveys[i].id);
  //           const payload = {
  //             target: {
  //               active:
  //                 submissionsarr?.length >=
  //                   surveys[i].data.target.surveyresponse ||
  //                 fromDate?.getTime() > currentDate.getTime()
  //                   ? false
  //                   : true,
  //               age: surveys[i].data.target.age,
  //               ageIds: surveys[i].data.target.ageIds,
  //               education: surveys[i].data.target.education,
  //               gender: surveys[i].data.target.gender,
  //               kids: surveys[i].data.target.kids,
  //               relationStatus: surveys[i].data.target.relationStatus,
  //               surveyresponse: surveys[i].data.target.surveyresponse,
  //               from: surveys[i].data.target.from,
  //               to: surveys[i].data.target.to,
  //             },
  //           };
  //           await surveySubmissionDoc(submissionRef, payload);
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemSinglePage) % surveys?.length;
    setItemOffset(newOffset);
  };

  const handlePagination = () => {
    const endOffset = itemOffset + itemSinglePage;

    const liveList = surveys.filter(
      (item) => item?.data?.target?.isDraft === false
    );
    // console.log("first", liveList);
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
console.log(singleItemSurvey,"survey data");
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
