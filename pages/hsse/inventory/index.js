import React, { useEffect, useState } from "react";
import { ListHeader, Pagination } from "components/shared";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { wrapper } from "redux/store";
import {
  Button,
  Table,
  Label,
  CustomInput,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Edit2, MoreVertical, Plus, Search, Trash2 } from "react-feather";
import { Paper } from "@mui/material";
import ModalFilter from "components/inspection/ModalFilter";
import { reauthenticate } from "redux/actions/auth";
import { DeleteData, getAllInventory } from "redux/actions/inventory";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import visibleFilter from "react-redux";
import CustomPagination from "components/shared/CustomPagination";
import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotificationWithFunction,
} from "components/notification";
import moment from "moment";

const Inventory = (props) => {
  const { dataInventory, token, query, sessionData } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, []);

  const pageSizeOptions = [5, 10, 25, 50];
  const [pageSize, setPageSize] = useState(query?.pageSize ?? 10);
  const [pageNumber, setPageNumber] = useState(query?.pageNumber ?? 1);
  const [searchQuery, setSearchQuery] = useState(query?.search ?? "");
  const [filterQuery, setFilterQuery] = useState(
    query?.filter
      ? JSON.parse(query?.filter)
      : {
          nomorPeralatan: "",
          jenisPeralatan: "",
          lokasi: "",
          area: "",
        }
  );
  const [visibleFilter, setVisibleFilter] = useState(false);

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

    const hitSubmit = dispatch(DeleteData(compId, role, upn, name, email, id))
      .then((res) => {
        console.log(res, "rsponsee");

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

  const CreateTableRow = ({ data, router, token }) => {
    return (
      <>
        <tr>
          <td>
            <UncontrolledDropdown direction="right">
              <DropdownToggle
                className="icon-btn hide-arrow"
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
                  onClick={(e) => {
                    e.preventDefault();
                    router.push({
                      pathname: router.pathname + "/detail/" + data?.id,
                    });
                  }}
                  className="w-100"
                >
                  <Edit2 className="mr-50" size={15} />
                  <span className="align-middle">Edit</span>
                </DropdownItem>
                {/* {data.status === "DRAFT" && ( */}
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
          <td
            onClick={() => {
              router.push({
                pathname: router.pathname + "/detail/" + data?.id,
              });
            }}
            className="cursor-pointer"
          >
            <p style={{ color: "#3e11ff" }}>{data.nomorPeralatan}</p>
          </td>
          <td>{data.companyName}</td>
          <td>{data.kodeJenisPeralatan}</td>
          <td>{data.lokasi}</td>
          <td>{data.area}</td>
          <td>{moment(data.tanggalPengecekan).format("D MMM yyyy")}</td>
          <td>{data.periodePengecekan}</td>
          <td>{data.status}</td>
        </tr>
      </>
    );
  };

  return (
    <div className="min-vh-100">
      <ModalFilter
        isOpen={visibleFilter}
        toggle={(bool) => setVisibleFilter(bool)}
        handleFilterQuery={handleFilterQuery}
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
        token={token}
      />
      <ListHeader
        breadCrumbParent="Inspection"
        breadCrumbParent2="Inventory"
        breadCrumbActive="Daftar"
        pageTitle="Daftar Inventory"
        {...{
          router,
          pageSize,
          searchQuery,
          pageSizeOptions,
          handlePageSize,
          handleSearchQuery,
          setSearchQuery,
        }}
      ></ListHeader>
      <Paper elevation={8} style={{ minHeight: "50vh" }}>
        <div style={{ width: "95%" }} className="m-auto py-2">
          <Button.Ripple color="primary" onClick={() => setVisibleFilter(true)}>
            <span className="align-middle">Filter</span>
          </Button.Ripple>
        </div>
        <div
          style={{ width: "95%", marginBottom: 100 }}
          className="overflow-auto stylized-scrollbar m-auto border"
        >
          <div className="d-flex justify-content-between align-items-center mb-2 p-2 w-100">
            <div className="d-flex align-items-center mr-2">
              <Label for="rows-per-page">Show</Label>
              <CustomInput
                className="form-control ml-50 pr-3"
                type="select"
                id="rows-per-page"
                value={pageSize}
                onChange={(e) => handlePageSize(e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </CustomInput>
            </div>

            <div
              style={{ minWidth: "35%" }}
              className="d-flex align-items-center"
            >
              <InputGroup className="input-group-merge">
                <Input
                  className="search-table2 w-50"
                  type="text"
                  name="search"
                  id="search-master-user"
                  placeholder="Search"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSearchQuery();
                  }}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>
                    <Search onClick={() => handleSearchQuery()} size={14} />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <div className="w-100 ml-2">
                <Button.Ripple
                  color="primary"
                  onClick={() => router.push(`${router.pathname}/AddInventory`)}
                >
                  <Plus size={18} />
                  <span className="align-middle ml-1 d-sm-inline-block d-none">
                    Add New Inventory
                  </span>
                </Button.Ripple>
              </div>
            </div>
          </div>
          <Table responsive className="border">
            <thead>
              <tr>
                <th className="w-5 text-left">Action</th>
                <th className="w-5 text-left">nomor peralatan</th>
                <th className="text-left">Site</th>
                <th className="text-left">Kategori</th>
                <th className="text-left">Lokasi</th>
                <th className="text-left">Area</th>
                <th className="text-left">Tgl pengecekan</th>
                <th className="text-left">PERIODE pengecekan</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataInventory?.data.map((item) => (
                <CreateTableRow key={item?.id} {...{ data: item, router }} />
              ))}
              {/* {[{}].map((data) => (


                <CreateTableRow key={data?.id} {...{ data, router, token: "a" }} />
              ))} */}
            </tbody>
          </Table>
          <div
            style={{ width: "97%", marginBottom: 20 }}
            className="m-auto mr-0 mb-4"
          >
            {/* <Pagination
              totalPage={dataInventory?.totalPage}
              {...{ pageNumber, handlePagination }}
            /> */}
            <CustomPagination
              currentPage={dataInventory?.currentPage}
              pageSize={dataInventory?.pageSize}
              totalData={dataInventory?.totalData}
              totalPage={dataInventory?.totalPage}
              handlePagination={handlePagination}
            />
          </div>
        </div>
      </Paper>
    </div>
  );
};

