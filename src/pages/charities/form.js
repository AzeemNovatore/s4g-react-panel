import React from "react";
import { useState, useEffect } from "react";
import { uploadImg } from "../../utils/image";
import Dropdowncharitycategory from "../../component/dropdown/dropdowncharitycategory";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { db, storageGet } from "../../services/firebase";
import useCategories from "../../hooks/useCategories";
import { LoaderContext } from "../../context/loadingContext";
import { useContext } from "react";
import { collections } from "../../services/firebase";

import { singleCharity } from "../../services/firebase/actions";
import { charities } from "../../routes/pathnames";
import { dimensions } from "../../constants";
import { useParams } from "react-router-dom";
import ReactSlick from "../../component/reactSlick";
import { compressFile } from "../../utils/compressImageFile";

export default function CharityForm() {
  const initialFormValues = {
    charityName: "",
    charityDescription: "",
    charityDescription2: "",
    charityCategories: [],
    charityTagLine: "",
    donateLink: "",
    raised: "",
    charityActive: false,
    charityImage: "",
    charityHeadlineImage: "",
    charityBackgroungImage: "",
    charityLogoImage: "",
    secondaryPictures: [],
  };

  const history = useHistory();
  const { categories, getCategories } = useCategories();
  const [formvalues, setFormvalues] = useState({ ...initialFormValues });
  const [formError, setFormError] = useState({});
  const [imageState, setImageState] = useState(0);

  const { loading, setLoading } = useContext(LoaderContext);
  const { progress, setProgress } = useState(null);
  const { progress2, setProgress2 } = useState(null);
  const [charityImageFile, setCharityImageFile] = useState(null);
  const [charityLogoImageFile, setCharityLogoImageFile] = useState(null);
  const [charityBackImageFile, setCharityBackImageFile] = useState(null);
  const [secondaryImageFiles, setSecondaryImageFiles] = useState([]);
  const [urls, setURLS] = useState([]);
  const [charityHeadLineImageFile, setCharityHeadLineImageFile] =
    useState(null);
  const { id } = useParams();

  const [previewImage, setPreviewImage] = useState({
    charityPreview: null,
    charitylogoPreview: null,
    charityHeadlinePreview: null,
    charityCoverPreview: null,
  });

  const onSelectChange = (name, value) =>
    setFormvalues({ ...formvalues, [name]: value });

  useEffect(() => {
    const uploadFile = () => {
      setLoading(true);
      const storage = storageGet;
      const name = new Date().getTime() + charityImageFile.name;
      const storagePath = `charities/charityImages/${name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, charityImageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },

        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setFormvalues({ ...formvalues, charityImage: url });
          }, setLoading(false));
        }
      );
    };
    charityImageFile && uploadFile();
  }, [charityImageFile]);

  useEffect(() => {
    const uploadFile2 = () => {
      setLoading(true);
      const storage = storageGet;
      const name = new Date().getTime() + charityLogoImageFile.name;
      const storagePath = `charities/charityLogoImages/${name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, charityLogoImageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },

        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setFormvalues({ ...formvalues, charityLogoImage: url });
          }, setLoading(false));
        }
      );
    };
    charityLogoImageFile && uploadFile2();
  }, [charityLogoImageFile]);

  useEffect(() => {
    const uploadFile3 = () => {
      setLoading(true);
      const storage = storageGet;
      const name = new Date().getTime() + charityHeadLineImageFile.name;
      const storagePath = `charities/charityHeadLineImages/${name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(
        storageRef,
        charityHeadLineImageFile
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },

        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setFormvalues({ ...formvalues, charityHeadlineImage: url });
          }, setLoading(false));
        }
      );
    };
    charityHeadLineImageFile && uploadFile3();
  }, [charityHeadLineImageFile]);

  useEffect(() => {
    const uploadFile4 = () => {
      setLoading(true);
      const storage = storageGet;
      const name = new Date().getTime() + charityBackImageFile.name;
      const storagePath = `charities/charityCoverImages/${name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, charityBackImageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },

        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setFormvalues({ ...formvalues, charityBackgroungImage: url });
          }, setLoading(false));
        }
      );
    };
    charityBackImageFile && uploadFile4();
  }, [charityBackImageFile]);

  let secondarypicsfile = null;

  useEffect(() => {
    const uploadFiles5 = () => {
      setLoading(true);
      const storage = storageGet;
      const promises = [];
      for (var i = 0; i < secondaryImageFiles.length; i++) {
        secondarypicsfile = secondaryImageFiles[i];

        const name3 = new Date().getTime() + secondarypicsfile.name;
        const storageRef = ref(storage, name3);
        const uploadTask = uploadBytesResumable(storageRef, secondarypicsfile);
        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress2(prog);
          },

          (error) => console.log(error),

          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then(
              (downloadURLs) => {
                // setURLs((prevState) => [...prevState, downloadURLs]);
                setURLS((prevState) => [...prevState, downloadURLs]);
                console.log("File available at", downloadURLs);
              },
              setLoading(false)
            );
          }
        );
      }
      Promise.all(promises)
        .then(() => console.log("All images uploaded"))
        .then((err) => console.log(err));
    };

    secondaryImageFiles && uploadFiles5();
  }, [secondaryImageFiles]);

  const validate = (values) => {
    const errors = {};
    if (!values.charityName) {
      errors.charityName = "Charity Name is Required";
    }
    if (!values.charityCategories || values.charityCategories?.length === 0) {
      errors.charityCategories = "Charity Categories is Required";
    }
    if (!values.charityDescription) {
      errors.charityDescription = "Charity Description is Required";
    }
    if (!values.charityDescription2) {
      errors.charityDescription2 = "Charity Description 2 is Required";
    }
    if (!values.charityTagLine) {
      errors.charityTagLine = "Charity TagLine is Required";
    }
    if (!values.donateLink) {
      errors.donateLink = "Donate Link is Required";
    }
    if (!values.charityImage) {
      errors.charityImage = "Charity Image is Required";
    }
    if (!values.charityHeadlineImage) {
      errors.charityHeadlineImage = "Charity Headline Image is Required";
    }
    if (!values.charityBackgroungImage) {
      errors.charityBackgroungImage = "Charity Cover Image is Required";
    }
    if (!values.charityLogoImage) {
      errors.charityLogoImage = "Charity Logo is Required";
    }
    if (!values.charityActive) {
      errors.charityActive = "Charity Active is Required";
    }
    if (
      !values.secondaryPictures ||
      (values.secondaryPictures?.length === 0 && id)
    ) {
      errors.secondaryPictures = "Charity Secondary Images is Required";
    }
    if (urls.length === 0 && !id)
      errors.urlsSecondaryPictures = "Charity Secondary Images is Required";
    return errors;
  };

  const movetoCharity = () => {
    history.push(charities);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormvalues({ ...formvalues, [name]: val });
  };

  const getSingleData = async () => {
    if (id) {
      const docRef = doc(db, collections.charity, id);
      singleCharity(docRef).then((docSnap) => {
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

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setFormvalues({
      ...formvalues,
      charityCategories: categories?.filter((el) =>
        formvalues?.charityCategories?.includes(el.value)
      ),
    });
  }, [categories]);

  const addCharity = async () => {
    const newDocRef = doc(collection(db, collections.charity));
    const catVal = formvalues.charityCategories.map((item) => item.value);
    const raised = parseInt(formvalues.raised);
    const images = urls.map((item) => item);
    await setDoc(newDocRef, {
      ...formvalues,
      charityCategories: catVal,
      secondaryPictures: images,
      charityid: newDocRef.id,
      raised: raised ? raised : 0,
      orderBy: serverTimestamp(),
      kidsHelped: 0,
      like_count: 0,
    });

    history.push(charities);
  };

  const updateCharity = async () => {
    const washingtonRef = doc(db, collections.charity, id);
    const catVal = formvalues.charityCategories.map((item) => item.value);
    const raised = parseInt(formvalues.raised);
    const images = urls.map((item) => item);
    await updateDoc(washingtonRef, {
      ...formvalues,
      // likes: 12,
      charityCategories: catVal,
      raised: raised ? raised : 0,
      secondaryPictures:
        urls.length !== 0 ? images : formvalues.secondaryPictures,
    });
    history.push(charities);
  };

  const handleSubmit = () => {
    // e.preventDefault();
    if (id) updateCharity();
    else addCharity();
  };

  const addDataList = (e) => {
    e.preventDefault();
    const validateForm = validate(formvalues);
    setFormError(validateForm);
    if (Object.keys(validateForm).length > 0)
      return toast.error("Fields are Empty");
    else handleSubmit();
  };

  const checkHandler = async (type, e) => {
    if (type === "charityImage") {
      const file = await compressFile(e.target?.files[0]);
      setCharityImageFile(file);
    }
    if (type === "secondaryPics") {
      setSecondaryImageFiles(e.target?.files);
    }
    if (type === "logoImage") {
      const file = await compressFile(e.target?.files[0]);
      setCharityLogoImageFile(file);
    }
    if (type === "headlineImage") {
      const file = await compressFile(e.target?.files[0]);
      setCharityHeadLineImageFile(file);
    }
    if (type === "coverImage") {
      const file = await compressFile(e.target?.files[0]);
      setCharityBackImageFile(file);
    }
  };

  return (
    <form onSubmit={addDataList}>
      <div className="main-add-charity">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity">
                <label>
                  {" "}
                  Charity Name <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="text"
                  name="charityName"
                  value={formvalues.charityName}
                  placeholder="enter your charity name"
                  onChange={handleChange}
                />
                {formError.charityName ? (
                  <p className="error__msg ">{formError.charityName}</p>
                ) : (
                  ""
                )}
              </div>
              <div className="fields_charity mt-1">
                <label>
                  {" "}
                  Enter your charity tag line{" "}
                  <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <input
                  type="text"
                  name="charityTagLine"
                  value={formvalues.charityTagLine}
                  onChange={handleChange}
                  placeholder="enter your charity name"
                />
                {formError.charityTagLine ? (
                  <p className="error__msg ">{formError.charityTagLine}</p>
                ) : (
                  ""
                )}
              </div>
              <div className="fw-bold mt-1">
                <label for="num">
                  {" "}
                  Category <span className="redColor">*</span>{" "}
                </label>{" "}
                <br />
                <Dropdowncharitycategory
                  optionscat={categories ?? []}
                  selected={formvalues.charityCategories}
                  handleChange={onSelectChange}
                />
                {formError.charityCategories ? (
                  <p className="error__msg fw-normal">
                    {formError.charityCategories}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className="fields_charity mt-1">
                <label for="homepage">
                  Donate Link <span className="redColor">*</span>
                </label>
                <input
                  type="url"
                  id="homepage"
                  name="donateLink"
                  value={formvalues.donateLink}
                  onChange={handleChange}
                  placeholder="enter your donate link"
                />
                {formError.donateLink ? (
                  <p className="error__msg ">{formError.donateLink}</p>
                ) : (
                  ""
                )}
              </div>
              <div className="fields_charity mt-1">
                <label for="homepage">Raised</label>
                <input
                  type="number"
                  name="raised"
                  value={formvalues.raised}
                  onChange={handleChange}
                  placeholder="Ex: 100"
                />
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity">
                <label for="">
                  Charity Description <span className="redColor">*</span>
                </label>
                <textarea
                  id="w3review"
                  rows="4"
                  cols="50"
                  name="charityDescription"
                  value={formvalues.charityDescription}
                  onChange={handleChange}
                >
                  enter your charity description...
                </textarea>
                {formError.charityDescription ? (
                  <p className="error__msg ">{formError.charityDescription}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity">
                <label for="">
                  Charity Description 2 <span className="redColor">*</span>
                </label>
                <textarea
                  id="w3review"
                  rows="4"
                  cols="50"
                  name="charityDescription2"
                  value={formvalues.charityDescription2}
                  onChange={handleChange}
                >
                  enter your charity description 2...
                </textarea>
                {formError.charityDescription2 ? (
                  <p className="error__msg ">{formError.charityDescription2}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity-1">
                <label for="num">
                  Charity List Image <span className="redColor">*</span>{" "}
                  <span className="fw-normal">{dimensions.charityList}</span>{" "}
                </label>{" "}
                <br />
                <div className="img-field update-img-field">
                  {formvalues.charityImage?.name ? (
                    <img src={previewImage.charityPreview} alt="img" />
                  ) : formvalues.charityImage ? (
                    <img src={formvalues.charityImage} alt="img" />
                  ) : (
                    <img src={uploadImg} alt="img" />
                  )}
                  <input
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    onChange={(e) => checkHandler("charityImage", e)}
                  />
                </div>
                {formError.charityImage ? (
                  <p className="error__msg ">{formError.charityImage}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity-1 ">
                <label for="num">
                  Charity Secondary Images <span className="redColor">*</span>{" "}
                  <span className="fw-normal">
                    {dimensions.charitySecondaryImage}
                  </span>{" "}
                </label>{" "}
                <br />
                {/* count-secondary-image */}
                <div className="img-field update-img-field">
                  {id ? (
                    <ReactSlick
                      secondaryPics={formvalues.secondaryPictures ?? []}
                      id="2"
                    />
                  ) : urls.length !== 0 ? (
                    <ReactSlick secondaryPics={urls ?? []} id="2" />
                  ) : (
                    <img src={uploadImg} alt="img" />
                  )}
                  <input
                    type="file"
                    multiple
                    onChange={(e) => checkHandler("secondaryPics", e)}
                  />
                </div>
                {formError.secondaryPictures ? (
                  <p className="error__msg ">{formError.secondaryPictures}</p>
                ) : (
                  ""
                )}
                {formError.urlsSecondaryPictures ? (
                  <p className="error__msg ">
                    {formError.urlsSecondaryPictures}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity-1">
                <label for="num">
                  Charity Logo <span className="redColor">*</span>{" "}
                  <span className="fw-normal">{dimensions.charityLogo}</span>{" "}
                </label>{" "}
                <br />
                <div className="img-field update-img-field">
                  {formvalues.charityLogoImage?.name ? (
                    <img src={previewImage.charitylogoPreview} alt="img" />
                  ) : formvalues.charityLogoImage ? (
                    <img src={formvalues.charityLogoImage} alt="img" />
                  ) : (
                    <img src={uploadImg} alt="img" />
                  )}
                  <input
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    onChange={(e) => checkHandler("logoImage", e)}
                  />
                </div>
                {formError.charityLogoImage ? (
                  <p className="error__msg ">{formError.charityLogoImage}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity-1">
                <label for="num">
                  Charity Headline Image <span className="redColor">*</span>{" "}
                  <span className="fw-normal">
                    {dimensions.charityHeadlineImage}
                  </span>{" "}
                </label>{" "}
                <br />
                <div className="img-field update-img-field">
                  {formvalues.charityHeadlineImage?.name ? (
                    <img src={previewImage.charityHeadlinePreview} alt="img" />
                  ) : formvalues.charityHeadlineImage ? (
                    <img src={formvalues.charityHeadlineImage} alt="img" />
                  ) : (
                    <img src={uploadImg} alt="img" />
                  )}
                  <input
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    onChange={(e) => checkHandler("headlineImage", e)}
                  />
                </div>
                {formError.charityHeadlineImage ? (
                  <p className="error__msg ">
                    {formError.charityHeadlineImage}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className="fields_charity-1 ">
                <label for="num">
                  Charity Cover Image <span className="redColor">*</span>{" "}
                  <span className="fw-normal">
                    {dimensions.charityCoverImage}
                  </span>{" "}
                </label>{" "}
                <br />
                <div className="img-field update-img-field">
                  {formvalues.charityBackgroungImage?.name ? (
                    <img src={previewImage.charityCoverPreview} alt="img" />
                  ) : formvalues.charityBackgroungImage ? (
                    <img src={formvalues.charityBackgroungImage} alt="img" />
                  ) : (
                    <img src={uploadImg} alt="img" />
                  )}
                  <input
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    onChange={(e) => checkHandler("coverImage", e)}
                  />
                </div>
                {formError.charityBackgroungImage ? (
                  <p className="error__msg ">
                    {formError.charityBackgroungImage}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="check-button">
        <div className="check-box-charity">
          <p>
            {" "}
            <input
              type="checkbox"
              name="charityActive"
              checked={formvalues.charityActive}
              onChange={handleChange}
            />{" "}
            If you want to active this charity then please check{" "}
            <span className="redColor">*</span>{" "}
          </p>
          {formError.charityActive ? (
            <p className="error__msg fw-normal">{formError.charityActive}</p>
          ) : (
            ""
          )}
        </div>

        <div class="single_button">
          <div class="back_btn" onClick={() => movetoCharity()}>
            <span>Back</span>
          </div>

          <div class="donate_btn">
            <button
              type="submit"
              disabled={progress !== null && progress < 100}
            >
              {id ? "Update Charity" : "Add Charity"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
