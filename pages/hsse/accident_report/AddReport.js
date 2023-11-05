import { ComboAlert } from "components/Alert";
import BreadCrumbs from "components/custom/BreadcrumbCustom";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  Eye,
  MoreVertical,
  Plus,
  Save,
  Trash,
} from "react-feather";
import {
  Button,
  Card,
  Col,
  Container,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import VerticalLayout from "src/@core/layouts/VerticalLayout";

import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotificationWithFunction,
} from "components/notification";

import FormikDatePicker from "components/CustomInputs/CustomDatePicker";
import FormikInput from "components/CustomInputs/CustomInput";
import CustomRadio from "components/CustomInputs/CustomRadio";
import { FieldArray, Formik } from "formik";
import { getAsyncOptionsUser } from "helpers/master/masterRole";
import { getAsyncOptionsSBU } from "helpers/sbu";
import debounce from "lodash/debounce";
import { useDispatch } from "react-redux";
import AsyncSelect from "react-select/async";
import { reauthenticate } from "redux/actions/auth";
import {
  saveKecelakaanKerja,
  submitKecelakaanKerja,
} from "redux/actions/kecelakaanKerja";
import { getSbuAsyncSelect } from "redux/actions/master/user";
import { wrapper } from "redux/store";

import Checkboxes from "components/kecelakaanKerja/Checkboxes";
import FileUploadModal from "components/kecelakaanKerja/FileUploadModal";
import SupervisorSelect from "components/kecelakaanKerja/SupervisorSelect";
import ModalDataKaryawan from "components/online_form/ModalDataKaryawan";
import ModalDataNonKaryawan from "components/online_form/ModalDataNonKaryawan";
import { Play } from "react-feather";
import { getAllBagianTubuhYangTerluka } from "redux/actions/master/bagianTubuhYangTerluka";
import { getAllFaktorPekerjaanLingkunganKerja } from "redux/actions/master/faktorPekerjaanLingkunganKerja";
import { getAllKondisiTidakAmanPenyebabKecelakaan } from "redux/actions/master/kondisiTidakAmanPenyebabKecelakaan";
import { getAllTindakaTidakAmanPenyebabKecelakaan } from "redux/actions/master/tindakanTidakAmanPenyebabKecelakaan";
import KaryawanTable from "components/kecelakaanKerja/KaryawanTable";
import NonKaryawanTable from "components/kecelakaanKerja/NonKaryawanTable";
import CorrectiveAction from "components/kecelakaanKerja/CorrectiveAction";
import PreventiveAction from "components/kecelakaanKerja/PreventiveAction";

const ACCIDENT_CATEGORY_KEYS = {
  TIDAK_CEDERA: "Tidak cedera",
  CEDERA_SEDANG: "Cedera sedang",
  CEDERA_BERAT: "Cedera berat",
  MENINGGAL: "Meninggal Dunia / Fatality",
};

const ACCIDENT_CATEGORY_OPTIONS = [
  { value: ACCIDENT_CATEGORY_KEYS.TIDAK_CEDERA, label: "Tidak cedera" },
  { value: ACCIDENT_CATEGORY_KEYS.CEDERA_SEDANG, label: "Cedera sedang" },
  { value: ACCIDENT_CATEGORY_KEYS.CEDERA_BERAT, label: "Cedera berat" },
  {
    value: ACCIDENT_CATEGORY_KEYS.MENINGGAL,
    label: "Meninggal Dunia / Fatality",
  },
];

const CEDERA_SEDANG_CHECKBOXES = [
  { name: "Patah tulang/retak" },
  { name: "Luka robek / tersayat dalam / tertusuk dalam" },
  { name: "Luka bakar / iritasi kimia" },
  { name: "Luka iritasi - kemasukan benda asing (mata)" },
  { name: "Terkilir / nyeri otot" },
  { name: "Gegar otak" },
  { name: "Luka bakar - api/panas" },
  { name: "Sesak nafas / gangguan pernafasan" },
  { name: "Cedera lain dengan perawatan medis" },
];

const CEDERA_BERAT_CHECKBOXES = [
  { name: "Amputasi / Cacat Permanen" },
  { name: "Keracunan" },
  { name: "Kanker / Penyebab penyakit berbahaya lain" },
];

const incidentType = [
  { value: "Kecelakaan", label: "Kecelakaan" },
  { value: "Penyakit Akibat Kerja", label: "Penyakit Akibat Kerja" },
];

