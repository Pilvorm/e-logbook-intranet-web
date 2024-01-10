import Image from "next/image";
import { useState } from "react";
import PreviewModal from "../../QrCodeHome/Modal/previewModal";

const ImageContainer = ({ src, imageName }) => {
  const [openModal, setOpenModal] = useState(false);
  const openModalHandler = () => {
    setOpenModal((state) => !state);
  };

  return (
    <>
      <div onClick={openModalHandler}>
        <img
          src={src}
          style={{ marginTop: 10, objectFit: "cover" }}
          alt="Thumbnail"
        />
      </div>
      <PreviewModal
        openModal={openModal}
        openModalHandler={openModalHandler}
        preview={src}
        imageName={imageName}
      />
    </>
  );
};

export default ImageContainer;
