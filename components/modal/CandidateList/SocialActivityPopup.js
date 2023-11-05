import { HTTP_CODE } from "constant";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "reactstrap";
import { Users } from "react-feather";
import { createMasterCity, editMasterCity } from "redux/actions/master/city";
import * as yup from "yup";
const SocialActivityDetail = ({
  anggotaDewan,
  namaOrganisasi,
  kota,
  jabatan,
  tahun,
  kegiatan,
  suratKabar,
  topik,
  bakat,
}) => (
  <div className="row">
    <div className="col-sm">
      {/* <div className=" d-flex flex-column mt-2 ml-5">
        <p>Apakah menjadi anggota dewan dalam sebuah organisasi/lembaga?</p>
        <h5 className="font-weight-bold">
          <strong>Ya</strong>
        </h5>
      </div> */}
      <div className=" d-flex flex-column mt-2 ml-5">
        <p>Nama Organisasi</p>
        <h5 className="font-weight-bold">
          <strong>{namaOrganisasi}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-2 ml-5">
        <p>Kota</p>
        <h5 className="font-weight-bold">
          <strong>{kota}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-2 ml-5">
        <p>Jabatan</p>
        <h5 className="font-weight-bold">
          <strong>{jabatan}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-2 ml-5">
        <p>Tahun Mulai - Selesai</p>
        <h5 className="font-weight-bold">
          <strong>{tahun}</strong>
        </h5>
      </div>
    </div>

    <div className="col-sm">
      <div className=" d-flex flex-column mt-2">
        <p>Kegiatan pada waktu luang</p>
        <h5 className="font-weight-bold">
          <strong>{kegiatan}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-3">
        <p>Surat Kabar & Majalah yang sering dibaca</p>
        <h5 className="font-weight-bold">
          <strong>{suratKabar}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-2">
        <p>Topik yang diminati untuk dibaca</p>
        <h5 className="font-weight-bold">
          <strong>{topik}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column my-2">
        <p>Bakat yang dimiliki</p>
        <h5 className="font-weight-bold">
          <strong>{bakat}</strong>
        </h5>
      </div>
    </div>
  </div>
);

const SocialActivityPopup = ({ visible, toggle, data }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Modal isOpen={visible} className="modal-lg" toggle={toggle}>
      <ModalHeader className="text-secondary bg-light" toggle={toggle}>
        <div className="d-flex mt-2 mx-1">
          <Users />
          <h3 className="ml-1">
            <strong>Social Activity & Others</strong>
          </h3>
        </div>
      </ModalHeader>

      <>
        <ModalBody>
          <div>
            <SocialActivityDetail
              anggotaDewan="Ya"
              namaOrganisasi={data?.name ?? ""}
              kota={data?.cityName ?? ""}
              jabatan={data?.jabatan ?? ""}
              tahun={`${data?.yearStart ?? ""} - ${data?.yearEnd ?? ""}`}
              kegiatan={data?.activity ?? ""}
              suratKabar={data?.newsPaperName ?? ""}
              topik={data?.topicRead ?? ""}
              bakat={data?.skill ?? ""}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </>
    </Modal>
  );
};

export default SocialActivityPopup;
