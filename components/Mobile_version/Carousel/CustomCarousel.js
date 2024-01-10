import Carousel from "components/Carousel";
import { fetchImage } from "helpers/shared";
import { Fragment, useEffect, useState } from "react";
import ImageContainer from "./ImageContainer";

const CustomCarousel = ({ dataImage }) => {
  console.log(dataImage);
  const [previewsFromAPI, setPreviewsFromAPI] = useState([]);

  useEffect(() => {
    let isMounted = true; // A flag to check if the component is mounted

    async function fetchAndSetPreviewsFromAPI() {
      try {
        if (dataImage.length != 0) {
          const file = await Promise.all(
            dataImage.map(async (file) => {
              const response = await fetchImage(file.fileId);
              if (response != null) {
                return response;
              } else {
                return "";
              }
            })
          );

          // Check if the component is still mounted before updating the state
          if (isMounted) {
            setPreviewsFromAPI(file);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchAndSetPreviewsFromAPI();

    // Cleanup function to cancel any pending asynchronous tasks
    return () => {
      isMounted = false; // Set the flag to indicate that the component is unmounted
    };
  }, []);

  return (
    <Fragment>
      <Carousel
        child={
          previewsFromAPI.length !== 0
            ? previewsFromAPI.map((preview, index) => {
                return <ImageContainer src={preview} key={index} imageName={dataImage[index]?.nama || ""}/>;
              })
            : []
        }
      />
    </Fragment>
  );
};

export default CustomCarousel;
