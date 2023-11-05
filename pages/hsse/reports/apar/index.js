import BreadCrumbs from "components/custom/BreadcrumbCustom";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { Search, Edit, MoreVertical, Trash, Calendar } from "react-feather";
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import {
    Plus,
    Download
} from 'react-feather';
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import DatePicker from "react-datepicker";
import moment from "moment";

const CreateTableRow = ({
  dispatch,
  data,
  router,
  pageSize,
  pageNumber,
  searchQuery,
}) => {
  const [editPopup, setEditPopup] = useState(false);
  const toggleEditPopup = () => setEditPopup(!editPopup);

  return (
    <tr>
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
              onClick={toggleEditPopup}
              id="editBtn"
            >
              <Edit className="mr-50" size={15} />
              <span className="align-middle">Edit</span>
              {/* <EditAttachmentTypePopup
                visible={editPopup}
                toggle={toggleEditPopup}
                data={data}
              /> */}
            </DropdownItem>
            <DropdownItem
              className="w-100"
              // onClick={handleDelete}
              id="deleteBtn"
            >
              <Trash className="mr-50" size={15} />
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
      <td
        style={{ color: "#3e11ff" }}
        className="cursor-pointer"
        onClick={() => {
          router.push({
            pathname: router.pathname + "/detail/1",
          });
        }}
      >
        {data.no}
      </td>
      <td className="text-left">KF</td>
      <td className="text-left">Joko</td>
      <td className="text-left">14-07-23/14:00</td>
      <td className="text-left">Gedung 1</td>
      <td className="text-left">X</td>
      <td className="text-left">X</td>
      <td className="text-left">X</td>
      <td className="text-left">X</td>
    </tr>
  );
};

