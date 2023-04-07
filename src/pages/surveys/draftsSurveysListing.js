import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { edit, NoImage, AddIcon, Delete } from "../../utils/image";
import { useHistory } from "react-router-dom";
import Pagination from "../../component/pagination/reactPaginate";
import useSurveys from "../../hooks/useSurveys";
import { updateSurvey, addSurvey } from "../../routes/pathnames";
import ItemsPerPage from "../../component/pagination/itemsPerPage";
import SearchBar from "../../component/pagination/searchBar";
import DeleteDataModal from "../../Modals/deleteModal";
import { deleteSurveyDoc } from "../../services/firebase/actions";
import { LoaderContext } from "../../context/loadingContext";
import { toast } from "react-toastify";

export default function DraftsSurveys() {
  const [surveyUpdatedItem, setSurveyUpdatedItem] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const { getSurveys, surveys } = useSurveys();
  const [itemSurvey, setItemSurvey] = useState();
  const { setLoading } = useContext(LoaderContext);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemSinglePage, setItemSinglePage] = useState(10);
  const [searchSurvey, setSearchSurvey] = useState("");
  const [surveyUpdateBoolean, setSurveyUpdateBoolean] = useState(false);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const history = useHistory();

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemSinglePage) % surveys?.length;
    setItemOffset(newOffset);
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
      toast.success("Draft Survey is Deleted Successfully");
      setLoading(false);
    }
    getSurveys();
    handleClose();
  };

  const handlePagination = () => {
    const endOffset = itemOffset + itemSinglePage;
    const listSurveys = surveys.filter(
      (item) => item?.data?.target?.isDraft === true
    );
    setCurrentItems(listSurveys.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(listSurveys?.length / itemSinglePage));
  };
  const surveyRoute = () => {
    history.push(addSurvey);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [itemSinglePage]);

  useEffect(() => {
    getSurveys();
  }, []);

  useEffect(() => {
    if (surveys?.length > 0) {
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
        item.data.target?.isDraft === true &&
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
        type="Draft Survey"
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
