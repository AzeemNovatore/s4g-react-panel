import React from "react";
import { Modal } from "react-bootstrap";

export default function DeleteDataModal({
  show,
  handleClose,
  item,
  deleteData,
  catIndex,
  type,
}) {
  console.log("catIndex", catIndex);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <div className="del-charity text-center">
          <h3>"Are You Sure"</h3>
          <p>
            Do you really want to delete the <br /> {type}
          </p>

          <b>
            {item?.data?.charityName
              ? item?.data?.charityName
              :item?.data?.client_name
              ?item?.data?.client_name
              : item?.data?.survey?.title
              ? item?.data?.survey?.title
              : item?.value}
          </b>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <div class="single_button">
          <div class="cancel_btn" onClick={handleClose}>
            <button>Cancel</button>
          </div>
          <div class="delete_btn" onClick={() => deleteData(catIndex)}>
            <button>Delete</button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
