import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../component/button";
import { clients } from "../../routes/pathnames";
import { collections, db } from "../../services/firebase";
import { singleClient } from "../../services/firebase/actions";

export default function AddClient() {
  const history = useHistory();

  const isViewMode = history.location.state?.viewMode ?? false;

  const moveToClients = () => {
    history.push(clients);
  };

  const initialFormValues = {
    client_name: "",
    cont_name: "",
    email: "",
    address: "",
    ph_no: "",
    note: "",
    // total_surveys: [],
  };

  const [formvalues, setFormvalues] = useState({ ...initialFormValues });
  const [formError, setFormError] = useState({});

  const { id } = useParams();

  const validate = (values) => {
    const errors = {};
    if (!values.client_name) {
      errors.client_name = "Client Name is Required";
    }
    if (!values.cont_name) {
      errors.cont_name = "Contact Name is Required";
    }
    if (!values.email) {
      errors.email = "Email is Required";
    }
    if (!values.note) {
      errors.note = "Notes is Required";
    }
    return errors;
  };

  const getSingleData = async () => {
    if (id) {
      const docRef = doc(db, collections.clients, id);
      singleClient(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setFormvalues({ ...formvalues, ...docSnap.data() });
        } else console.log("No Such Document");
      });
    }
  };

  useEffect(() => {
    getSingleData();
  }, [id]);

  const addClient = async () => {
    const newDocRef = doc(collection(db, collections.clients));

    await setDoc(newDocRef, {
      ...formvalues,
      clientid: newDocRef.id,
      orderBy: serverTimestamp(),
    });

    history.push(clients);
  };

  const updateClient = async () => {
    const washingtonRef = doc(db, collections.clients, id);
    await updateDoc(washingtonRef, {
      ...formvalues,
    });
    history.push(clients);
  };
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormvalues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    if (id) updateClient();
    else addClient();
  };

  const addDataList = (e) => {
    e.preventDefault();
    const validateForm = validate(formvalues);
    setFormError(validateForm);

    if (Object.keys(validateForm).length > 0)
      return toast.error("Fields are Empty");
    else handleSubmit();
  };

  return (
    <>
      <form action="" onSubmit={addDataList}>
        <div className="main-add-charity">
          <div className="row">
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  Company/ client Name <span className="redColor">*</span>
                </label>
                <br />
                <input
                  type="text"
                  name="client_name"
                  value={formvalues?.client_name}
                  onChange={handleChange}
                  placeholder="enter company/ client name"
                  disabled={isViewMode}
                />
                {formError.client_name ? (
                  <p className="error__msg ">{formError.client_name}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  Contact Name <span className="redColor">*</span>
                </label>
                <br />
                <input
                  type="text"
                  name="cont_name"
                  value={formvalues.cont_name}
                  onChange={handleChange}
                  placeholder="enter your contact name "
                  disabled={isViewMode}
                />
                {formError.cont_name ? (
                  <p className="error__msg ">{formError.cont_name}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  Contact Email Address <span className="redColor">*</span>
                </label>
                <br />
                <input
                  type="email"
                  name="email"
                  value={formvalues.email}
                  onChange={handleChange}
                  placeholder="enter your contact email address"
                  disabled={isViewMode}
                />
                {formError.email ? (
                  <p className="error__msg ">{formError.email}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-xl-4 col-lg-6 mb-3">
                  <div className="fields_charity">
                    <label>Address (Optional)</label>
                    <br />
                    <input
                      type="text"
                      name="address"
                      value={formvalues.address}
                      onChange={handleChange}
                      placeholder="enter your address"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 mb-3">
                  <div className="fields_charity">
                    <label>Phone Number (Optional)</label>
                    <br />
                    <input
                      type="text"
                      name="ph_no"
                      value={formvalues.ph_no}
                      onChange={handleChange}
                      placeholder="enter your phone number"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-8 col-lg-8 mb-3">
              <div className="fields_charity">
                <label>
                  Notes <span className="redColor">*</span>
                </label>
                <br />
                <textarea
                  name="note"
                  value={formvalues.note}
                  onChange={handleChange}
                  className="clientNotes"
                  placeholder="enter your Notes"
                  disabled={isViewMode}
                ></textarea>
                {formError.note ? (
                  <p className="error__msg ">{formError.note}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="check-button justify-content-end">
          <div class="single_button">
            <div class="back_btn">
              <Link to={clients}>{isViewMode ? "Cancel" : "Back"}</Link>
            </div>

            {!isViewMode && (
              <div class="donate_btn">
                <button type="submit">
                  {id ? "Update Client" : "Add Client"}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
