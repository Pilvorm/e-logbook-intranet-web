import { HTTP_CODE } from "constant";

import BreadCrumbs from "components/custom/BreadcrumbCustom";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Filter,
  MoreVertical,
  Plus,
  Trash,
  Trash2,
} from "react-feather";
import ReactPaginate from "react-paginate";
import {
  Button,
  Card,
  Col,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";

import { connect, useDispatch } from "react-redux";
import { reauthenticate } from "redux/actions/auth";
import { wrapper } from "redux/store";
import moment from "moment";

import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotification,
  deleteAlertNotification,
  successAlertNotificationWithFunction,
} from "components/notification";

import ModalFilterLaporanKecelakaan from "components/online_form/ModalFilterLaporanKecelakaan";
import { getSbuAsyncSelect } from "redux/actions/master/user";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import {
  getAllKecelakaanKerja,
  deleteKecelakaanKerja,
} from "redux/actions/kecelakaanKerja";

const KecelakaanKerja = (props) => {
  const {
    dataKecelakaanKerja,
    dataSBU,
    query,
    token,
    dataFilter,
    sessionData,
  } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  console.log("TEST");
  console.log(dataKecelakaanKerja);

  const pageSizeOptions = [5, 10, 15, 20];
  const [pageSize, setPageSize] = useState(query?.pageSize ?? 10);
  const [pageNumber, setPageNumber] = useState(query?.pageNumber ?? 1);
  const [searchQuery, setSearchQuery] = useState(query?.search ?? "");
  const [filterQuery, setFilterQuery] = useState(
    query?.filter
      ? JSON.parse(query?.filter)
      : {
          nomorDokumen: "",
          site: "",
          jenisInsiden: "",
          tanggalKecelakaan: "",
          lokasiKecelakaan: "",
          aktivitasKorban: "",
          insidenYangDialami: "",
          creator: "",
          status: "",
        }
  );

  const [visibleFilter, setVisibleFilter] = useState(false);
  const toggleFilterPopup = () => setVisibleFilter(!visibleFilter);

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, [dispatch]);

  const handlePageSize = (value) => {
    setPageSize(value);

    router.push({
      pathname: router.pathname,
      query: {
        pageSize: value,
        pageNumber: 1,
        search: searchQuery,
        filter: JSON.stringify(filterQuery),
      },
    });
  };

  const handlePagination = (page) => {
    setPageNumber(page.selected + 1);

    router.push({
      pathname: router.pathname,
      query: {
        pageSize: pageSize,
        pageNumber: page.selected + 1,
        search: searchQuery,
        filter: JSON.stringify(filterQuery),
      },
    });
  };

  const handleSearchQuery = () => {
    router.push({
      pathname: router.pathname,
      query: {
        pageSize: pageSize,
        pageNumber: 1,
        search: searchQuery,
        filter: JSON.stringify(filterQuery),
      },
    });
  };

  const handleFilterQuery = (param) => {
    router.push({
      pathname: router.pathname,
      query: {
        pageSize: pageSize,
        pageNumber: 1,
        search: searchQuery,
        filter: JSON.stringify(param),
      },
    });
  };

  const deleteNotification = (id) => {
    return confirmAlertNotification(
      "Confirmation",
      `Apakah Anda yakin untuk menghapus data ini?`,
      () => {
        DeleteHandler(id);
      },
      () => {}
    );
  };

  const DeleteHandler = async (id) => {
    const data = dataKecelakaanKerja;
    console.log(id, dataKecelakaanKerja);

    const hitSubmit = dispatch(deleteKecelakaanKerja(id), console.log(id))
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          successAlertNotificationWithFunction(
            "Sukses",
            "Data berhasil dihapus",
            () => {
              router.reload();
            }
          );
          formik.resetForm();
        } else {
          let errorMessages = [];
          if (res.response.status === 401) {
            return errorAlertNotification("Error", res.response.data.message);
          }

          if (res.response.status === 409) {
            return errorAlertNotification("Error Duplicate", "Duplicate Data");
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
                  : "Something went wrong, Please try again later.",
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
        }

        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <BreadCrumbs
        breadCrumbParent="Online Form"
        breadCrumbParent2="Laporan Kecelakaan Kerja"
        breadCrumbActive="List"
      />
      <div className="d-flex align-items-center my-3">
        <Button.Ripple
          outline
          type="submit"
          color="danger"
          className="btn-next"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
          <span className="ml-50 align-middle d-sm-inline-block d-none">
            Back to Previous Page
          </span>
        </Button.Ripple>

        <h2 className={`ml-2 pl-2 border-left-dark`}>
          Laporan Kecelakaan Kerja
        </h2>
      </div>

      <Card className="p-2">
        <ModalFilterLaporanKecelakaan
          visible={visibleFilter}
          toggle={toggleFilterPopup}
          dataSBU={dataSBU}
          handleFilterQuery={handleFilterQuery}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
        />
        <div className="d-flex align-items-center">
          <Button.Ripple
            color="primary"
            id="buttonFilter"
            name="buttonFilter"
            className="btn-next mr-1"
            onClick={() => setVisibleFilter(true)}
          >
            <Filter size={18} />
            <span className="align-middle ml-1 d-sm-inline-block d-none">
              Filter
            </span>
          </Button.Ripple>
        </div>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center mr-2">
          <Label for="rows-per-page">Show</Label>
          <CustomInput
            className="form-control ml-50 pr-3"
            type="select"
            id="rows-per-page"
            value={pageSize}
            onChange={(e) => handlePageSize(e.target.value)}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </CustomInput>
        </div>

        <div className="d-flex align-items-center">
          <div className="mr-2">
            <Input
              className="search-table2"
              type="text"
              name="search"
              placeholder="Search"
              value={searchQuery}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearchQuery();
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center">
            <Button.Ripple
              color="primary"
              id="buttonCreate"
              name="buttonCreate"
              className="btn-next mr-1"
              onClick={() => router.push("/hsse/accident_report/AddReport")}
            >
              <Plus size={18} />
              <span className="align-middle ml-1 d-sm-inline-block d-none">
                Add New Form
              </span>
            </Button.Ripple>
          </div>
        </div>
      </div>
      <Table responsive className="border">
        <thead className="text-center">
          <tr>
            <th className="align-middle">Action</th>
            <th className="align-middle">No. Dokumen</th>
            <th className="align-middle">Company</th>
            <th className="align-middle">Jenis Kejadian</th>
            <th className="align-middle">Tanggal & Waktu Kejadian</th>
            <th className="align-middle">Lokasi Kecelakaan Kerja</th>
            <th className="align-middle">
              Aktivitas / Kegiatan Korban di Lokasi
            </th>
            <th className="align-middle">Insiden yang Dialami</th>
            <th className="align-middle">Creator</th>
            <th className="align-middle">Status</th>
          </tr>
        </thead>
        <tbody className="text-center text-break">
          {dataKecelakaanKerja &&
            dataKecelakaanKerja.data.map((data) => (
              <tr key={data.nomorDokumen}>
                <td>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="icon-btn hide-arrow"
                      id="optionsSelect"
                      color="transparent"
                      size="sm"
                      caret
                      disabled={
                        !data.status.includes("DRAFT") &&
                        !data.status.includes("Waiting for revision")
                      }
                    >
                      <MoreVertical size={15} />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        className="w-100"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push({
                            pathname: router.pathname + "/detail/" + data?.id,
                          });
                        }}
                        id="editBtn"
                      >
                        <Edit className="mr-50" size={15} />
                        <span className="align-middle">Edit</span>
                      </DropdownItem>
                      {/* //{data.status === "DRAFT" && ( */}
                      <DropdownItem
                        onClick={(e) => {
                          e.preventDefault();
                          deleteNotification(data?.id);
                        }}
                        className="w-100"
                      >
                        <Trash2 className="mr-50" size={15} />
                        <span className="align-middle">Delete</span>
                      </DropdownItem>
                      {/* )} */}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
                <td>{data.nomorDokumen}</td>
                <td>{data.site}</td>
                <td>{data.jenisInsiden}</td>
                <td>
                  {moment(data.tanggalKecelakaan).format("DD MMM YYYY HH:mm")}
                </td>
                <td>{data.lokasiKecelakaan}</td>
                <td>{data.aktivitasKorban}</td>
                <td>{data.insidenYangDialami}</td>
                <td>{data.creator}</td>
                <td>{data.status}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Row className="mt-1 mb-3">
        <Col
          className="d-flex align-items-center justify-content-start"
          md="9"
          sm="12"
        >
          <p className="mb-0" style={{ color: "#b9b9c3" }}>
            Showing 1 to {pageSize} of {dataKecelakaanKerja.totalData} entries
          </p>
        </Col>
        <Col
          className="d-flex align-items-center justify-content-end"
          md="3"
          sm="12"
        >
          <ReactPaginate
            onPageChange={(page) => handlePagination(page)}
            forcePage={pageNumber - 1}
            pageCount={dataKecelakaanKerja.totalPage || 1}
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
    </div>
  );
};

KecelakaanKerja.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

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

    const dataSBU = await store.dispatch(getSbuAsyncSelect());

    const token = sessionData.user.token;
    store.dispatch(reauthenticate(token));

    const formatFilter = (filterData) => {
      const filteredFilter = Object.entries(filterData).filter(
        (data) => data[1] !== ""
      );
      const finalFilter = filteredFilter
        .map((data) => `${data[0]}=${data[1]}`)
        .join("|");

      return finalFilter;
    };

    await store.dispatch(
      getAllKecelakaanKerja({
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0],
        "CSTM-UPN": sessionData.user.UserPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": query.pageNumber || 1,
        "X-PAGESIZE": query.pageSize || 10,
        "X-ORDERBY": "createdDate desc",
        "X-SEARCH": `*${query.search || ""}*`,
        "X-FILTER": `${
          query?.filter ? formatFilter(JSON.parse(query?.filter)) : ""
        }`,
      })
    );

    const dataKecelakaanKerja = store.getState().kecelakaanKerjaReducers;

    return {
      props: {
        sessionData,
        dataKecelakaanKerja,
        query,
        token,
        dataSBU,
        dataFilter: query,
      },
    };
  }
);

export default connect((state) => state)(KecelakaanKerja);
