import { useEffect, useState } from "react";
import { Camera } from "react-feather";
import PreviewInspeksiModal from "../Modal/PreviewInspeksiModal";
import CameraModalForAPD from "../Modal/CameraModalForAPD";
import { fetchImage } from "helpers/shared";

const PhotoContainerCapa = ({ detail, index, formik, isCAPA, viewOnly }) => {
  const [openModal, setOpenModal] = useState(false);
  const openModalHandler = () => {
    setOpenModal((state) => !state);
  };

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const toggleCamera = () => {
    setIsCameraOpen(!isCameraOpen);
  };

  const EditHandler = () => {
    toggleCamera();
  };

  const showError = Boolean(
    formik.touched["detailJenis"] &&
      formik.errors["detailJenis"] &&
      formik.errors["detailJenis"][index] &&
      formik.errors["detailJenis"][index]["photoCAPA"]
  );

  const [previewsFromAPI, setPreviewsFromAPI] = useState([]);

  useEffect(() => {
    let isMounted = true; // A flag to check if the component is mounted

    async function fetchAndSetPreviewsFromAPI() {
      try {
        if (viewOnly) {
          const file = await Promise.all(
            formik.values.detailJenis.map(async (file) => {
              const response = await fetchImage(file.fileIDCapa);
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
    <div
      style={{
        borderStyle: "solid",
        borderWidth: "2px", // Border width
        boxSizing: "border-box", // Include border in the width and height calculations
        width: "100%", // Take 100% of the container's width

        minHeight: "150px",
        height: "50%", // Height starts at 0

        color: "#E2E5DE",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      {!detail.fileIDCapa && !detail.photoCAPA ? (
        <>
          <div className="d-flex justify-content-center align-items-center h-100">
            <Camera
              color="green"
              onClick={() => toggleCamera(index)}
              size={40}
            />
          </div>
          <div className="d-flex justify-content-center">
            {showError && (
              <div className="text-danger" style={{ fontSize: "12px" }}>
                {formik.errors["detailJenis"][index]["photoCAPA"]}
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          {/* {viewOnly && previewsFromAPI[index] ? (
            ) : null} */}
          <img
            src={
              viewOnly
                ? previewsFromAPI[index]
                : detail?.photoCAPA
                ? detail?.photoCAPA
                : null
            }
            className="mw-100"
            alt={`Captured ${index + 1}`}
            // width="200"
            onClick={() => {
              openModalHandler();
            }}
          />
          <PreviewInspeksiModal
            openModal={openModal}
            openModalHandler={openModalHandler}
            preview={
              viewOnly
                ? previewsFromAPI[index]
                : detail?.photoCAPA
                ? detail?.photoCAPA
                : null
            }
            EditHandler={EditHandler}
            isCAPA={isCAPA}
            viewOnly={viewOnly}
          />
        </div>
      )}
      <CameraModalForAPD
        isOpen={isCameraOpen}
        toggle={toggleCamera}
        onCapture={(photo) => {
          formik.setFieldValue(`detailJenis[${index}].photoCAPA`, photo.photo);
        }}
      />
    </div>
  );
};

export default PhotoContainerCapa;
