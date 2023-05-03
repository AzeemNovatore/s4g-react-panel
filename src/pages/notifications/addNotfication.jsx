import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function AddNotification() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // const handleClick = async () => {
  //   const message = {
  //     notification: {
  //       title: "My Notification",
  //       body: "This is a push notification sent via Firebase!",
  //     },
  //     to: "/topics/allusers",
  //   };

  //   // Send the push notification via Firebase API
  //   const response = await fetch("https://fcm.googleapis.com/fcm/send", {
  //     method: "POST",
  //     headers: {
  //       Authorization:
  //         "key=AAAAzdEApQU:APA91bFpk0pFFeFCwjDP6TxhoS8piWUim8tan4X0LuiqVB8px-ZSApHc71dioSMS9Ao3bTCHk_n-Qf4I5-pfY_cmjiaAXDqm84AxwAbKmxeciXShj6G-8o6CTEA_4IeP31wLSFy84nA2",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(message),
  //   });

  //   console.log("Push notification sent!");
  // };

  const handleClick = async () => {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      // to: "allusers",
      priority: "high",
      data: {
        status: "done",
      },
      to: "/topics/allusers",
      // to: "drELzzAHTXaVmmyWagV6O9:APA91bHetwIKYXNi589PFfCORTo30Rzx32MB6C1_0H9WkYcUObxNJtQa3OBm5qIlPxDOkii5KI_1bH8ATYdzDesjPqfRVTW8QyYA6BK39k5tc0LOjYIh4Cw-3rMHrq7nD0wAjpY8lVf_",
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
        console.log("Push notification sent!");
      } else {
        console.error(`Firebase API returned ${response.status} error`);
      }
    } catch (error) {
      console.error("Error sending push notification", error);
    }
  };

  return (
    <>
      <form action="">
        <div className="main-add-charity">
          <div className="row">
            <div className="col-xl-6 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  Notfification Title <span className="redColor">*</span>
                </label>
                <br />
                <input
                  type="text"
                  name=""
                  placeholder="Notification Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  Notfification Text <span className="redColor">*</span>
                </label>
                <br />
                <input
                  type="text"
                  name=""
                  placeholder="Notification Text"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 mb-3">
              <div className="fields_charity"></div>
            </div>
          </div>
        </div>
        <div className="check-button justify-content-end">
          <div className="single_button">
            <div className="donate_btn">
              {/* <button type="submit">Submit</button> */}
              <Button onClick={handleClick}>Submit</Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
