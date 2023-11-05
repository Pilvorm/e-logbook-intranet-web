import BreadCrumbs from "components/custom/BreadcrumbCustom";
import React, { useState } from "react";
import { ExportIndicator, ListHeader, Pagination } from "components/shared";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import {
  Search,
  ChevronDown,
  Edit,
  ExternalLink,
  MoreVertical,
  Plus,
  Trash,
  Filter,
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { Paper } from "@mui/material";
import ModalFilterP3K from "components/online_form/ModalFilterP3K";

const CreateTableRow = ({
  dispatch,
  data,
  router,
  pageSize,
  pageNumber,
  searchQuery,
}) => {
  // const { data: session, status } = useSession();

  const [editPopup, setEditPopup] = useState(false);
  const toggleEditPopup = () => setEditPopup(!editPopup);

  // const handleDelete = (e) => {
  //   e.preventDefault();
  //   confirmAlertNotification(
  //     "Delete Item",
  //     "Are you sure to delete this document?",
  //     () => {
  //       dispatch(deleteMasterAttachmentType(data.id, session.user.token)).then(
  //         (res) => {
  //           if (res.status === HTTP_CODE.UNAUTHORIZED) {
  //             errorAlertNotification(
  //               "Error",
  //               "Something went wrong, Please try again later."
  //             );
  //           } else if (res.status === HTTP_CODE.DELETED) {
  //             successAlertNotification(
  //               "Deleted Success",
  //               "Successfully Deleted Item"
  //             );
  //             router.push({
  //               pathname: router.pathname,
  //               query: { pageSize, pageNumber, searchQuery },
  //             });
  //           } else {
  //             errorAlertNotification(
  //               "Error",
  //               "Something went wrong, Please try again later."
  //             );
  //           }
  //         }
  //       );
  //     }
  //   );
  // };

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

const P3k = ({}) => {
  const router = useRouter();

  const pageSizeOptions = [5, 10, 25, 50];
  const [pageSize, setPageSize] = useState("1");
  const [pageNumber, setPageNumber] = useState("1");

  const [searchQuery, setSearchQuery] = useState("1");

  const [visibleFilter, setVisibleFilter] = useState(false);
  const toggleFilterPopup = () => setVisibleFilter(!visibleFilter);

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
        breadCrumbParent="Online Form"
        breadCrumbParent2="Laporan P3k"
        breadCrumbActive="List"
      />
      <div className="my-2">
        <h2 className="m-0">Laporan Penggunaan P3K</h2>
      </div>

      <Card className="p-2">
        <ModalFilterP3K
          visible={visibleFilter}
          toggle={toggleFilterPopup}
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
          {/* <CreateAttachmentTypePopup
            visible={createPopup}
            toggle={toggleCreatePopup}
          /> */}
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
              onClick={toggleCreatePopup}
            >
              <Plus size={18} />
              <span className="align-middle ml-1 d-sm-inline-block d-none">
                Add New Form
              </span>
            </Button.Ripple>
            {/* <CreateAttachmentTypePopup
            visible={createPopup}
            toggle={toggleCreatePopup}
          /> */}
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
          {dummyData.map((data) => (
            <CreateTableRow key={data?.no} {...{ data, router, token: "" }} />
          ))}
          {/* {dataMasterAttachmentType &&
            dataMasterAttachmentType.data.map((data) => (
              <CreateTableRow
                key={data.id}
                dispatch={dispatch}
                data={data}
                router={router}
                pageSize={pageSize}
                pageNumber={pageNumber}
                searchQuery={searchQuery}
              />
            ))} */}
        </tbody>
      </Table>
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

P3k.getLayout = function getLayout(page) {
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
        userRoles: sessionData
      },
    };
  }
);

export default P3k;
