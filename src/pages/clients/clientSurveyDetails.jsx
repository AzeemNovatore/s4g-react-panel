import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ItemsPerPage from "../../component/pagination/itemsPerPage";
import SearchBar from "../../component/pagination/searchBar";
import { TableComponent } from "../../component/table";
import { viewSurvey } from "../../routes/pathnames";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import useSurveys from "../../hooks/useSurveys";
import useSubmissions from "../../hooks/useSubmissions";

export const tableHeading = [
  "Survey Details",
  "Start Date",
  "End Date",
  "Total Response",
  "Response Complete",
  "Actions",
];

export default function ClientSurveyDetails() {
  const { getSurveys, surveys } = useSurveys();
  const [surveyList, setSurveyList] = useState([]);
  const [singleItemSurvey, setSingleItemSurvey] = useState([]);
  const [singleItemSurveyBoolean, setSingleItemSurveyBoolean] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const { submissions } = useSubmissions();
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemSinglePage, setItemSinglePage] = useState(10);
  const [searchSurvey, setSearchSurvey] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    getSurveys();
  }, []);

  useEffect(() => {
    const listSurveys = surveys.filter(
      (item) => item?.data?.client?.clientid === id
    );
    setSurveyList(listSurveys);
  }, [surveys]);

  const viewDetails = (item) => {
    setSingleItemSurvey(item);
    setSingleItemSurveyBoolean(true);
  };

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
    setItemOffset(0);
  }, [itemSinglePage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemSinglePage) % surveyList?.length;
    setItemOffset(newOffset);
  };

  const handlePagination = () => {
    const endOffset = itemOffset + itemSinglePage;
    setCurrentItems(surveyList.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(surveyList?.length / itemSinglePage));
  };

  useEffect(() => {
    if (surveyList?.length > 0) {
      handlePagination();
    } else {
      setCurrentItems([]);
      setPageCount(0);
    }
  }, [surveyList]);

  useEffect(() => {
    handlePagination();
  }, [itemOffset, itemSinglePage]);

  useEffect(() => {
    if (searchSurvey === "") {
      setData(surveyList);
    }
    const filtered = currentItems?.filter(
      (item) =>
        item.data.survey.title
          .toLowerCase()
          .includes(searchSurvey.toLowerCase()) ||
        item.data.survey.title
          .toLowerCase()
          .includes(searchSurvey.toLowerCase())
    );
    setData(filtered);
  }, [searchSurvey, currentItems]);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between form-sec-mac">
        <div className="d-flex align-items-center gap-2">
          <ItemsPerPage
            itemSinglePage={itemSinglePage}
            setItemSinglePage={setItemSinglePage}
          />
          <SearchBar setSearch={setSearchSurvey} />
        </div>
      </div>
      <TableComponent
        tableHeading={tableHeading}
        viewDetails={viewDetails}
        tableData={data}
        filterData={data}
        handlePageClick={handlePageClick}
        pageCount={pageCount}
        buttonText="View Details"
        tableName="Surveys"
      />
    </>
  );
}
