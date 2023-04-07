import React, { useState } from "react";
import Pagination from "../component/pagination/reactPaginate";
import { AddIcon, Delete, edit } from "../utils/image";
import { useEffect } from "react";
import useCategories from "../hooks/useCategories";
import {
  addCategoryDoc,
  deleteCategoryDoc,
} from "../services/firebase/actions";
import { toast } from "react-toastify";
import { LoaderContext } from "../context/loadingContext";
import { useContext } from "react";
import DeleteDataModal from "../Modals/deleteModal";
import useCharities from "../hooks/useCharities";
import CategoryModal from "../Modals/categoryModal";
import { Category } from "../constants";
import ItemsPerPage from "../component/pagination/itemsPerPage";
import SearchBar from "../component/pagination/searchBar";

export default function Categories() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const handleCloseCat = () => setShowCategoryModal(false);
  const handleShowCat = () => setShowCategoryModal(true);
  const { charities } = useCharities();

  const [itemSinglePage, setItemSinglePage] = useState(10);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [formError, setFormError] = useState({});
  const [pageCount, setPageCount] = useState(0);
  const { setLoading } = useContext(LoaderContext);
  const [itemUpdateCat, setItemUpdateCat] = useState({});
  const [index, setIndex] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [searchCategory, setSearchCategory] = useState("");
  const [catIndex, setCatIndex] = useState();
  const [item, setItem] = useState();
  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const { categories, setCategories, getCategories } = useCategories();

  const [catValues, setCatValues] = useState({
    label: "",
    value: "",
  });

  const handleCatChange = (e) => {
    const { name, value } = e.target;
    setCatValues({ ...catValues, [name]: value });
  };

  const addCategory = async () => {
    setFormError(validate(catValues));

    var data = currentItems.find(function (ele) {
      return ele.value === catValues.value;
    });

    if (
      catValues.label === catValues.value &&
      catValues.label &&
      catValues.value &&
      !data
    ) {
      categories?.push({ ...catValues });
      const payload = {
        categories: categories,
      };
      setLoading(true);
      try {
        await addCategoryDoc(payload);
      } catch (error) {
        console.log(error);
      } finally {
        toast.success("Category is Added Successfully");
        setLoading(false);
      }
      setCatValues({ ...catValues, label: "", value: "" });
      handleCloseCat();
      getCategories();
    }
    if (catValues.label !== catValues.value) {
      toast.error("Label and Value must be Same");
    }

    if (data) {
      alert("Category Already Exist");
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.label) {
      errors.label = "Label is Required";
    }
    if (!values.value) {
      errors.value = "Value is Required";
    }

    return errors;
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemSinglePage) % categories?.length;
    setItemOffset(newOffset);
  };

  const handlePagination = () => {
    const endOffset = itemOffset + itemSinglePage;
    setCurrentItems(categories.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(categories?.length / itemSinglePage));
  };

  const deleteCat = async (index, item) => {
    const charityCategoryList = charities.flatMap(
      (item) => item.data.charityCategories
    );

    const checkedValue = charityCategoryList?.some((el) => el === item?.value);

    if (checkedValue) {
      toast.error("This category is added against a charity");
      handleClose();
    } else {
      categories.splice(index, 1);
      setCategories([...categories]);
      const payload = {
        categories: categories,
      };

      try {
        setLoading(true);
        await deleteCategoryDoc(payload);
      } catch (error) {
        console.log(error);
      } finally {
        toast.success("Category is Deleted Successfully");
        setLoading(false);
        handleClose();
      }
    }
  };

  const updateCat = (item) => {
    setItemUpdateCat(item);
    handleShowCat();
  };

  const modalCatShow = (i, item) => {
    setCatIndex(i + itemOffset);
    setItem(item);
    handleShow();
  };

  const typeCategoryModal = (type) => {
    setType(type);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      handlePagination();
    } else {
      setCurrentItems([]);
      setPageCount(0);
    }
  }, [categories]);

  useEffect(() => {
    handlePagination();
  }, [itemOffset, itemSinglePage]);

  useEffect(() => {
    const filtered = currentItems?.filter((item) =>
      item.value.toLowerCase().includes(searchCategory.toLowerCase())
    );
    setData(filtered);
  }, [searchCategory, currentItems]);

  return (
    <>
      <CategoryModal
        show={showCategoryModal}
        handleClose={handleCloseCat}
        catValues={catValues}
        addCategory={addCategory}
        handleCatChange={handleCatChange}
        formError={formError}
        currentItems={categories}
        setCurrentItems={setCategories}
        item={itemUpdateCat}
        setLoading={setLoading}
        type={type}
        index={index}
        charities={charities ?? []}
        itemOffset={itemOffset}
      />
      <DeleteDataModal
        show={show}
        handleClose={handleClose}
        item={item}
        catIndex={catIndex ?? null}
        deleteData={() => deleteCat(catIndex, item)}
        type="Category"
      />
      <div className="d-flex align-items-center justify-content-between form-sec-mac">
        <div className="d-flex align-items-center gap-2">
          <ItemsPerPage
            itemSinglePage={itemSinglePage}
            setItemSinglePage={setItemSinglePage}
          />
          <SearchBar setSearch={setSearchCategory} />
        </div>

        <div className="d-flex align-items-center">
          <div
            className="add-category"
            onClick={() => {
              handleShowCat();
              typeCategoryModal(Category.addCategory);
            }}
          >
            <button>
              <img src={AddIcon} alt="" />
              Add Category
            </button>   
          </div>
        </div>
      </div>
      <div className="responsive__table">
        <table class="table text-white">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Sr</th>
              <th scope="col" className="category-id">
                Category
              </th>
              <th scope="col" className="category-label">
                Label
              </th>

              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.map((item, i) => (
                <tr>
                  <td>{i + itemOffset + 1}</td>
                  <td>{item.value}</td>
                  <td>{item.label}</td>
                  <td>
                    <div className="action-cat">
                      <img
                        src={edit}
                        alt=""
                        onClick={() => {
                          updateCat(item);
                          setIndex(i);
                          typeCategoryModal(Category.updateCategory);
                        }}
                      />
                      <img
                        src={Delete}
                        alt=""
                        onClick={() => modalCatShow(i, item)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan="4" className="text-center">
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
