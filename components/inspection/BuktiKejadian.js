import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Eye, Plus, Trash } from "react-feather";
import FileModal from "./Modal/FileModal";
import PreviewModal from "./Modal/PreviewModal";
import { fetchImage } from "helpers/shared";

const BuktiKejadian = ({ imageList, setImageList, formik }) => {
  const [openModal, setOpenModal] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [previewsFromAPI, setPreviewsFromAPI] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    let isMounted = true; // A flag to check if the component is mounted

    async function fetchAndSetPreviewsFromAPI() {
      try {
        if (formik.values.inventoryDetailGambar.length != 0) {
          const file = await Promise.all(
            formik.values.inventoryDetailGambar.map(async (file) => {
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

  const openPreviewModalHandler = (index = null) => {
    if (index != null) {
      setPreviewFile(previews[index]);
    }
    setOpenPreviewModal((state) => !state);
  };
  const openModalHandler = () => {
    setOpenModal((state) => !state);
  };

  const handleFileChange = (file, name) => {
    let newFiles = [...imageList];
    newFiles.push({
      file: file,
      nama: name,
    });
    setImageList(newFiles);

    const reader = new FileReader();
    reader.onload = () => {
      const newPreviews = [...previews];
      newPreviews.push(reader.result);
      setPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const previewImageFromAPIHandler = async (index) => {
    try {
      setPreviewFile(previewsFromAPI[index]);
      setOpenPreviewModal((state) => !state);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = (idx) => {
    const newPreviews = previews.filter((prev, index) => {
      return index != idx;
    });
    setPreviews(newPreviews);

    const newImageList = imageList.filter((file, index) => {
      return index != idx;
    });
    setImageList(newImageList);
  };

  const handleDeleteFormik = (idx) => {
    let data = formik.values.inventoryDetailGambar.filter((file, index) => {
      return index != idx;
    });

    const newPreviews = previewsFromAPI.filter((prev, index) => {
      return index != idx;
    });
    setPreviewsFromAPI(newPreviews);
    formik.setFieldValue("inventoryDetailGambar", data);
  };

  return (
    <div>
      {previewsFromAPI.length != 0 &&
        formik.values.inventoryDetailGambar.map((item, index) => {
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
                      alt={`image ${item.name}`}
                      src={previewsFromAPI[index]}
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
                      {item.nama}
                    </h5>
                  </div>
                </div>
                <div className="d-flex mr-2" style={{ gap: 20 }}>
                  <div
                    className="border cursor-pointer"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 4,
                      borderColor: "#E9E9E9",
                      textAlignLast: "center",
                    }}
                    onClick={() => previewImageFromAPIHandler(index)}
                  >
                    <Eye style={{ marginTop: 5 }} color="#f24f1f" />
                  </div>
                  <div
                    className="border cursor-pointer"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 4,
                      borderColor: "#E9E9E9",
                      textAlignLast: "center",
                    }}
                    onClick={() => handleDeleteFormik(index)}
                  >
                    <Trash style={{ marginTop: 5 }} color="#f24f1f" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      {imageList.map((item, index) => {
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
                    {previewsFromAPI.length + index + 1}
                  </p>
                </div>
                <div className="ml-1 d-flex" style={{ gap: 20 }}>
                  <Image
                    alt={`image ${item.name}`}
                    src={previews[index]}
                    width={41}
                    height={36}
                  />
                  <h5
                    style={{ paddingTop: 10, fontWeight: 700, color: "black" }}
                  >
                    {item.nama}
                  </h5>
                </div>
              </div>
              <div className="d-flex mr-2" style={{ gap: 20 }}>
                {/* <div
                  className="border cursor-pointer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 4,
                    borderColor: "#E9E9E9",
                    textAlignLast: "center",
                  }}
                >
                  <Download style={{ marginTop: 5 }} color="#f24f1f" />
                </div> */}
                <div
                  className="border cursor-pointer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 4,
                    borderColor: "#E9E9E9",
                    textAlignLast: "center",
                  }}
                  onClick={() => openPreviewModalHandler(index)}
                >
                  <Eye style={{ marginTop: 5 }} color="#f24f1f" />
                </div>
                <div
                  className="border cursor-pointer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 4,
                    borderColor: "#E9E9E9",
                    textAlignLast: "center",
                  }}
                  onClick={() => handleDelete(index)}
                >
                  <Trash style={{ marginTop: 5 }} color="#f24f1f" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
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
        >
          <Plus color="white" />
        </div>
        <h5 style={{ paddingTop: 4, fontWeight: 400, color: "black" }}>
          Tambah gambar inventory
        </h5>
      </div>
      <FileModal
        openModal={openModal}
        openModalHandler={openModalHandler}
        handleSubmit={handleFileChange}
      />
      <PreviewModal
        openModal={openPreviewModal}
        openModalHandler={openPreviewModalHandler}
        preview={previewFile}
      />
    </div>
  );
};

export default BuktiKejadian;