Inventory.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    //console.log("Token dsds");
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
      getAllInventory({
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0].RoleCode,
        "CSTM-UPN": sessionData.user.UserPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": query.pageNumber || 1,
        "X-PAGESIZE": query.pageSize || 10,
        "X-ORDERBY": "createdDate desc",
        "X-SEARCH": `*${query.search || ""}*`,
        "X-FILTER": `isDeleted=false|${
          query?.filter ? formatFilter(JSON.parse(query?.filter)) : ""
        }`,
      })
    );

    console.log({
      "CSTM-COMPID": sessionData.user.CompCode,
      "CSTM-NAME": sessionData.user.Name,
      "CSTM-EMAIL": sessionData.user.Email,
      "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0].RoleCode,
      "CSTM-UPN": sessionData.user.UserPrincipalName,
      "X-PAGINATION": true,
      "X-PAGE": query.pageNumber || 1,
      "X-PAGESIZE": query.pageSize || 10,
      "X-ORDERBY": "createdDate desc",
      "X-SEARCH": `*${query.search || ""}*`,
      "X-FILTER": `${
        query?.filter ? formatFilter(JSON.parse(query?.filter)) : ""
      }`,
    });

    const dataInventory = store.getState().masterInventoryReducers;

    return {
      props: {
        token,
        dataInventory,
        query,
        sessionData,
      },
    };
  }
);

export default connect((state) => state)(Inventory);
