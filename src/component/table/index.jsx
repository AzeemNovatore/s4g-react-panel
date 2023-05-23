import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "../button";
import { Delete, NoImage, edit, passwordShow } from "../../utils/image";
import Pagination from "../pagination/reactPaginate";
import { useEffect } from "react";

export function TableComponent({
  tableHeading,
  viewDetails,
  buttonText,
  handleClick,
  handleDelete,
  tableData,
  handlePageClick,
  pageCount,
  viewClient,
  surveysList,
  tableName,
  viewSingleClient,
  filterData,
}) {
  const SecondsToDate = (seconds) => {
    const date = new Date(seconds);
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  return (
    <div className="table-responsive">
      <table class=" table text-white">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Sr</th>
            {tableHeading?.map((el, idx) => (
              <th scope="col" key={idx}>
                {el}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData && tableName === "Clients" ? (
            tableData?.map((item, index) => (
              <tr>
                <td className="first-td">{index + 1}</td>
                <td>{item?.data?.client_name}</td>
                <td>{item?.data?.cont_name}</td>
                <td className="text-center">{item?.totalSurveys?.length}</td>
                <td className="text-center">{item?.completedSurveys}</td>
                <td className="text-center">{item?.activeSurveys}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      onClick={() => {
                        viewSingleClient(item);
                      }}
                    >
                      <img src={passwordShow} alt="eyes" className="cursor" />
                    </div>

                    <div>
                      <Link to={`/update_client/${item.id}`}>
                        <img src={edit} alt="edit" className="cursor" />
                      </Link>
                    </div>

                    <div>
                      <img
                        src={Delete}
                        alt="del"
                        onClick={() => handleDelete(item)}
                        className="cursor"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <Button
                    buttonClass={"add__charity m-0"}
                    text={buttonText}
                    handleClick={() => viewDetails(item?.data?.clientid)}
                  />
                </td>
              </tr>
            ))
          ) : tableData && tableName === "Surveys" ? (
            tableData?.map((item, index) => (
              <tr>
                <td className="first-td">{index + 1}</td>
                <td className="d-flex second-img">
                  {item.data?.survey?.surveyImage ? (
                    <>
                      <img
                        src={item.data.survey.surveyImage}
                        alt="charityimage"
                      />
                      <p>{item.data?.survey?.title}</p>
                    </>
                  ) : (
                    <>
                      <img src={NoImage} alt="" />
                      <p>{item.data?.survey?.title}</p>
                    </>
                  )}
                </td>
                <td>
                  {SecondsToDate(item?.data?.target?.from?.seconds * 1000)}
                </td>
                <td>{SecondsToDate(item?.data?.target?.to?.seconds * 1000)}</td>
                <td className="text-center">
                  {item?.data?.target?.surveyresponse}
                </td>
                <td className="text-center">
                  {item?.data?.target?.surveyresponsecomplete}
                </td>
                <td>
                  <Button
                    buttonClass={"add__charity m-0"}
                    text={buttonText}
                    handleClick={() => {
                      viewDetails(item);
                    }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center"> No Data Found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
      </div>
    </div>
  );
}
