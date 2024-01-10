import Carousel from "components/Carousel";
import { fetchImage } from "helpers/shared";
import { Fragment, useEffect, useState } from "react";
import ImageContainer from "./ImageContainer";

const CustomCarousel = ({ dataImage }) => {
  console.log(dataImage);
  return (
    <Fragment>
      <Carousel
        child={
          dataImage?.length !== 0
            ? dataImage?.map((preview, index) => {
                return (
                  <ImageContainer src={preview.base64DataUrl} key={index} />
                );
              })
            : []
        }
      />
    </Fragment>
  );
};

export default CustomCarousel;
