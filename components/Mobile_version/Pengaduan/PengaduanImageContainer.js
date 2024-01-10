import { fetchImage } from "helpers/shared";
import { useEffect, useState } from "react";
import PengaduanFileCard from "./PengaduanFileCard";

const PengaduanImageContainer = ({ formik }) => {
  const [previewsFromAPI, setPreviewsFromAPI] = useState([]);
  useEffect(() => {
    let isMounted = true; // A flag to check if the component is mounted

    async function fetchAndSetPreviewsFromAPI() {
      try {
        if (formik.values.gambarInventory.length != 0) {
          const file = await Promise.all(
            formik.values.gambarInventory.map(async (file) => {
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
    <>
      {previewsFromAPI.length != 0 &&
        formik.values.gambarInventory.map((item, index) => {
          return (
            <PengaduanFileCard
              index={index}
              preview={previewsFromAPI[index]}
              name={item.keterangan}
            />
          );
        })}
    </>
  );
};

export default PengaduanImageContainer;