const goBackToWork = [
  { value: "Ya", label: "Ya" },
  { value: "Tidak", label: "Tidak" },
];

const insidenSerupa = [
  { value: "Ya", label: "Ya" },
  { value: "Tidak", label: "Tidak" },
];

const rekomendasiTindakanPencegahan = [
  { value: "Ya", label: "Ya" },
  { value: "Tidak", label: "Tidak" },
];

const dataFaktorManusiaPersonil = [
  {
    id: 1,
    label: "Kurang kemampuan fisik, mental, dan psikologi",
  },
  {
    id: 2,
    label: "Kurang/lemahnya pengetahuan dan skill",
  },
  {
    id: 3,
    label: "Stres",
  },
  {
    id: 4,
    label: "Motivasi yang keliru/salah penempatan",
  },
  {
    id: 5,
    label: "Konflik",
  },
  {
    id: 6,
    label: "Kurang memperhatikan",
  },
  {
    id: 7,
    label: "Mengambil resiko yang tidak tepat",
  },
  {
    id: 8,
    label: "Kurang teliti",
  },
  {
    id: 9,
    label: "Faktor manusia/personil lainnya",
  },
  {
    id: 10,
    label: "Lainnya",
  },
];

const AccidentReport = (props) => {
  const {
    dataSBU,
    dataUser,
    token,
    dataBagianTubuhYangTerluka,
    dataKondisiTidakAmanPenyebabKecelakaan,
    dataTindakanTidakAmanPenyebabKecelakaan,
    dataFaktorPekerjaanLingkunganKerja,
    sessionData,
  } = props;

  const [visibleModalKaryawan, setVisibleModalKaryawan] = useState(false);
  const toggleModalKaryawan = () =>
    setVisibleModalKaryawan(!visibleModalKaryawan);

  const [visibleModalNonKaryawan, setVisibleModalNonKaryawan] = useState(false);
  const toggleModalNonKaryawan = () =>
    setVisibleModalNonKaryawan(!visibleModalNonKaryawan);

  const [active, setActive] = useState("1");
  const toggle = (key) => setActive(key);
  const [isActionBtnLoading, setIsActionBtnLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const [showModalLampiran, setShowModalLampiran] = useState(false);

  // Combo alert states
  const [isAlertModal, setIsAlertModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, [dispatch]);

  useEffect(() => {
    if (!dataSBU.find((data) => data.label === "All")) {
      dataSBU.unshift({ value: "", label: "All" });
    }
  }, []);

  const loadOptionsSBU = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsSBU(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const transformAndValidation = (values) => {
    const data = {
      creator: sessionData.user.UserPrincipalName || "System",
      site: values.site,
      companyCode: values.companyCode,
      kondisiAtauPerilakuTidakAman: "-",
      aktivitasKorban: values.aktivitasKorban,
      emailCreator: sessionData.user.UserPrincipalName,
      jenisInsiden: values.jenisInsiden,
      tanggalKecelakaan: values.tanggalKecelakaan,
      insidenYangDialami: values.insidenYangDialami,
      lokasiKecelakaan: values.lokasiKecelakaan,
      dataKorbanKaryawan: values.dataKorbanKaryawan,
      dataKorbanNonKaryawan: values.dataKorbanNonKaryawan,
      bagianTubuhYangTerluka: values.bagianTubuhYangTerluka,
      kondisiPenyebabKecelakaan: values.kondisiTidakAmanPenyebabKecelakaan,
      tindakanPenyebabKecelakaan: values.tindakanTidakAmanPenyebabKecelakaan,
      faktorManusia: values.faktorManusia,
      faktorLingkungan: values.faktorPekerjaanLingkunganKerja,
      dataKorbanKaryawan: values.dataKorbanKaryawan,
      dataKorbanNonKaryawan: values.dataKorbanNonKaryawan,
      lampiran: values.dataLampiran,
      correctiveAction: values.correctiveAction,
      preventiveAction: values.preventiveAction,
      kategoriCedera: values.kategoriCedera,
      pertolonganPertama: values.pertolonganPertama,
      perawatanLanjutan: values.perawatanLanjutan,
      tglKembaliBekerja: values.tglKembaliBekerja,
      kerusakanProperti: values.kerusakanProperti,
      biayaPerbaikan: values.biayaPerbaikan,
      spvKorban: values.supervisorName,
      namaSaksi: values.namaSaksi,
      kembaliBekerjaLangsung:
        values.kembaliBekerjaLangsung === "Ya" ? true : false,
      pernahTerjadiInsidenSerupa:
        values.pernahTerjadiInsidenSerupa === "Ya" ? true : false,
      rekomendasiTindakanPencegahan:
        values.rekomendasiTindakanPencegahan === "Ya" ? true : false,
    };
    return data;
  };

  const onSaveHandler = async (data) => {
    const saveData = {
      ...data,
      status: "DRAFT",
    };

    confirmAlertNotification(
      "Confirmation",
      `Apakah Anda yakin ingin menyimpan data ini?`,
      () => {
        setIsActionBtnLoading(true);
        dispatch(saveKecelakaanKerja(saveData))
          .then((res) => {
            successAlertNotificationWithFunction(
              "Sukses",
              "Data berhasil disimpan",
              () => {
                router.push(`/hsse/accident_report`);
              }
            );
          })
          .catch((res) => {
            console.error(res, "ERROR onSaveHandler");
            let errorMessages = [];
            if (res.response.status === 401) {
              return errorAlertNotification("Error", res.response.data.message);
            }

            if (res.response.status === 409) {
              return errorAlertNotification(
                "Error Duplicate",
                "Duplicate Data"
              );
            }

            try {
              errorMessages = Object.entries(res.response.data.errors).flatMap(
                ([field, messages]) => {
                  return messages.map((message) => ({ field, message }));
                }
              );
            } catch (error) {
              // Handle the error appropriately
              console.log(error);
              errorMessages = [
                {
                  field: "Error",
                  message: res.data
                    ? res.data
                    : "Data gagal disimpan. Silahkan dicoba beberapa saat lagi",
                },
              ];
            }

            const title = "Error";
            const message =
              errorMessages.length > 0
                ? errorMessages
                    .map(({ field, message }) => `${field}: ${message}`)
                    .join("\n")
                : "";

            errorAlertNotification(title, message);
          })
          .finally(() => {
            setIsActionBtnLoading(false);
          });
      },
      () => {}
    );
  };

  const onSubmitHandler = async (data) => {
    const submitData = {
      ...data,
      status: "string",
    };

    let role = "";
    const compId = sessionData?.user?.CompCode;
    const upn = sessionData?.user?.UserPrincipalName;
    const name = sessionData?.user?.Name;
    const email = sessionData?.user?.Email;
    try {
      role = JSON.parse(localStorage.getItem("userRoles"))[0];
      console.log(role, "ROLE");
    } catch (e) {
      console.error(e);
      role = "";
    }

    confirmAlertNotification(
      "Confirmation",
      `Apakah Anda yakin ingin submit data ini?`,
      () => {
        setIsActionBtnLoading(true);
        dispatch(
          submitKecelakaanKerja(compId, role, upn, name, email, submitData)
        )
          .then((res) => {
            successAlertNotificationWithFunction(
              "Sukses",
              "Data berhasil disubmit",
              () => {
                router.push(`/hsse/accident_report`);
              }
            );
          })
          .catch((res) => {
            console.error(res, "ERROR onSubmitHandler");
            let errorMessages = [];
            if (res.response.status === 401) {
              return errorAlertNotification("Error", res.response.data.message);
            }

            if (res.response.status === 409) {
              return errorAlertNotification(
                "Error Duplicate",
                "Duplicate Data"
              );
            }

            try {
              errorMessages = Object.entries(res.response.data.errors).flatMap(
                ([field, messages]) => {
                  return messages.map((message) => ({ field, message }));
                }
              );
            } catch (error) {
              // Handle the error appropriately
              console.log(error);
              errorMessages = [
                {
                  field: "Error",
                  message: res.data
                    ? res.data
                    : "Data gagal disubmit. Silahkan dicoba beberapa saat lagi",
                },
              ];
            }

            const title = "Error";
            const message =
              errorMessages.length > 0
                ? errorMessages
                    .map(({ field, message }) => `${field}: ${message}`)
                    .join("\n")
                : "";

            errorAlertNotification(title, message);
          })
          .finally(() => {
            setIsActionBtnLoading(false);
          });
      },
      () => {}
    );
  };

  return (
    <div className="min-vh-100">
      <BreadCrumbs
        breadCrumbParent="Online Form"
        breadCrumbParent2="Laporan Kecelakaan Kerja"
        breadCrumbActive="Detail"
      />
      <div className="d-flex align-items-center my-3">
        <h2>Add Form</h2>
      </div>

      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
            className={`${active === "1" ? "text-dark" : "text-muted"}`}
          >
            Data
          </NavLink>
        </NavItem>
      </Nav>

      <Card>
        <div className="px-2 py-2 mb-2">
          <TabContent className="ml-1 py-50" activeTab={active}>
            <TabPane tabId="1">
              <Formik
                initialValues={{
                  site: "",
                  companyCode: "",
                  aktivitasKorban: "",
                  jenisInsiden: "",
                  tanggalKecelakaan: new Date(),
                  insidenYangDialami: "",
                  lokasiKecelakaan: "",
                  dataKorbanKaryawan: [],
                  dataKorbanNonKaryawan: [],
                  bagianTubuhYangTerluka: [],
                  perilakuKondisiBerisiko: [],
                  kondisiTidakAmanPenyebabKecelakaan: [],
                  tindakanTidakAmanPenyebabKecelakaan: [],
                  dataLampiran: [],
                  faktorPekerjaanLingkunganKerja: [],
                  faktorManusia: [],
                  correctiveAction: [],
                  preventiveAction: [],
                  supervisorName: "",
                  tglKembaliBekerja: new Date(),
                  kembaliBekerjaLangsung: "",
                  pernahTerjadiInsidenSerupa: "",
                  rekomendasiTindakanPencegahan: "",
                }}
              >
                {(formik) => (
                  <>
                    {/* ACTIONS */}
                    <div className="d-flex justify-content-between align-items-center w-100 flex-wrap">
                      <div
                        className="d-flex flex-wrap"
                        style={{
                          gap: 20,
                          width: "70%",
                          paddingTop: "1rem",
                          paddingLeft: "2rem",
                        }}
                      >
                        <Button.Ripple
                          outline
                          type="submit"
                          color="danger"
                          className="btn-next"
                          onClick={() => router.back()}
                        >
                          <ArrowLeft size={18} />
                          <span className="ml-50 align-middle d-sm-inline-block d-none">
                            Back
                          </span>
                        </Button.Ripple>

                        {!isActionBtnLoading ? (
                          <>
                            <Button.Ripple
                              id="saveBtn"
                              color="primary"
                              onClick={() => {
                                onSaveHandler(
                                  transformAndValidation(formik.values)
                                );
                              }}
                            >
                              <Save size={18} />
                              <span className="align-middle ml-1 d-sm-inline-block d-none">
                                Save
                              </span>
                            </Button.Ripple>

                            <Button.Ripple
                              id="submitBtn"
                              color="primary"
                              onClick={() => {
                                onSubmitHandler(
                                  transformAndValidation(formik.values)
                                );
                              }}
                            >
                              <div
                                className="d-flex"
                                style={{ alignItems: "center" }}
                              >
                                <Play size={18} />
                                <div className="ml-1">Submit</div>
                              </div>
                            </Button.Ripple>
                          </>
                        ) : (
                          <Button.Ripple color="primary" disabled={true}>
                            <>
                              <Spinner size="sm" color="white" />
                              <span className="ml-50">Submitting...</span>
                            </>
                          </Button.Ripple>
                        )}
                      </div>

                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          backgroundColor: "rgba(255, 184, 76, 0.12)",
                          color: "#FFB84C",
                          height: 40,
                          borderRadius: 10,
                          minWidth: 140,
                          marginTop: "1rem",
                          marginRight: "2rem",
                          fontSize: "1rem",
                          fontWeight: 500,
                        }}
                      >
                        Draft
                      </div>
                    </div>

                    <Container>
                      <Row className="mt-3">
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <Label className="form-label font-weight-bold">
                              Nomor Dokumen
                            </Label>
                            <Input
                              id="userUPN"
                              type="text"
                              placeholder="Document Number"
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <Label className="form-label font-weight-bold">
                              Creator
                            </Label>
                            <Input
                              type="text"
                              placeholder="Creator"
                              defaultValue={
                                sessionData.user.UserPrincipalName || "System"
                              }
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <Label className="form-label font-weight-bold">
                              Company
                            </Label>
                            <AsyncSelect
                              id="company"
                              name="companyCode"
                              classNamePrefix="select"
                              cacheOptions
                              defaultOptions={dataSBU}
                              loadOptions={loadOptionsSBU}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "companyCode",
                                  e.idmCompCode
                                );
                                formik.setFieldValue("site", e.label);
                              }}
                            />
                          </FormGroup>
                          <FormGroup tag={Col} md="12">
                            <CustomRadio
                              label="Jenis Insiden"
                              name="jenisInsiden"
                              options={incidentType}
                              isRow={true}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Aktivitas / Kegiatan Korban di Lokasi"
                              name="aktivitasKorban"
                              placeholder=""
                              customInlineStyle={{
                                resize: "none",
                                height: "114px",
                              }}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikDatePicker
                              label="Tanggal Kejadian"
                              name="tanggalKecelakaan"
                            />
                          </FormGroup>
                          <FormGroup tag={Col} md="12">
                            <Label className="form-label font-weight-bold">
                              Lokasi Kecelakaan Kerja
                            </Label>
                            <Input
                              id="lokasiKecelakaan"
                              type="text"
                              placeholder=""
                              defaultValue={""}
                              onChange={formik.handleChange("lokasiKecelakaan")}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Incident yang Dialami"
                              name="insidenYangDialami"
                              placeholder=""
                              customInlineStyle={{
                                resize: "none",
                                height: "114px",
                              }}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="mt-1"></div>
                      {/*===== DATA KORBAN KARYAWAN =====*/}
                      <KaryawanTable
                        name="dataKorbanKaryawan"
                        formik={formik}
                      />

                      <div className="mt-3"></div>
                      {/*===== DATA KORBAN NON-KARYAWAN =====*/}
                      <NonKaryawanTable
                        name="dataKorbanNonKaryawan"
                        formik={formik}
                      />

                      {/*===== BAGIAN TUBUH YANG TERLUKA =====*/}
                      <div>
                        <Row className="mx-1 mt-3">
                          <h6>
                            Bagian Tubuh yang Terluka{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h6>
                        </Row>
                        <Row className="mx-1" style={{ marginTop: "5px" }}>
                          <Checkboxes
                            name="bagianTubuhYangTerluka"
                            data={dataBagianTubuhYangTerluka}
                            formik={formik}
                            chunkSize={11}
                            getOptionFromData={(option) => ({
                              id: option.id,
                              label: option.bagianTubuhYangTerluka,
                            })}
                            pushedValue={(option) => ({
                              idMasterBagianTubuh: option.id,
                              namaBagianTubuh: option.label,
                              namaBagianTubuhLainnya: "",
                            })}
                            valueMapper={{
                              id: "idMasterBagianTubuh",
                              label: "namaBagianTubuh",
                              other: "namaBagianTubuhLainnya",
                            }}
                          />
                          <Col>
                            <FormGroup>
                              <Label className="form-label font-weight-bold">
                                Sifat dan kategori cedera
                              </Label>
                              <CustomInput
                                type="select"
                                id="accidentCategory"
                                name="accidentCategory"
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    "kategoriCedera",
                                    e.target.value
                                  );
                                }}
                              >
                                <option hidden>Pilih</option>
                                {ACCIDENT_CATEGORY_OPTIONS.map((item) => (
                                  <option key={item.value} value={item.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </CustomInput>
                            </FormGroup>

                            <div>
                              {formik.values.kategoriCedera ===
                                ACCIDENT_CATEGORY_KEYS.CEDERA_SEDANG && (
                                <>
                                  <div style={{ marginBottom: "5px" }}>
                                    Cedera Sedang
                                  </div>
                                  {CEDERA_SEDANG_CHECKBOXES.map((item, idx) => (
                                    <FormGroup key={item.name}>
                                      <CustomInput
                                        type="checkbox"
                                        id={`cedera-sedang-${idx}`}
                                        label={item.name}
                                        inline
                                      />
                                    </FormGroup>
                                  ))}
                                </>
                              )}
                              {formik.values.kategoriCedera ===
                                ACCIDENT_CATEGORY_KEYS.CEDERA_BERAT && (
                                <>
                                  <div style={{ marginBottom: "5px" }}>
                                    Cedera Berat
                                  </div>
                                  {CEDERA_BERAT_CHECKBOXES.map((item, idx) => (
                                    <FormGroup key={item.name}>
                                      <CustomInput
                                        type="checkbox"
                                        id={`cedera-berat-${idx}`}
                                        label={item.name}
                                        inline
                                      />
                                    </FormGroup>
                                  ))}
                                </>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <Row className="mt-3">
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Pertolongan pertama yang diberikan dan kapan?"
                              name="pertolonganPertama"
                              placeholder=""
                              customInlineStyle={{
                                resize: "none",
                                height: "90px",
                              }}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Perawatan lanjutan (Nama RS / klinik)"
                              name="perawatanLanjutan"
                              placeholder=""
                              customInlineStyle={{
                                resize: "none",
                                height: "90px",
                              }}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row className="mt-1">
                        <Col>
                          <FormGroup tag={Col} md="3">
                            <Label className="form-label font-weight-bold">
                              Apakah dapat langsung kembali bekerja?
                            </Label>
                            <CustomRadio
                              name="kembaliBekerjaLangsung"
                              options={goBackToWork}
                              isRow={true}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row className="mt-1">
                        <Col md="6">
                          <FormGroup tag={Col}>
                            <FormikDatePicker
                              label="Tanggal bekerja kembali dengan normal"
                              name="tglKembaliBekerja"
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Kerusakan properti lingkungan"
                              name="kerusakanProperti"
                              placeholder=""
                              customInlineStyle={{
                                resize: "none",
                                height: "90px",
                              }}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Biaya perbaikan dan penanggulangan (Real dan Estimasi)"
                              name="biayaPerbaikan"
                              placeholder=""
                              customInlineStyle={{
                                resize: "none",
                                height: "90px",
                              }}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <SupervisorSelect
                              defaultOptions={dataUser}
                              formik={formik}
                              formikFieldName="supervisorName"
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Nama-nama Saksi (Jika ada)"
                              name="namaSaksi"
                              placeholder=""
                              customInlineStyle={{
                                resize: "none",
                                height: "90px",
                              }}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/*===== LAMPIRAN =====*/}
                      <Row className="mt-3">
                        <Col md="12">
                          <div
                            className="mx-1 d-flex flex-column gap-3"
                            style={{ gap: "16px" }}
                          >
                            <h5>Lampiran</h5>
                            <FieldArray name="dataLampiran">
                              {({ push, remove }) => {
                                return (
                                  <>
                                    <div className="d-flex align-items-center">
                                      <Button.Ripple
                                        color="primary"
                                        id="buttonFilter"
                                        name="buttonFilter"
                                        className="btn-next mr-1"
                                        onClick={() =>
                                          setShowModalLampiran(true)
                                        }
                                      >
                                        <Plus size={18} />
                                        <span className="align-middle ml-1 d-sm-inline-block d-none">
                                          Lampiran
                                        </span>
                                      </Button.Ripple>
                                    </div>

                                    <Table
                                      responsive
                                      className="border"
                                      style={{}}
                                    >
                                      <thead className="text-center">
                                        <tr>
                                          <th className="text-center">
                                            Action
                                          </th>
                                          <th className="text-center">No</th>
                                          <th className="text-center">
                                            Keterangan
                                          </th>
                                          <th className="text-center">
                                            Nama File
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-center">
                                        {formik.values.dataLampiran.map(
                                          (file, index) => (
                                            <tr key={index}>
                                              <td>
                                                <UncontrolledDropdown>
                                                  <DropdownToggle
                                                    className="icon-btn hide-arrow"
                                                    id="optionsSelect"
                                                    color="transparent"
                                                    size="sm"
                                                    caret
                                                  >
                                                    <MoreVertical size={15} />
                                                  </DropdownToggle>
                                                  <DropdownMenu>
                                                    <DropdownItem
                                                      className="w-100"
                                                      onClick={() =>
                                                        remove(index)
                                                      }
                                                      id="deleteBtn"
                                                    >
                                                      <Download
                                                        className="mr-50"
                                                        size={15}
                                                      />
                                                      <span className="align-middle">
                                                        Download
                                                      </span>
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      className="w-100"
                                                      onClick={() =>
                                                        remove(index)
                                                      }
                                                      id="deleteBtn"
                                                    >
                                                      <Eye
                                                        className="mr-50"
                                                        size={15}
                                                      />
                                                      <span className="align-middle">
                                                        View
                                                      </span>
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      className="w-100"
                                                      onClick={() =>
                                                        remove(index)
                                                      }
                                                      id="deleteBtn"
                                                    >
                                                      <Trash
                                                        className="mr-50"
                                                        size={15}
                                                      />
                                                      <span className="align-middle">
                                                        Delete
                                                      </span>
                                                    </DropdownItem>
                                                  </DropdownMenu>
                                                </UncontrolledDropdown>
                                              </td>
                                              <td>{index + 1}</td>
                                              <td>{file?.keterangan}</td>
                                              <td>{file?.namaFile}</td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </Table>

                                    <FileUploadModal
                                      show={showModalLampiran}
                                      onHide={() => setShowModalLampiran(false)}
                                      onFileUpload={(
                                        idFile,
                                        notes,
                                        fileName
                                      ) => {
                                        push({
                                          idFile: idFile,
                                          keterangan: notes,
                                          namaFile: fileName,
                                        });
                                        setShowModalLampiran(false);
                                      }}
                                    />
                                  </>
                                );
                              }}
                            </FieldArray>
                          </div>
                        </Col>

                        <Table
                          responsive
                          bordered
                          className="border mt-2"
                        ></Table>
                      </Row>

                      {/*===== KONDISI TIDAK AMAN PENYEBAB KECELAKAAN =====*/}
                      <div>
                        <Row className="mx-1 mt-3">
                          <h6>
                            Kondisi Tidak Aman Penyebab Kecelakaan{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h6>
                        </Row>
                        <Row className="mx-1" style={{ marginTop: "5px" }}>
                          <Checkboxes
                            name="kondisiTidakAmanPenyebabKecelakaan"
                            data={dataKondisiTidakAmanPenyebabKecelakaan}
                            chunkSize={15}
                            formik={formik}
                            getOptionFromData={(option) => ({
                              id: option.id,
                              label: option.kondisiTidakAmanPenyebabKecelakaan,
                            })}
                            pushedValue={(option) => ({
                              idMasterKondisi: option.id,
                              namaKondisi: option.label,
                              namaKondisiLainnya: "",
                            })}
                            valueMapper={{
                              id: "idMasterKondisi",
                              label: "namaKondisi",
                              other: "namaKondisiLainnya",
                            }}
                          />
                        </Row>
                      </div>

                      {/*===== TINDAKAN TIDAK AMAN PENYEBAB KECELAKAAN =====*/}
                      <div>
                        <Row className="mx-1 mt-3">
                          <h6>
                            Tindakan Tidak Aman Penyebab Kecelakaan{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h6>
                        </Row>
                        <Row className="mx-1" style={{ marginTop: "5px" }}>
                          <Checkboxes
                            name="tindakanTidakAmanPenyebabKecelakaan"
                            data={dataTindakanTidakAmanPenyebabKecelakaan}
                            chunkSize={15}
                            formik={formik}
                            getOptionFromData={(option) => ({
                              id: option.id,
                              label: option.tindakanTidakAmanPenyebabKecelakaan,
                            })}
                            pushedValue={(option) => ({
                              idMasterTindakan: option.id,
                              namaTindakan: option.label,
                              namaTindakanLainnya: "",
                            })}
                            valueMapper={{
                              id: "idMasterTindakan",
                              label: "namaTindakan",
                              other: "namaTindakanLainnya",
                            }}
                          />
                        </Row>
                      </div>

                      {/*===== ALASAN KONDISI PERILAKU TIDAK AMAN =====*/}
                      <div>
                        <Row className="ml-1 mt-3">
                          <h6>
                            Mengapa terdapat kondisi / tindakan tidak aman?{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h6>
                        </Row>
                        <Col md="6" className="p-0">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              //label="alasan adanya kondisi/perilaku tidak aman"
                              name="alasanKondisiPerilakuTidakAman"
                              placeholder=""
                              customInlineStyle={{
                                resize: "none",
                                height: "90px",
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </div>

                      {/*===== FAKTOR MANUSIA/PERSONIL =====*/}
                      <div>
                        <Row className="ml-1 mt-3">
                          <h6>
                            Faktor Manusia/Personil{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h6>
                        </Row>
                        <Row className="mx-1" style={{ marginTop: "5px" }}>
                          <Checkboxes
                            name="faktorManusia"
                            data={dataFaktorManusiaPersonil}
                            chunkSize={15}
                            formik={formik}
                            getOptionFromData={(option) => ({
                              id: option.id,
                              label: option.label,
                            })}
                            pushedValue={(option) => ({
                              idMasterFaktorManusia: option.id,
                              namaFaktorManusia: option.label,
                              namaFaktorManusiaLainnya: "",
                            })}
                            valueMapper={{
                              id: "idMasterFaktorManusia",
                              label: "namaFaktorManusia",
                              other: "namaFaktorManusiaLainnya",
                            }}
                          />

                          <Col>
                            <FormGroup tag={Col} md="6">
                              <h6 className="form-label font-weight-bold">
                                Apakah pernah ada insiden serupa sebelum ini?
                              </h6>
                              <CustomRadio
                                name="pernahTerjadiInsidenSerupa"
                                options={insidenSerupa}
                                isRow={true}
                              />
                              {formik.errors.userPrincipalName && (
                                <div className="text-danger">
                                  {formik.errors.userPrincipalName}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>

                      {/*===== FAKTOR PEKERJAAN/LINGKUNGAN KERJA =====*/}
                      <div>
                        <Row className="mx-1 mt-3">
                          <h6>
                            Faktor Pekerjaan/Lingkungan Kerja{" "}
                            <span style={{ color: "red" }}>*</span>
                          </h6>
                        </Row>
                        <Row className="mx-1" style={{ marginTop: "5px" }}>
                          <Checkboxes
                            name="faktorPekerjaanLingkunganKerja"
                            data={dataFaktorPekerjaanLingkunganKerja}
                            chunkSize={15}
                            formik={formik}
                            getOptionFromData={(option) => ({
                              id: option.id,
                              label: option.faktorPekerjaanLingkunganKerja,
                            })}
                            pushedValue={(option) => ({
                              idMasterFaktorLingkungan: option.id,
                              namaFaktorLingkungan: option.label,
                              namaFaktorLingkunganLainnya: "",
                            })}
                            valueMapper={{
                              id: "idMasterFaktorLingkungan",
                              label: "namaFaktorLingkungan",
                              other: "namaFaktorLingkunganLainnya",
                            }}
                          />
                          <Col>
                            <FormGroup tag={Col} md="6">
                              <h6 className="form-label font-weight-bold">
                                Rekomendasi tindakan koreksi dan pencegahan?
                                Analisa resiko?
                              </h6>
                              <CustomRadio
                                name="rekomendasiTindakanPencegahan"
                                options={rekomendasiTindakanPencegahan}
                                isRow={true}
                              />
                              {formik.errors.userPrincipalName && (
                                <div className="text-danger">
                                  {formik.errors.userPrincipalName}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>

                      {/*===== CORRECTIVE ACTION =====*/}
                      <div className="ml-1 mt-3">
                        <h5 className="mb-1">Corrective Action</h5>
                        <CorrectiveAction
                          name="correctiveAction"
                          formik={formik}
                        />
                      </div>

                      {/*===== PREVENTIVE ACTION =====*/}
                      <div className="ml-1 mt-3">
                        <h5 className="mb-1">Preventive Action</h5>
                        <PreventiveAction
                          name="preventiveAction"
                          formik={formik}
                        />
                      </div>
                    </Container>
                  </>
                )}
              </Formik>
              <ComboAlert
                routerPath="/master/user"
                {...{
                  isAlertModal,
                  setIsAlertModal,
                  alertStatus,
                  alertMessage,
                }}
              />
            </TabPane>
          </TabContent>
        </div>
      </Card>
    </div>
  );
};

AccidentReport.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

//Render Data
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query } = ctx;
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: `/auth?url=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    const token = sessionData.user.token;
    store.dispatch(reauthenticate(token));

    const dataSBU = await store.dispatch(getSbuAsyncSelect());
    const dataUser = await getAsyncOptionsUser("");

    const dataBagianTubuhYangTerluka = await store.dispatch(
      getAllBagianTubuhYangTerluka()
    );

    const dataKondisiTidakAmanPenyebabKecelakaan = await store.dispatch(
      getAllKondisiTidakAmanPenyebabKecelakaan()
    );

    const dataTindakanTidakAmanPenyebabKecelakaan = await store.dispatch(
      getAllTindakaTidakAmanPenyebabKecelakaan()
    );

    const dataFaktorPekerjaanLingkunganKerja = await store.dispatch(
      getAllFaktorPekerjaanLingkunganKerja()
    );

    return {
      props: {
        token: sessionData.user.token,
        dataSBU,
        dataUser,
        dataBagianTubuhYangTerluka,
        dataKondisiTidakAmanPenyebabKecelakaan,
        dataTindakanTidakAmanPenyebabKecelakaan,
        dataFaktorPekerjaanLingkunganKerja,
        sessionData,
      },
    };
  }
);

export default AccidentReport;
