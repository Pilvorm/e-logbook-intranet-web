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
import moment from "moment";
const DataOrangTua = ({
  namaAyah,
  tanggalLahirAyah,
  pendidikanAkhir1,
  namaPerusahaan1,
  namaIbu,
  tanggalLahirIbu,
  pendidikanAkhir2,
  namaPerusahaan2,
}) => (
  <div className="row">
    <div className="col-sm ml-5">
      <div className=" d-flex flex-column mt-0 ml-5">
        <p>Nama Ayah</p>
        <h5 className="font-weight-bold">
          <strong>{namaAyah}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-2 ml-5">
        <p>Pendidikan Akhir</p>
        <h5 className="font-weight-bold">
          <strong>{pendidikanAkhir1}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-3 ml-5">
        <p>Nama Ibu</p>
        <h5 className="font-weight-bold">
          <strong>{namaIbu}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-2 ml-5">
        <p>Pendidikan Akhir</p>
        <h5 className="font-weight-bold">
          <strong>{pendidikanAkhir2}</strong>
        </h5>
      </div>
    </div>

    <div className="col-sm">
      <div className=" d-flex flex-column mt-0">
        <p>Tanggal Lahir Ayah</p>
        <h5 className="font-weight-bold">
          <strong>{tanggalLahirAyah}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-2">
        <p>Nama Perusahaan</p>
        <h5 className="font-weight-bold">
          <strong>{namaPerusahaan1}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-3">
        <p>Tanggal Lahir Ibu</p>
        <h5 className="font-weight-bold">
          <strong>{tanggalLahirIbu}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column my-2">
        <p>Nama Perusahaan</p>
        <h5 className="font-weight-bold">
          <strong>{namaPerusahaan2}</strong>
        </h5>
      </div>
    </div>
  </div>
);
const DataSaudara = ({ anakKe }) => (
  <div className="row">
    <div className="col-sm ml-5">
      <div className=" d-flex flex-column mt-0 ml-5 mb-1">
        <p>Anak Ke- dari Berapa bersaudara</p>
        <h5 className="font-weight-bold">
          <strong>{anakKe}</strong>
        </h5>
      </div>
    </div>
  </div>
);
const DataPernikahan = ({
  namaSuamiIstri,
  namaPerusahaan,
  namaAnak,
  tanggalLahirAnak,
}) => (
  <div className="row">
    <div className="col-sm ml-5">
      <div className=" d-flex flex-column mt-0 ml-5">
        <p>Nama Suami/Istri</p>
        <h5 className="font-weight-bold">
          <strong>{namaSuamiIstri}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-2 ml-5">
        <p>Nama Anak</p>
        <h5 className="font-weight-bold">
          <strong>{namaAnak}</strong>
        </h5>
      </div>
    </div>

    <div className="col-sm">
      <div className=" d-flex flex-column mt-0">
        <p>Nama Perusahaan</p>
        <h5 className="font-weight-bold">
          <strong>{namaPerusahaan}</strong>
        </h5>
      </div>
      <div className=" d-flex flex-column mt-2">
        <p>Tanggal Lahir Anak</p>
        <h5 className="font-weight-bold">
          <strong>{tanggalLahirAnak}</strong>
        </h5>
      </div>
    </div>
  </div>
);

const FamilyRelationPopup = ({
  visible,
  toggle,
  parentData,
  familyData,
  marriedData,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Modal isOpen={visible} className="modal-lg" toggle={toggle}>
      <ModalHeader className="text-secondary bg-light" toggle={toggle}>
        <div className="d-flex mt-2">
          <Users />
          <h3 className="ml-1">
            <strong>Family Relation</strong>
          </h3>
        </div>
      </ModalHeader>

      <>
        <ModalBody>
          <h4 class="mx-3 mt-2">Data Orang Tua</h4>
          <hr class="mx-2" />
          <div>
            <DataOrangTua
              namaAyah={parentData?.fatherName ?? ""}
              tanggalLahirAyah={moment(parentData?.fatherBirth).format(
                "DD MMM YYYY"
              )}
              pendidikanAkhir1={parentData?.fatherEducation ?? ""}
              namaPerusahaan1=" PT Kalbe Farma"
              namaIbu={parentData?.motherName ?? ""}
              tanggalLahirIbu={moment(parentData?.motherBirth).format(
                "DD MMM YYYY"
              )}
              pendidikanAkhir2={parentData?.motherEducation ?? ""}
              namaPerusahaan2="PT Kalbe Farma"
            />
          </div>
          <h4 class="mx-3 mt-2">Data Saudara</h4>
          <hr class="mx-2" />
          <DataSaudara anakKe="1 dari 3" />
          <Table responsive className="border">
            <thead>
              <tr>
                <th className="text-center align-middle">NO</th>
                {/* <th className="text-center align-middle">HUBUNGAN</th> */}
                <th className="text-center align-middle">NAMA SAUDARA</th>
                <th className="text-center align-middle">
                  TGL LAHIR <br></br>SAUDARA
                </th>
                <th className="text-center align-middle">
                  NAMA <br></br>PERUSAHAAN
                </th>
              </tr>
            </thead>
            <tbody>
              {familyData &&
                familyData?.brotherDatas?.length > 0 &&
                familyData?.brotherDatas.map((data, index) => {
                  return (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      {/* <td className="text-center">Adik ke - 1</td> */}
                      <td className="text-center">{data?.name}</td>
                      <td className="text-center">
                        {moment(data?.birthDate).format("DD MMM YYYY")}
                      </td>
                      <td className="text-center">{data?.company}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          {marriedData && marriedData.length > 0 && (
            <>
              <h4 class="mx-3 mt-2">Data Pernikahan</h4>
              <hr class="mx-2" />
              <DataPernikahan
                namaSuamiIstri={marriedData?.name ?? ""}
                namaAnak="Josh Walse"
                namaPerusahaan={marriedData?.company ?? ""}
                tanggalLahirAnak="20 Feb 2015"
              />
            </>
          )}
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

export default FamilyRelationPopup;
