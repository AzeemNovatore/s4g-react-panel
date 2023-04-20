import React, { useState, useEffect } from "react";
import useCharities from "../../hooks/useCharities";
import DeleteDataModal from "../../Modals/deleteModal";
import Pagination from "../../component/pagination/reactPaginate";
import Tooltip from "react-simple-tooltip";
import { useHistory } from "react-router-dom";
import {
  Delete,
  passwordShow,
  edit,
  NoImage,
  AddIcon,
} from "../../utils/image";
import { addCharity, updateCharity, viewCharity } from "../../routes/pathnames";
import { LoaderContext } from "../../context/loadingContext";
import { useContext } from "react";
import { deleteCharityDoc } from "../../services/firebase/actions";
import { toast } from "react-toastify";
import ItemsPerPage from "../../component/pagination/itemsPerPage";
import SearchBar from "../../component/pagination/searchBar";
import { Link } from "react-router-dom";

export default function Charity() {
  const history = useHistory();
  const [singleViewCharity, setSingleViewCharity] = useState();
  const { getCharities, charities } = useCharities();
  const [boolean, setBoolean] = useState(false);
  const { setLoading } = useContext(LoaderContext);
  const [booleanUpdateCharity, setBooleanUpdateCharity] = useState(false);
  const [searchCharity, setSearchCharity] = useState("");
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [show, setShow] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const [updateCharityState, setUpdateCharityState] = useState([]);
  const [itemCharity, setItemCharity] = useState();
  const [itemSinglePage, setItemSinglePage] = useState(10);
  const [data, setData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteModal = (item) => {
    setItemCharity(item);
    handleShow();
  };

  const deleteCharity = async () => {
    try {
      setLoading(true);
      await deleteCharityDoc(itemCharity?.id);
    } catch (error) {
      console.log(error);
    } finally {
      toast.success("Charity is Deleted Successfully");
      setLoading(false);
    }
    getCharities();
    handleClose();
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemSinglePage) % charities?.length;
    setItemOffset(newOffset);
  };

  const handlePagination = () => {
    const endOffset = itemOffset + itemSinglePage;
    setCurrentItems(charities.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(charities?.length / itemSinglePage));
  };

  useEffect(() => {
    setItemOffset(0);
  }, [itemSinglePage]);

  useEffect(() => {
    if (boolean === true) {
      history.push({
        pathname: viewCharity,
        state: { detail: singleViewCharity },
      });
      setBoolean(false);
    }
  }, [singleViewCharity]);

  useEffect(() => {
    getCharities();
  }, []);

  useEffect(() => {
    if (charities.length > 0) {
      handlePagination();
    } else {
      setCurrentItems([]);
      setPageCount(0);
    }
  }, [charities]);

  useEffect(() => {
    handlePagination();
  }, [itemOffset, itemSinglePage]);

  useEffect(() => {
    if (booleanUpdateCharity) {
      history.push({
        pathname: updateCharity,
        state: { detail: updateCharityState },
      });
      setBooleanUpdateCharity(false);
    }
  }, [updateCharityState]);

  useEffect(() => {
    const filtered = currentItems?.filter((item) =>
      item.data.charityName.toLowerCase().includes(searchCharity.toLowerCase())
    );
    setData(filtered);
  }, [searchCharity, currentItems]);

  return (
    <>
      <DeleteDataModal
        show={show}
        handleClose={handleClose}
        item={itemCharity}
        fetchAllCharities={getCharities}
        setLoading={setLoading}
        deleteData={deleteCharity}
        type="Charity"
      />

      <div className="d-flex align-items-center justify-content-between form-sec-mac">
        <div className="d-flex align-items-center gap-2">
          <ItemsPerPage
            itemSinglePage={itemSinglePage}
            setItemSinglePage={setItemSinglePage}
          />

          <SearchBar setSearch={setSearchCharity} />
        </div>
        <div className="d-flex align-items-center">
          <Link
            className="add__charity p-2 text-decoration-none"
            to={addCharity}
          >
            <button>
              <img src={AddIcon} alt="" />
              Add Charity
            </button>
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table class="table text-white">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Sr</th>
              <th scope="col">Charity Details</th>
              <th scope="col" className="charity-tag-line">
                Charity Description
              </th>
              <th scope="col">Charity Tag Line</th>
              <th scope="col">Category</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.map((item, i) => (
                <tr key={i}>
                  <td className="first-td">{i + itemOffset + 1}</td>
                  <td className="d-flex second-img">
                    {item.data.charityImage ? (
                      <>
                        <img src={item.data.charityImage} alt="charityimage" />
                        <p className="charitydetail">{item.data.charityName}</p>
                      </>
                    ) : (
                      <>
                        <img src={NoImage} alt="" />
                        <p className="charitydetail">{item.data.charityName}</p>
                      </>
                    )}
                  </td>

                  <td>
                    {" "}
                    <div className="charitydescription">
                      {" "}
                      {item.data.charityDescription}
                    </div>
                  </td>
                  <td>
                    {" "}
                    <div className="charityTagline">
                      {" "}
                      {item.data.charityTagLine}{" "}
                    </div>{" "}
                  </td>
                  <td>
                    <div className="d-flex">
                      <p className="mb-0 category-tooltip">
                        {item?.data?.charityCategories[0]}
                      </p>
                      <Tooltip
                        border=""
                        background="#fff"
                        content=<div className="tooltip-item">
                          {" "}
                          {item.data?.charityCategories?.map((item) => (
                            <div className="d-flex align-items-center gap-2">
                              <div className="tooltip-box"></div>
                              <p className="mb-0">{item}</p>
                            </div>
                          ))}
                        </div>
                      >
                        {item.data.charityCategories?.length > 1 ? (
                          <p className="mb-0 ms-2 category-tooltip">More</p>
                        ) : (
                          ""
                        )}
                      </Tooltip>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div>
                        <img
                          src={passwordShow}
                          alt="eyes"
                          className="cursor"
                          // onClick={() => viewSingleCharity()}
                          onClick={() => {
                            setSingleViewCharity(item.data);
                            setBoolean(true);
                          }}
                        />
                      </div>
                      <div>
                        <Link
                          // onClick={() => {
                          //   setUpdateCharityState(item);
                          //   setBooleanUpdateCharity(true);
                          // }}
                          to={`/update_Charity/${item.id}`}
                        >
                          <img src={edit} alt="edit" className="cursor" />
                        </Link>
                      </div>
                      <div>
                        <img
                          src={Delete}
                          alt="del"
                          className="cursor"
                          onClick={() => deleteModal(item)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan="6" className="text-center">
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
