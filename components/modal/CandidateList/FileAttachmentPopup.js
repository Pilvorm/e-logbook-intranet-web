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
import { Users, FileText, Download } from "react-feather";
import { createMasterCity, editMasterCity } from "redux/actions/master/city";
import * as yup from "yup";

const FileAttachmentPopup = ({ visible, toggle, data }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const getUrlDownload = (id) => {
    return `${process.env.NEXT_PUBLIC_API_FILES}/api/Files/${id}/download`;
  };

  const FileAttachmentDetail = ({ title, data }) => (
    <div className="row">
      <div className="col-sm">
        <div className=" d-flex flex-column">
          <h6 className="font-weight-bold">
            <strong>{title}</strong>
          </h6>
          <p>{data}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={visible} className="modal-lg" toggle={toggle}>
      <ModalHeader className="text-secondary bg-light" toggle={toggle}>
        <div className="d-flex mt-2">
          <h3 className="ml-1">
            <strong>File Attachments</strong>
          </h3>
        </div>
      </ModalHeader>

      <>
        <ModalBody>
          <Table responsive className="border">
            <thead>
              <tr>
                <th className="text-left">NO</th>
                <th className="text-left">ATTACHMENT NAME</th>
                <th className="text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="KTP"
                          data={data?.ktpName ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.ktpId && (
                    <a href={getUrlDownload(data?.ktpId ?? 0)} download>
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="IJAZAH"
                          data={data?.ijazahName ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.ijazahId && (
                    <a href={getUrlDownload(data?.ijazahId ?? 0)} download>
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="TRANSKRIP / SKHUN"
                          //   data="Transkrip Nilai"
                          data={data?.transkipName ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.transkipId && (
                    <a href={getUrlDownload(data?.transkipId ?? 0)} download>
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="CV"
                          //   data="Curriculum Vitae"
                          data={data?.curriculumVitaeName ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.curriculumVitaeId && (
                    <a
                      href={getUrlDownload(data?.curriculumVitaeId ?? 0)}
                      download
                    >
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="KK"
                          //   data="Kartu Keluarga"
                          data={data?.kartuKeluargaName ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.kartuKeluargaId && (
                    <a
                      href={getUrlDownload(data?.kartuKeluargaId ?? 0)}
                      download
                    >
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="Paklaring"
                          //   data="Surat Pengalaman Kerja"
                          data={data?.paklaringName ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.paklaringId && (
                    <a href={getUrlDownload(data?.paklaringId ?? 0)} download>
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="SKHUN"
                          //   data="Surat Keterangan Catatan Kepolisian"
                          data={data?.skhunName ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.skhunId && (
                    <a href={getUrlDownload(data?.skhunId ?? 0)} download>
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>8</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="Sertifikat Vaksin 1"
                          //   data="Surat Keterangan Vaksin"
                          data={data?.sertifikatVaksin1Name ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.sertifikatVaksin1 && (
                    <a
                      href={getUrlDownload(data?.sertifikatVaksin1 ?? 0)}
                      download
                    >
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>9</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="Sertifikat Vaksin 2"
                          //   data="Surat Keterangan Vaksin"
                          data={data?.sertifikatVaksin2Name ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.sertifikatVaksin2 && (
                    <a
                      href={getUrlDownload(data?.sertifikatVaksin2 ?? 0)}
                      download
                    >
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>10</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="Sertifikat Vaksin 3"
                          //   data="Surat Keterangan Vaksin"
                          data={data?.sertifikatVaksin3Name ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.sertifikatVaksin3 && (
                    <a
                      href={getUrlDownload(data?.sertifikatVaksin3 ?? 0)}
                      download
                    >
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>11</td>
                <td>
                  <div className="row">
                    <div className="d-flex flex-column justify-content-center">
                      <FileText />
                    </div>
                    <div className="col-sm mt-1">
                      <div className="d-flex flex-column ">
                        <FileAttachmentDetail
                          title="Sertifikat Vaksin 4"
                          //   data="Surat Keterangan Vaksin"
                          data={data?.sertifikatVaksin4Name ?? ""}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {data.sertifikatVaksin4 && (
                    <a
                      href={getUrlDownload(data?.sertifikatVaksin4 ?? 0)}
                      download
                    >
                      <Download />
                    </a>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
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

export default FileAttachmentPopup;
