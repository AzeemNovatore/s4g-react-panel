import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container } from "reactstrap";
import Slider from "react-slick";
export default function ReactSlick({
  singleitem,
  id,
  homeBannerList,
  secondaryPics,
}) {
  var settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  var settings2 = {
    dots: true,
    // autoplay: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  var settings3 = {
    dots: false,
    autoplay: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      {id === "1" ? (
        <Slider {...settings2}>
          {homeBannerList?.map((item) => (
            <div className="position-relative">
              <img
                src={item}
                alt=""
                className="homerimg bannerImg position-relative"
              />
            </div>
          ))}
        </Slider>
      ) : id === "2" ? (
        <Slider {...settings3} className="secondary__images__view">
          {secondaryPics?.map((item) => (
            <img src={item} alt="" className="secondary-slider-pics" />
          ))}
        </Slider>
      ) : (
        <Container className="mt-3">
          <Slider {...settings} className="w-100">
            {singleitem?.map((item) => (
              <img src={item} alt="" className="imgsecondarypics bannerImg" />
            ))}
          </Slider>
        </Container>
      )}
    </>
  );
}
