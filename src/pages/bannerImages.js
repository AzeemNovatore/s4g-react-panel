import React from "react";
import useBanners from "../hooks/useBanners";
import { useState } from "react";
import { updateImage } from "../utils/image";
import { Container, Row } from "reactstrap";
import { LoaderContext } from "../context/loadingContext";
import { useContext } from "react";
import BannerCards from "../component/banners/card";
import BannersModal from "../component/banners/modals/banners";
import { dimensions, bannerTypes, bannerLabels } from "../constants";

export default function BannerImages() {
  const [type, setType] = useState("");
  const { getallImages, bannerDetails } = useBanners();
  const { setLoading } = useContext(LoaderContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onUpdate = (type) => {
    handleShow();
    setType(type);
  };

  return (
    <>
      <BannersModal
        show={show}
        handleClose={handleClose}
        type={type}
        setLoading={setLoading}
        bannerImages={bannerDetails?.homeScreenBanner ?? []}
        surveyCompletedImage={bannerDetails?.surveyCompletedImage}
        getallImages={getallImages}
      />

      <Container className="banner__images">
        <Row className="d-flex  banner_mac">
          <BannerCards
            label={bannerLabels.homeBanner}
            dimension={dimensions.bannerHome}
            images={bannerDetails?.homeScreenBanner ?? []}
            icon={updateImage}
            type={bannerTypes.homeBanner}
            onUpdate={onUpdate}
          />

          <BannerCards
            label={bannerLabels.surveyCompleted}
            dimension={dimensions.bannerSurvey}
            images={
              bannerDetails?.surveyCompletedImage
                ? [bannerDetails?.surveyCompletedImage]
                : []
            }
            icon={updateImage}
            type={bannerTypes.surveyCompleted}
            onUpdate={onUpdate}
          />
        </Row>
      </Container>
    </>
  );
}
