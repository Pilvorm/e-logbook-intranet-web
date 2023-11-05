import React, { useState } from "react";
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
} from "reactstrap";
import { Filter, Plus, Search, Trash } from "react-feather";
import { Paper } from "@mui/material";
import { getAllNearmiss } from "redux/actions/nearmiss";
import { reauthenticate } from "redux/actions/auth";
import { useDispatch } from "react-redux";
import {
  getAllMasterUser,
  deleteMasterUser,
  getSbuAsyncSelect,
} from "redux/actions/master/user";
import ModalFilterNearmiss from "components/online_form/ModalFilterNearmiss";
import ModalFilterUser from "components/online_form/ModalFilterUser";

const Nearmiss = (props) => {
  const { dataNearmiss, token, query, dataFilter, dataSBU } = props;
  console.log(dataNearmiss);

  const router = useRouter();
  const dispatch = useDispatch();

  const pageSizeOptions = [5, 10, 25, 50];
  const [pageSize, setPageSize] = useState(query?.pageSize ?? 10);
  const [pageNumber, setPageNumber] = useState(query?.pageNumber ?? 1);
  const [searchQuery, setSearchQuery] = useState(query?.search ?? "");

  const [visibleFilter, setVisibleFilter] = useState(false);
  const toggleFilterPopup = () => setVisibleFilter(!visibleFilter);

  // const [filterQuery, setFilterQuery] = useState(
  //   query?.filter
  //     ? JSON.parse(query?.filter)
  //     : {
  //         nomorDokumen: "",
  //         site: "",
  //         kategori: "",
  //         tanggalWaktuKejadian: "",
  //         lokasiKejadian: "",
  //         potensiBahaya: "",
  //         investigasiNearmiss: "",
  //         creator: "",
  //       }
  // );

  const handlePageSize = (value) => {
    setPageSize(value);

    router.push({
      pathname: router.pathname,
      query: {
        ...dataFilter,
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
        ...dataFilter,
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
        ...dataFilter,
        pageSize: pageSize,
        pageNumber: 1,
        search: searchQuery,
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

  // const dummyData = [
  //   {
  //     no: "0001/NM/DF/22",
  //   },
  //   {
  //     no: "0002/NM/DF/22",
  //   },
  // ];

  const CreateTableRow = ({ data, router, token }) => {
    return (
      <tr>
        <td
          className="cursor-pointer"
          onClick={() => {
            router.push({
              pathname: router.pathname + "/detail/" + data?.id,
            });
          }}
        >
          <p style={{ color: "#3e11ff" }}>{data?.nomorDokumen}</p>
        </td>
        <td>{data?.site}</td>
        <td>{data?.kategori}</td>
        <td>nama yang terlibat</td>
        <td>{data?.tanggalWaktuKejadian}</td>
        <td>{data?.lokasiKejadian}</td>
        <td>{data?.potensiBahaya}</td>
        <td>{data?.investigasiNearmiss}</td>
        <td>{data?.namaPelapor}</td>
        <td>{data?.status}</td>
        <td>
          <Trash />
        </td>
      </tr>
    );
  };

  return (
    <div className="min-vh-100">
      <ListHeader
        breadCrumbParent="Online Form"
        breadCrumbParent2="Laporan Nearmiss"
        breadCrumbActive="List"
        pageTitle="Laporan Nearmiss"
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
        <div className="p-2">
          <ModalFilterNearmiss
            visible={visibleFilter}
            toggle={toggleFilterPopup}
            dataSBU={dataSBU}
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
                    <Search
                      onClick={() => dispatch(setSearch(tempSearchQuery))}
                      size={14}
                    />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <div className="w-100 ml-2">
                <Button.Ripple
                  color="primary"
                  onClick={() => router.push(`${router.pathname}/AddNearmiss`)}
                >
                  <Plus size={18} />
                  <span className="align-middle ml-1 d-sm-inline-block d-none">
                    Add New Nearmiss
                  </span>
                </Button.Ripple>
              </div>
            </div>
          </div>
          <Table responsive className="border">
            <thead>
              <tr>
                <th className="w-5 text-center">No. Dokumen</th>
                <th className="text-center">Site</th>
                <th className="text-center">Kategori</th>
                <th className="text-center">Nama yang terlibat kejadian</th>
                <th className="text-center">Tanggal & Waktu Kejadian</th>
                <th className="text-center">lokasi kejadian</th>
                <th className="text-center">potensi bahaya</th>
                <th className="text-center">investigasi nearmiss</th>
                <th className="text-center">Creator</th>
                <th className="text-center">Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataNearmiss?.data.map((item) => (
                <CreateTableRow key={item?.id} {...{ data: item, router }} />
              ))}
            </tbody>
          </Table>
          <div
            style={{ width: "97%", marginBottom: 20 }}
            className="m-auto mr-0 mb-4"
          >
            <Pagination totalPage={"1"} {...{ pageNumber, handlePagination }} />
          </div>
        </div>
      </Paper>
    </div>
  );
};

Nearmiss.getLayout = function getLayout(page) {
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

    //console.log(sessionData.user, "dada");
    await store.dispatch(
      getAllNearmiss({
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0] || "HSSE-INSP",
        "CSTM-UPN": sessionData.user.UserPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": query.pageNumber || 1,
        "X-PAGESIZE": query.pageSize || 10,
        "X-ORDERBY": "createdDate desc",
        "X-SEARCH": `*${query.search || ""}*`,
        "X-FILTER": `${
          query?.filter || ""
        }`,
      })
    );

    const dataSBU = await store.dispatch(getSbuAsyncSelect());
    const dataNearmiss = store.getState().masterNearmissReducers;

    return {
      props: {
        token,
        dataNearmiss,
        query,
        dataSBU,
        dataFilter: query,
      },
    };
  }
);

export default Nearmiss;
