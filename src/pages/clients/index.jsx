import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../component/button";
import ItemsPerPage from "../../component/pagination/itemsPerPage";
import SearchBar from "../../component/pagination/searchBar";
import { TableComponent } from "../../component/table";
import { LoaderContext } from "../../context/loadingContext";
import { deleteClientDoc } from "../../services/firebase/actions";
import DeleteDataModal from "../../Modals/deleteModal";
import {
  clientSurveyDetails,
  addClient,
  updateClient,
  surveys,
  viewClient,
} from "../../routes/pathnames";
import { AddIcon } from "../../utils/image";
import { toast } from "react-toastify";
import useClients from "../../hooks/useClients";
import { useEffect } from "react";
import useSurveys from "../../hooks/useSurveys";

export const tableHeading = [
  "Client Name",
  "Name",
  "Total Survey",
  "Completed Survey",
  "Active Survey",
  "Actions",
  " ",
];

export default function Clients() {
  const history = useHistory();
  const { surveys } = useSurveys();
  const { getClients, clients } = useClients();
  const { setLoading } = useContext(LoaderContext);

  const [singleItemClient, setSingleItemClient] = useState([]);
  const [boolean, setBoolean] = useState(false);
  const [booleanUpdateClient, setBooleanUpdateClient] = useState(false);
  const [booleanViewClient, setBooleanViewClient] = useState(false);
  const [show, setShow] = useState(false);
  const [itemClient, setItemClient] = useState();
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [singleItemClientBoolean, setSingleItemClientBoolean] = useState(false);
  const [updateClientState, setupdateClientState] = useState([]);
  const [viewClientState, setviewClientState] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [searchClient, setSearchClient] = useState("");
  const [itemSinglePage, setItemSinglePage] = useState(10);
  const [surveyIds, setSurveyIds] = useState([]);
  const [data, setData] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const viewDetails = (id) => {
    history.push(`/clients/clientSurveyDetails/${id}`);
  };
  const addClients = () => {
    history.push(addClient);
  };
  const deleteModal = (item) => {
    setItemClient(item);
    handleShow();
  };

  const deleteClient = async () => {
    try {
      setLoading(true);
      await deleteClientDoc(itemClient?.id);
    } catch (error) {
      console.log(error);
    } finally {
      toast.success("Client is Deleted Successfully");
      setLoading(false);
    }
    getClients();
    handleClose();
  };

  const resolveTableList = () => {
    const clientsList = [...clients];

    for (let i = 0; i < clientsList.length; i++) {
      const totalSurveys = surveys?.filter(
        (item, idx) =>
          item?.data?.client?.clientid === clients?.[i]?.data?.clientid
      );
      // console.log(totalSurveys, "here are total surveys");
      // console.log(new Date(1680721200 * 1000).getTime(), "seconds");
      // console.log(new Date().getTime());

      const activeSurveys = totalSurveys?.map(
        (item, idx) =>
          new Date().getTime() >=
          new Date(item?.data?.target?.to?.seconds * 1000).getTime()
      );
      clientsList[i].totalSurveys = totalSurveys;

      clientsList[i].activeSurveys = activeSurveys?.filter(
        (value) => !value
      ).length;
      clientsList[i].completedSurveys = activeSurveys?.filter(
        (value) => value
      ).length;
    }
    setTableList(clientsList);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [itemSinglePage]);

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    resolveTableList();
  }, [clients, surveys]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemSinglePage) % tableList?.length;
    setItemOffset(newOffset);
  };

  const handlePagination = () => {
    const endOffset = itemOffset + itemSinglePage;
    setCurrentItems(tableList.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(tableList?.length / itemSinglePage));
  };

  useEffect(() => {
    if (tableList?.length > 0) {
      handlePagination();
    } else {
      setCurrentItems([]);
      setPageCount(0);
    }
  }, [tableList]);

  useEffect(() => {
    handlePagination();
  }, [itemOffset, itemSinglePage]);

  useEffect(() => {
    if (singleItemClientBoolean) {
      history.push({
        pathname: viewClient,
        state: { detail: singleItemClient },
      });
      setSingleItemClientBoolean(false);
    }
  }, [singleItemClient]);

  useEffect(() => {
    if (booleanUpdateClient) {
      history.push({
        pathname: updateClient,
        state: { detail: updateClientState },
      });
      setBooleanUpdateClient(false);
    }
  }, [updateClientState]);

  useEffect(() => {
    if (searchClient === "") {
      setData(tableList);
    }
    const filtered = currentItems?.filter(
      (item) =>
        item.data.cont_name
          .toLowerCase()
          .includes(searchClient.toLowerCase()) ||
        item.data.client_name.toLowerCase().includes(searchClient.toLowerCase())
    );
    setData(filtered);
  }, [searchClient, currentItems]);

  const viewSingleClient = (item) => {
    setSingleItemClient(item);
    setSingleItemClientBoolean(true);
  };

  return (
    <>
      <DeleteDataModal
        show={show}
        handleClose={handleClose}
        item={itemClient}
        fetchAllClients={getClients}
        setLoading={setLoading}
        deleteData={deleteClient}
        type="Client"
      />
      <div className="d-flex align-items-center justify-content-between form-sec-mac">
        <div className="d-flex align-items-center gap-2">
          <ItemsPerPage
            itemSinglePage={itemSinglePage}
            setItemSinglePage={setItemSinglePage}
          />
          <SearchBar setSearch={setSearchClient} />
        </div>
        <Button
          buttonClass={"add__charity p-2"}
          img={AddIcon}
          text={"Add Client"}
          handleClick={addClients}
        />
      </div>
      <TableComponent
        tableHeading={tableHeading}
        viewDetails={viewDetails}
        buttonText="View Details"
        handleDelete={deleteModal}
        viewSingleClient={viewSingleClient}
        tableData={data}
        filterData={data}
        handlePageClick={handlePageClick}
        pageCount={pageCount}
        surveysList={surveys}
        tableName="Clients"
      />
    </>
  );
}
