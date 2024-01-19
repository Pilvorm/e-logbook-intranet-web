import { fetchImage } from "helpers/shared";
import { useEffect, useState } from "react";
import { Loader } from "react-feather";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function ImagePreviewModal({ isOpen, toggle, fileId }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPreviewUrl() {
      setLoading(true);
      try {
        const response = await fetchImage(fileId);
        setPreviewUrl(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPreviewUrl();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      backdrop={"static"}
      size="xl"
      centered={true}
      toggle={() => toggle()}
    >
      <ModalHeader
        className="modalHeaderTextRejectPopUp bg-primary"
        style={{ backgroundColor: "#3B85F8" }}
        toggle={() => toggle()}
      >
        Preview
      </ModalHeader>
      <ModalBody>
        <div className="w-100 d-flex justify-content-center">
          {loading ? (
            <Loader size={42} height={450} />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "600px" }}
            >
              <img
                alt="image"
                src={previewUrl}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" outline onClick={() => toggle()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
