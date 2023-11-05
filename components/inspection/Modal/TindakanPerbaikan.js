import { Paper } from "@mui/material";
import FileUploadModal from "components/online_form/nearmiss/FileUploadModal";
import { FieldArray, FormikProvider } from "formik";
import { useEffect, useState } from "react";
import { Plus, PlusCircle, Trash } from "react-feather";

import FormikDatePicker from "components/CustomInputs/CustomDatePicker";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  CustomInput,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import { getAllMasterUser } from "redux/actions/master/user";

const PICCapaPopUp = ({ visible, toggle, onAdd }) => {
  const [loading, setLoading] = useState(false);

  const pageSizeOptions = [5, 10, 25, 50];
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.masterUserReducers);

  useEffect(() => {
    setLoading(true);
    dispatch(
      getAllMasterUser(pageNumber, pageSize, "", "", "", "", "", "")
    ).then((res) => {
      setLoading(false);
    });

    return () => {
      setLoading(false);
    };
  }, [pageSize, pageNumber]);

  return (
    <Modal isOpen={visible} toggle={toggle} size="xl">
      <ModalHeader className="text-secondary bg-light" toggle={toggle}>
        PIC CAPA
      </ModalHeader>
      <ModalBody>
        <Row className="mx-0 mb-2">
          <Col
            className="d-flex align-items-center justify-content-start mt-1"
            md="8"
            sm="12"
          >
            <Label className="mr-1" for="rows-per-page">
              Show
            </Label>
            <CustomInput
              type="select"
              id="rows-per-page"
              className="custominput-table2"
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
            >
              {pageSizeOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </CustomInput>
          </Col>
          <Col
            className="d-flex align-items-center justify-content-end mt-1"
            md="4"
            sm="12"
          >
            <Input
              className="search-table2"
              type="text"
              name="search"
              id="search-pic-capa"
              placeholder="Search"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  dispatch(
                    getAllMasterUser(
                      pageNumber,
                      pageSize,
                      e.target.value,
                      "",
                      "",
                      "",
                      "",
                      ""
                    )
                  );
                }
              }}
            />
          </Col>
        </Row>

        <div>
          {loading ? (
            <Skeleton height={50} count={pageSize + 1} />
          ) : (
            <>
              <Table responsive className="border">
                <thead className="text-center">
                  <tr>
                    <th>NIK</th>
                    <th>NAMA</th>
                    <th>DEPARTEMEN</th>
                    <th>JABATAN</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((row, index) => (
                    <tr key={index}>
                      <td className="text-center">{row.nik}</td>
                      <td>{row.name}</td>
                      <td>{row.companyName}</td>
                      <td>{row.jabatan}</td>
                      <th>
                        <Plus
                          size={18}
                          cursor="pointer"
                          onClick={() => {
                            onAdd(row);
                            toggle();
                          }}
                        />
                      </th>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Row className="mx-0 mb-2">
                <Col
                  className="d-flex align-items-center justify-content-start mt-1"
                  md="9"
                  sm="12"
                >
                  <p className="mb-0" style={{ color: "#b9b9c3" }}>
                    Showing 1 to {pageSize} of {data.totalData} entries
                  </p>
                </Col>
                <Col
                  className="d-flex align-items-center justify-content-end mt-1"
                  md="3"
                  sm="12"
                >
                  <ReactPaginate
                    onPageChange={(page) => {
                      setPageNumber(page.selected + 1);
                    }}
                    forcePage={pageNumber - 1}
                    pageCount={data.totalPage || 1}
                    nextLabel={""}
                    breakLabel={"..."}
                    activeClassName={"active"}
                    pageClassName={"page-item"}
                    previousLabel={""}
                    nextLinkClassName={"page-link"}
                    nextClassName={"page-item next-item"}
                    previousClassName={"page-item prev-item"}
                    previousLinkClassName={"page-link"}
                    pageLinkClassName={"page-link"}
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName={"pagination react-paginate m-0"}
                  />
                </Col>
              </Row>
            </>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

const TindakanPerbaikan = ({ formik }) => {
  const [picCapaPopUp, setPicCapaPopUp] = useState(false);
  const togglePicCapaPopUp = () => setPicCapaPopUp(!picCapaPopUp);

  const [fileUploadPopUp, setFileUploadPopUp] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  return (
    <div>
      <Paper>
        <div className="p-2" style={{ width: "100%" }}>
          {/* TODO: Functionality add and delete table row */}

          <FormikProvider value={formik}>
            <FieldArray
              name="tindakanPerbaikan"
              render={(arrayHelpers) => {
                return (
                  <>
                    <Button.Ripple
                      type="button"
                      color="primary"
                      onClick={() =>
                        arrayHelpers.push({
                          tindakan: "",
                          dueDate: "",
                          picCapa: "",
                          department: "",
                          bukti: "",
                        })
                      }
                    >
                      <Plus size={18} />
                      <span className="align-middle ml-1 d-sm-inline-block d-none">
                        Tindakan Perbaikan
                      </span>
                    </Button.Ripple>
                    <Table responsive bordered className="border mt-2">
                      <thead className="text-center">
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">No</th>
                          <th className="text-center">Tindakan</th>
                          <th className="text-center">Due date</th>
                          <th className="text-center">PIC CAPA</th>
                          <th className="text-center">Dept</th>
                          <th className="text-center">Evidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formik.values.tindakanPerbaikan?.map((item, index) => {
                          return (
                            <tr>
                              <td className="text-center">
                                <Trash
                                  onClick={() => arrayHelpers.remove(index)}
                                  cursor="pointer"
                                  color="red"
                                />
                              </td>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                <Input
                                  name={`tindakanPerbaikan[${index}].tindakan`}
                                  onChange={formik.handleChange}
                                  value={item.tindakan}
                                />
                                {formik.errors.tindakanPerbaikan &&
                                formik.touched.tindakanPerbaikan &&
                                formik.errors.tindakanPerbaikan[index]
                                  ?.tindakan ? (
                                  <div className="text-danger">
                                    {
                                      formik.errors.tindakanPerbaikan[index]
                                        ?.dueDate
                                    }
                                  </div>
                                ) : null}
                              </td>
                              <td className="text-center">
                                <FormikDatePicker
                                  name={`tindakanPerbaikan[${index}].dueDate`}
                                  onChange={formik.handleChange}
                                  value={item.dueDate}
                                />
                                {formik.errors.tindakanPerbaikan &&
                                formik.touched.tindakanPerbaikan &&
                                formik.errors.tindakanPerbaikan[index]
                                  ?.dueDate ? (
                                  <div className="text-danger">
                                    {
                                      formik.errors.tindakanPerbaikan[index]
                                        ?.dueDate
                                    }
                                  </div>
                                ) : null}
                              </td>
                              <td
                                className="text-center"
                                onClick={() => {
                                  setSelectedRowIndex(index);
                                  togglePicCapaPopUp();
                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                {item.picCapa || (
                                  <PlusCircle size={18} cursor="pointer" />
                                )}
                              </td>
                              <td className="text-center">
                                {item.department}
                              </td>
                              <td
                                className="text-center"
                                onClick={() => {
                                  setSelectedRowIndex(index);
                                  setFileUploadPopUp(true);
                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                {item.bukti || (
                                  <PlusCircle size={18} cursor="pointer" />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <PICCapaPopUp
                      visible={picCapaPopUp}
                      toggle={togglePicCapaPopUp}
                      onAdd={(row) => {
                        formik.setFieldValue(
                          `tindakanPerbaikan[${selectedRowIndex}].picCapa`,
                          row.name
                        );
                        formik.setFieldValue(
                          `tindakanPerbaikan[${selectedRowIndex}].department`,
                          row.companyName
                        );
                      }}
                    />

                    <FileUploadModal
                      show={fileUploadPopUp}
                      onHide={() => setFileUploadPopUp(false)}
                      onFileUpload={(idFile, notes, fileName) => {
                        formik.setFieldValue(
                          `tindakanPerbaikan[${selectedRowIndex}].bukti`,
                          fileName
                        );
                        setFileUploadPopUp(false);
                      }}
                    />
                  </>
                );
              }}
            />
          </FormikProvider>
        </div>
      </Paper>
    </div>
  );
};

export default TindakanPerbaikan;
