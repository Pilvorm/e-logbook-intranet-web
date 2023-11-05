import { Fragment, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Input, CustomInput } from 'reactstrap'
import { Container, Row, Col } from 'reactstrap';
import { Edit } from 'react-feather';

const ModalAddPhoto = ({isOpen, setIsOpen, onSubmit}) => {
    const [fileUpload, setFileUpload] = useState(null);
    const [description, setDescription] = useState(null);
    console.log(description, 'description');

  return (
    <Modal centered isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <ModalHeader className="modalHeaderTextAttachmentPopUp bg-primary" toggle={() => setIsOpen(!isOpen)}>Tambah Foto</ModalHeader>
        <ModalBody>
        <FormGroup>
            <CustomInput value={fileUpload} onChange={(a) => {
                setFileUpload(a.target.value);
            }} type='file' id='attachmentFileUpload' name='uploadedFile' />
        </FormGroup>
        <FormGroup>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} type='textarea' id='comment' placeholder='Description' />
        </FormGroup>
        </ModalBody>
        <ModalFooter>
        <Button color='success' onClick={() => {
            onSubmit({
                file: fileUpload,
                name: description
            })
        }}>
            Submit
        </Button>
        <Button color='danger' outline onClick={() => setIsOpen(!isOpen)}>
            Cancel
        </Button>
        </ModalFooter>
    </Modal>
  )
}
export default ModalAddPhoto
