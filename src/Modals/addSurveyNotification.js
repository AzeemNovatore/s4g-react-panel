import React from "react";
import { Button, Modal, ModalTitle } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddSurveyNotification({
  modalTitle,
  handleSubmitNotify,
  handleClose,
  showNotification,
  setShowModal,
  show,
  notificationValues,
  setNotificationValues,
  setNotification,
  setNotificationSubmission,
  notificationStatus,
}) {
  const [formError, setFormError] = useState({});

  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Notification Title is Required";
    }
    if (!values.description) {
      errors.description = "Notification Message is Required";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateForm = validate(notificationValues);
    setFormError(validateForm);
    if (Object.keys(validateForm).length > 0)
      return toast.error("Fields are Empty");
    else handleClick();
    if (notificationStatus === "notificationReminder")
      setNotificationSubmission(true);
    setShowModal(false);
    setNotification(true);
  };

  const handleChange = (value, name) => {
    setNotificationValues({ ...notificationValues, [name]: value });
  };

  const handleClick = () => {
    setNotificationValues({ ...notificationValues });
  };

  return (
    <Modal show={show} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-xl-12 col-lg-12 mb-3">
              <div className="fields_charity">
                <label>
                  Notification Title <span className="redColor">*</span>
                </label>
                <br />
                <input
                  type="text"
                  name="title"
                  placeholder="Notification Title"
                  value={notificationValues.title}
                  onChange={(e) => handleChange(e.target.value, "title")}
                />
                {!notificationValues?.title && formError.title ? (
                  <p className="error__msg ">{formError.title}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 mb-3">
              <div className="fields_charity">
                <label>
                  Notification Message <span className="redColor">*</span>
                </label>
                <br />
                <input
                  type="text"
                  name=""
                  placeholder="Notification Message"
                  value={notificationValues.description}
                  onChange={(e) => handleChange(e.target.value, "description")}
                />
                {!notificationValues?.description && formError.description ? (
                  <p className="error__msg ">{formError.description}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="check-button justify-content-end m-0">
            <div className="donate_btn">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button className="cat-add w-100" onClick={addData}>
          {type}
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
}
