import React from "react";
import Button from "../../component/button";
import { AddIcon } from "../../utils/image";
import { useHistory } from "react-router-dom";
import { addNotification } from "../../routes/pathnames";
import SearchBar from "../../component/pagination/searchBar";

export default function Notifications() {
  const history = useHistory();

  const addNewNotification = () => {
    history.push(addNotification);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between form-sec-mac">
        <div className="d-flex align-items-center gap-2">
          {/* <ItemsPerPage
            itemSinglePage={itemSinglePage}
            setItemSinglePage={setItemSinglePage}
          /> */}
          <SearchBar />
        </div>
        <Button
          buttonClass={"add__charity p-2"}
          img={AddIcon}
          text={"Add New Notification"}
          handleClick={addNewNotification}
        />
      </div>
    </>
  );
}
