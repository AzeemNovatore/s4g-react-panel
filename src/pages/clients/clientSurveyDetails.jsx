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

  useEffect(() => {
    getSurveys();
  }, []);

  useEffect(() => {
    const listSurveys = surveys.filter(
      (item) => item?.data?.client?.clientid === id
    );
    setSurveyList(listSurveys);
  }, [surveys]);

  console.log(surveys, "surveys");

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

  console.log(singleItemSurvey, "single");

  return (
    <>
      <div className="d-flex align-items-center justify-content-between form-sec-mac">
        <div className="d-flex align-items-center gap-2">
          <ItemsPerPage itemSinglePage={2} setItemSinglePage={() => {}} />
          <SearchBar set Search={() => {}} />
        </div>
      </div>
      <TableComponent
        tableHeading={tableHeading}
        viewDetails={viewDetails}
        tableData={surveyList}
        buttonText="View Details"
        tableName="Surveys"
      />
    </>
  );
}
