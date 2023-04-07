import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { downloadImageUrl } from "../../../services/firebase/actions";
import { storageGet } from "../../../services/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { updateSurveyCompletedImage } from "../../../services/firebase/actions";
import { useEffect } from "react";
import { updateBannerImages } from "../../../services/firebase/actions";
import { deleteBannerImage } from "../../../services/firebase/actions";
import { Modal } from "react-bootstrap";
import { uploadBanner } from "../../../utils/image";
import { bannerTypes } from "../../../constants";
import HomeBannerImages from "../homeBannerImages";
import ProgressLoading from "../../progressBar";

export default function BannersModal({
  show,
  handleClose,
  bannerImages,
  surveyCompletedImage,
  getallImages,
  setLoading,
  type,
}) {
  //Survey Completed Image
  const [progressBar, setProgressBar] = useState(0);
  const [surveyImage, setSurveyImage] = useState(surveyCompletedImage);
  const [allImage, setAllImage] = useState(bannerImages);
  const [image, setImage] = useState(null);
  const [buttonState, setButtonState] = useState(0);
  const [imageUrl, setImageUrl] = useState();

  const surveyCompleted = async () => {
    try {
      // e.preventDefault();
      let surveyImageFile = surveyImage;
      const storage = storageGet;
      var storagePath = "AppData/" + surveyImageFile.name;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, surveyImageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progrss function ....
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const percent = Math.trunc(progress);
          setProgressBar(percent);
        },
        (error) => {
          // error function ....
          alert(error);
        },
        async () => {
          // complete function ....
          await downloadImageUrl(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              const payload = {
                surveyCompletedImage: downloadURL,
              };

              try {
                setLoading(true);
                await updateSurveyCompletedImage(payload);
              } catch (error) {
                console.log(error);
              } finally {
                setLoading(false);
                toast.success("Survey Completed Image Updated Successfully");
                getallImages();
                setSurveyImage(null);
                handleClose();
              }
            }
          );
        }
      );
    } catch (error) {
      throw error;
    }
  };

  const addSurveyCompleteImage = () => {
    if (surveyImage?.name) {
      surveyCompleted();
    } else {
      alert("Please Choose File");
    }
  };

  const handleChange = (e) => {
    if (type === bannerTypes.homeBanner) {
      setImage(e.target.files[0]);
    } else {
      let PickFile;
      if (e.target.files && e.target.files.length === 1) {
        PickFile = e.target.files[0];
        setSurveyImage(PickFile);
      }
    }
  };

  const uploadImage = async () => {
    try {
      const storage = storageGet;

      let imageFile = image;

      var storagePath = "appData/" + imageFile.name;

      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const percent = Math.trunc(progress);
          setProgressBar(percent);
        },

        (error) => {
          alert(error);
        },

        async () => {
          setLoading(true);
          await downloadImageUrl(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              setImageUrl(downloadURL);
              if (downloadURL) {
                setButtonState(1);
              }
            }
          );
          setLoading(false);
          toast.success("Image Added Successfully");
        }
      );
    } catch (error) {
      throw error;
    }
  };

  const uploadAllImage = async () => {
    allImage.push(imageUrl);
    const payload = {
      homeScreenBanner: allImage,
    };
    try {
      setLoading(true);
      await updateBannerImages(payload);
    } catch (error) {
      console.log(error);
    } finally {
      toast.success("Banners is Updated Successfully");
      setLoading(false);
      handleClose();
    }
    setButtonState(0);
    getallImages();
    setImage(null);
  };

  const deleteBannerHome = async (index) => {
    allImage?.splice(index, 1);
    setAllImage([...allImage]);
    const payload = {
      homeScreenBanner: allImage,
    };
    try {
      setLoading(true);
      await deleteBannerImage(payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.success("Banner is Deleted Successfully");
    }
    getallImages();
  };

  useEffect(() => {
    setSurveyImage(surveyCompletedImage);
  }, [surveyCompletedImage]);

  useEffect(() => {
    setAllImage(bannerImages);
  }, [bannerImages]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="img-banner-modal">
        <Modal.Title className="fs-5">{type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type === bannerTypes.homeBanner && (
          <HomeBannerImages
            homeBannerImages={allImage}
            deleteBannerHome={deleteBannerHome}
          />
        )}

        <div className="banner-update text-center mt-2">
          <div>
            <div className="upload-file">
              <img src={uploadBanner} alt="img" />
              <br />
            </div>
            <div>
              <input
                type="file"
                id="input"
                accept=".jpg,.png,.jpeg"
                className="home-banner-input"
                onChange={handleChange}
              />
            </div>
            <h5 className="text-center mt-1">
              {type === bannerTypes.homeBanner
                ? image?.name
                : surveyImage?.name}
            </h5>
            <p className="browse">
              Drop files directly here or <label htmlFor="input">browse</label>{" "}
              from your device after add Image please update banners
            </p>
          </div>
        </div>
        <ProgressLoading progressBar={progressBar} />
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <div class="single_button">
          <div class="cancel_btn" onClick={() => handleClose()}>
            <button>Cancel</button>
          </div>
          {type === bannerTypes.homeBanner ? (
            <div class="donate_btn">
              <button
                onClick={buttonState === 0 ? uploadImage : uploadAllImage}
              >
                {buttonState === 0 ? "Add Image" : "Update Banners"}
              </button>
            </div>
          ) : (
            <div class="single_button">
              <div class="donate_btn">
                <button onClick={() => addSurveyCompleteImage()}>Update</button>
              </div>
            </div>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
