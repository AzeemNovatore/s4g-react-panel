import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { updateCategoryDoc } from "../services/firebase/actions";
import { toast } from "react-toastify";
import { Category } from "../constants";

export default function CategoryModal({
  show,
  handleClose,
  catValues,
  addCategory,
  handleCatChange,
  formError,
  index,
  item,
  currentItems,
  setCurrentItems,
  setLoading,
  type,
  charities,
  itemOffset,
}) {
  const [state, setState] = useState({
    label: "",
    value: "",
  });

  const itemIndex = itemOffset + index;
  console.log("index", itemIndex);

  const handleCategoryUpdate = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };
  const update = async () => {
    const charityCategoryList = charities.flatMap(
      (item) => item.data.charityCategories
    );

    const checkedValue = charityCategoryList?.some((el) => el === item?.value);
    if (checkedValue) {
      toast.error("This category is added against a charity");
    } else {
      if (state?.label === state?.value) {
        currentItems.splice(itemIndex, 1, state);
        setCurrentItems([...currentItems]);
        const payload = {
          categories: currentItems,
        };

        try {
          setLoading(true);
          await updateCategoryDoc(payload);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
          toast.success("Category is Updated Successfully");
          handleClose();
        }
      } else {
        toast.error("Label and Value must be Same");
      }
    }
  };

  const addData = () => {
    if (type === Category.addCategory) {
      addCategory();
    } else {
      update();
    }
  };

  useEffect(() => {
    setState({
      label: item?.label,
      value: item?.value,
    });
  }, [item]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="" className="w-100 fw-bold">
          Label <span className="redColor">*</span>
          <input
            type="text"
            name="label"
            placeholder="Ex : Doctor"
            className="form-control w-100"
            value={
              type === Category.addCategory ? catValues.label : state?.label
            }
            onChange={
              type === Category.addCategory
                ? handleCatChange
                : handleCategoryUpdate
            }
          />
          {formError?.label ? (
            <p className="error__msg mb-0">{formError?.label}</p>
          ) : (
            ""
          )}
        </label>
        <label htmlFor="" className="w-100 mt-2 fw-bold">
          Value <span className="redColor">*</span>
          <input
            type="text"
            placeholder="Ex : Doctor"
            name="value"
            className="form-control w-100"
            value={
              type === Category.addCategory ? catValues.value : state?.value
            }
            onChange={
              type === Category.addCategory
                ? handleCatChange
                : handleCategoryUpdate
            }
          />
          {formError?.value ? (
            <p className="error__msg mb-0">{formError?.value}</p>
          ) : (
            ""
          )}
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Button className="cat-add w-100" onClick={addData}>
          {type}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
