import { FieldArray, FormikProvider } from "formik";
import { fetchImage } from "helpers/shared";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Plus, Trash } from "react-feather";
import CameraModal from "./Modal/CameraModal";

const UpdateInventoryImage = ({ formik, viewOnly }) => {
  const [previewsFromAPI, setPreviewsFromAPI] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const openModalHandler = () => {
    setOpenModal((state) => !state);
  };

  const handleFileChange = (file, name, arrayHelpers) => {
    arrayHelpers.push({
      file: file,
      nama: name,
    });

    const reader = new FileReader();
    reader.onload = () => {
      const newPreviews = [...previewsFromAPI];
      newPreviews.push(reader.result);
      setPreviewsFromAPI(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    let isMounted = true; // A flag to check if the component is mounted
    async function fetchAndSetPreviewsFromAPI() {
      try {
        if (formik.values.updateInventoryDetailGambar.length != 0) {
          const file = await Promise.all(
            formik.values.updateInventoryDetailGambar.map(async (file) => {
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
    <FormikProvider value={formik}>
      <FieldArray
        name="updateInventoryDetailGambar"
        render={(arrayHelpers) => {
          return (
            <div className="mt-5">
              <h6 style={{ fontWeight: 800, color: "black", fontSize: 16 }}>
                Gambar Inventory
              </h6>
              {formik.values.updateInventoryDetailGambar.map(
                (gambar, index) => {
                  return (
                    <div
                      className="mt-1 p-1"
                      key={index}
                      style={{
                        borderStyle: "dashed",
                        borderSpacing: 2,
                        color: "#E2E5DE",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <div className="d-flex">
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              backgroundColor: "#46a583",
                              borderRadius: 50,
                              marginTop: 5,
                            }}
                          >
                            <p
                              style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: 700,
                                paddingTop: 3,
                              }}
                            >
                              {index + 1}
                            </p>
                          </div>
                          <div className="ml-1 d-flex" style={{ gap: 20 }}>
                            <Image
                              alt={`image ${gambar.name}`}
                              src={
                                previewsFromAPI[index]
                                  ? previewsFromAPI[index]
                                  : ""
                              }
                              width={41}
                              height={36}
                            />
                            <h5
                              style={{
                                paddingTop: 10,
                                fontWeight: 700,
                                color: "black",
                              }}
                            >
                              {gambar.nama}
                            </h5>
                          </div>
                        </div>
                        <div className="d-flex mr-2" style={{ gap: 20 }}>
                          {!viewOnly && (
                            <div
                              className="border cursor-pointer"
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 4,
                                borderColor: "#E9E9E9",
                                textAlignLast: "center",
                              }}
                              onClick={() => {
                                setPreviewsFromAPI((prev) => {
                                  prev.splice(index, 1);
                                  return prev;
                                });
                                arrayHelpers.remove(index);
                              }}
                            >
                              <Trash style={{ marginTop: 5 }} color="#f24f1f" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
              {!viewOnly && (
                <div
                  className="d-flex mt-1 p-1"
                  style={{
                    borderStyle: "dashed",
                    borderSpacing: 2,
                    alignSelf: "center",
                    gap: 20,
                    color: "#E2E5DE",
                  }}
                  onClick={openModalHandler}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#46a583",
                      borderRadius: 50,
                    }}
                    id="plus"
                  >
                    <Plus color="white" />
                  </div>

                  <h5
                    style={{ paddingTop: 4, fontWeight: 400, color: "black" }}
                  >
                    Tambah gambar inventory
                  </h5>
                </div>
              )}
              {formik.touched.updateInventoryDetailGambar &&
                formik.errors.updateInventoryDetailGambar && (
                  <div className="text-danger">Harus diisi</div>
                )}
              <CameraModal
                openModal={openModal}
                openModalHandler={openModalHandler}
                handleSubmit={(file, nama) =>
                  handleFileChange(file, nama, arrayHelpers)
                }
              />
            </div>
          );
        }}
      />
    </FormikProvider>
  );
};

export default UpdateInventoryImage;