const AparReport = ({userRoles}) => {
  const { user } = userRoles;
  const router = useRouter();

  const pageSizeOptions = [5, 10, 25, 50];
  const [pageSize, setPageSize] = useState("1");
  const [pageNumber, setPageNumber] = useState("1");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [visibleFilterClicked, setVisibleFilterClicked] = useState(false);

  const [searchQuery, setSearchQuery] = useState("1");

  const [createPopup, setCreatePopup] = useState(false);
  const toggleCreatePopup = () => setCreatePopup(!createPopup);

  const dummyData = [
    {
      no: "0001/LKK/DF/XI/22",
    },
  ];

  const handlePageSize = (value) => {
    setPageSize(value);

    router.push({
      pathname: router.pathname,
      query: {
        pageSize: value,
        pageNumber: 1,
        search: searchQuery,
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
      },
    });
  };

  const handleSearchQuery = () => {
    router.push({
      pathname: router.pathname,
      query: {
        pageSize: pageSize,
        pageNumber: pageNumber,
        search: searchQuery,
      },
    });
  };

  return (
    <div>
      <BreadCrumbs
        breadCrumbParent="HSSE"
        breadCrumbParent2="Report"
        breadCrumbActive="APAR"
      />
      <div className="my-2">
        <h2 className="m-0">Report APAR</h2>
      </div>

      <Card className="p-2">
        <Label>Tanggal Pengecekan</Label>
        <div className="d-flex justify-content-between">
          <div className="d-flex" style={{ width: "50%", gap: 20 }}>
            <div className="form-control d-flex justify-content-between align-items-center pl-0">
              <DatePicker
                placeholderText="Placeholder"
                dateFormat="dd MMM yyyy"
                showMonthDropdown
                showYearDropdown
                selected={startDate}
                dropdownMode="select"
                className="form-control border-left-0 border-right-0"
                onChange={(date) => setStartDate(date)}
              />
              <div className="mx-50"></div>
              <Calendar size={18} />
            </div>
            <Label style={{ marginTop: 7, fontSize: 16 }}>-</Label>
            <div className="form-control d-flex justify-content-between align-items-center pl-0">
              <DatePicker
                placeholderText="Placeholder"
                dateFormat="dd MMM yyyy"
                showMonthDropdown
                showYearDropdown
                selected={endDate}
                dropdownMode="select"
                className="form-control border-left-0 border-right-0"
                onChange={(date) => setEndDate(date)}
              />
              <div className="mx-50"></div>
              <Calendar size={18} />
            </div>
            <div className="d-flex align-items-center">
              <Button.Ripple
                color="primary"
                id="buttonFilter"
                name="buttonFilter"
                className="btn-next mr-1"
                onClick={() => setVisibleFilterClicked(true)}
              >
                <span className="align-middle d-sm-inline-block d-none">
                  Filter
                </span>
              </Button.Ripple>
            </div>
          </div>
          {
              visibleFilterClicked &&
                <div className="d-flex mr-1" style={{gap: 20}}>
                    <Button.Ripple
                        color="primary"
                        onClick={() => router.push(`${router.pathname}/formcreate-new`)}
                        className="cursor-pointer"
                        >
                        <Download size={18} />
                        <span className="align-middle ml-1 d-sm-inline-block d-none">
                            Export to Excel
                        </span>
                    </Button.Ripple>
                    <Button.Ripple
                        color="primary"
                        onClick={() => router.push(`${router.pathname}/formcreate-new`)}
                        className="cursor-pointer"
                        >
                        <Download size={18} />
                        <span className="align-middle ml-1 d-sm-inline-block d-none">
                            Download
                        </span>
                    </Button.Ripple>
                </div>
          }
        </div>
      </Card>
      <Card className="p-2">
          {
              visibleFilterClicked &&
                <div style={{display: 'grid', alignSelf: 'center'}}>
                    <Label style={{ fontSize: 24, textAlign: "center", margin: "auto" }}>
                    REPORT APAR
                    </Label>
                    <Label style={{ fontSize: 24, textAlign: "center", margin: "auto" }}>
                    Periode Pengecekan : {moment(startDate).format("DD MMM YYYY")} -{" "}
                    {moment(endDate).format("DD MMM YYYY")}
                    </Label>
                    <Label style={{ fontSize: 24, textAlign: "center", margin: "auto" }}>
                    Site : {user.CompName}
                    </Label>
                </div>
          }

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
              <InputGroup className="input-group-merge">
                <Input
                  className="search-table2 w-50"
                  type="text"
                  name="search"
                  id="search-master-user"
                  placeholder="Search"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      //   dispatch(setSearch(e.target.value));
                    }
                  }}
                  // value={tempSearchQuery || searchQuery}
                  onChange={(e) => {
                    // setTempSearchQuery(e.target.value);
                    // forceUpdate();
                  }}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>
                    <Search
                      //   onClick={() => dispatch(setSearch(tempSearchQuery))}
                      size={14}
                    />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>
        <Table responsive className="border">
          <thead className="text-center">
            <tr>
              <th>Action</th>
              <th>No. Dokumen</th>
              <th>Site</th>
              <th>Nama yang Terlibat Kejadian</th>
              <th>Tanggal & Waktu Kejadian</th>
              <th>Lokasi Kejadian</th>
              <th>Potensi Bahaya</th>
              <th>Investigasi Nearmiss</th>
              <th>Creator</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {
                visibleFilterClicked &&
                dummyData.map((data) => (
                    <CreateTableRow key={data?.no} {...{ data, router, token: "" }} />
                ))
            }
          </tbody>
        </Table>
      </Card>
      <Row className="mt-1 mb-3">
        <Col
          className="d-flex align-items-center justify-content-start"
          md="9"
          sm="12"
        >
          <p className="mb-0" style={{ color: "#b9b9c3" }}>
            Showing 1 to X of X entries
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
            pageCount={1}
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

AparReport.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    // console.log("Token dsds");
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: `/auth?url=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        pageNumber: 3,
        userRoles: sessionData,
      },
    };
  }
);

export default AparReport;
