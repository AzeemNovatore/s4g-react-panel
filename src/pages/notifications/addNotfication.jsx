import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

export default function AddNotification() {
  const initialFormValues = {
    title: "",
    description: "",
  };

  const [formvalues, setFormvalues] = useState({ ...initialFormValues });
  const [formError, setFormError] = useState({});

  // const validate = (values) => {
  //   const errors = {};
  //   if (!values.title) {
  //     errors.title = "Notification Title is Required";
  //   }
  //   if (!values.description) {
  //     errors.description = "Notification Text is Required";
  //   }
  //   return errors;
  // };

  // const sentNotification = (e) => {
  //   e.preventDefault();
  //   const validateForm = validate(formvalues);
  //   setFormError(validateForm);

  //   if (Object.keys(validateForm).length > 0)
  //     return toast.error("Fields are Empty");
  //   else handleClick();
  // };

  const validate = (values) => ({
    ...(values.title ? {} : { title: "Notification Title is Required" }),
    ...(values.description
      ? {}
      : { description: "Notification Message is Required" }),
  });

  const sentNotification = (e) => {
    e.preventDefault();
    const validateForm = validate(formvalues);
    setFormError(validateForm);

    if (Object.keys(validateForm).length > 0) {
      return toast.error("Fields are Empty");
    }
    handleClick();
  };

  const handleChange = (value, name) => {
    setFormvalues({ ...formvalues, [name]: value });
  };

  const handleClick = async () => {
    const message = {
      notification: {
        title: formvalues.title,
        body: formvalues.description,
      },
      to: "/topics/allusers",
      // to: "/topics/3XyZkhM7KcVnJo3aBRbKxKzrVd62",
      priority: "high",
      data: {
        status: "done",
      },
    };

    try {
      // Send the push notification via Firebase API
      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization:
            "key=AAAAzdEApQU:APA91bFpk0pFFeFCwjDP6TxhoS8piWUim8tan4X0LuiqVB8px-ZSApHc71dioSMS9Ao3bTCHk_n-Qf4I5-pfY_cmjiaAXDqm84AxwAbKmxeciXShj6G-8o6CTEA_4IeP31wLSFy84nA2",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        setFormvalues(initialFormValues);
        toast.success("Notification sent!");
      } else {
        console.error(`Firebase API returned ${response.status} error`);
        toast.error("Error sending notification");
      }
    } catch (error) {
      console.error("Error sending notification", error);
      toast.error("Error sending notification");
    }
  };

  return (
    <>
      <form onSubmit={sentNotification}>
        <div className="main-add-charity">
          <div className="row">
            <div className="col-xl-6 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  Notification Title <span className="redColor">*</span>
                </label>
                <br />
                <input
                  type="text"
                  name="title"
                  placeholder="Notification Title"
                  value={formvalues.title}
                  onChange={(e) => handleChange(e.target.value, "title")}
                />
                {!formvalues?.title && formError.title ? (
                  <p className="error__msg ">{formError.title}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  Notification Message <span className="redColor">*</span>
                </label>
                <br />
                <input
                  type="text"
                  name=""
                  placeholder="Notification Message"
                  value={formvalues.description}
                  onChange={(e) => handleChange(e.target.value, "description")}
                />
                {!formvalues?.description && formError.description ? (
                  <p className="error__msg ">{formError.description}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="check-button justify-content-end">
          <div className="donate_btn">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </>
  );
}
