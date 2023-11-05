import React, { useEffect, useState, useReducer } from "react";
import { getSession } from "next-auth/react";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { useRouter } from "next/router";
import useMobileDetector from "components/useMobileDetector";
import HeaderHomeMobile from "components/Header-home-mobile/HeaderHomeMobile";
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap";
import { Search } from "react-feather";
import Card from "reactstrap/lib/Card";
import BottomNavigator from "components/Mobile_version/Home/BottomNavigator";
import {
  getAllInventory
} from 'helpers/inventory'
import { getRoleUser } from "helpers/auth";
import moment from "moment";
import ReactPaginate from 'react-paginate'

const InventoryPage = ({ data, page, searchValue }) => {
  console.log(data, '<<<');
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const router = useRouter();
  const style = { borderBottom: "2px solid #ebe9f2", marginTop: 5 };
  const [searchField, setSearchField] = useState(searchValue);
  const isMobileWidth = useMobileDetector();
  const [dummyData, setDummyData] = useState([
    {
      noDoc: "001/UINV/DF/23",
      noPeralatan: "001/INV/DF/2023",
      jenisPeralatan: "APAR",
      area: "Cempaka Putih",
      location: "Jakarta",
      createdDate: "8 May 2023 14:45",
      status: "Draft",
    },
    {
      noDoc: "001/UINV/DF/23",
      noPeralatan: "001/INV/DF/2023",
      jenisPeralatan: "APAR",
      area: "Cempaka Putih",
      location: "Jakarta",
      createdDate: "8 May 2023 14:45",
      status: "Draft",
    },
    {
      noDoc: "001/UINV/DF/23",
      noPeralatan: "001/INV/DF/2023",
      jenisPeralatan: "APAR",
      area: "Cempaka Putih",
      location: "Jakarta",
      createdDate: "8 May 2023 14:45",
      status: "Draft",
    },
  ]);

  useEffect(() => {
    if (isMobileWidth) {
    } else {
      router.push("/home");
    }
  }, [isMobileWidth]);

  const handlePagination = (page) => {
    console.log(page);
    router.push({
      pathname: router.pathname,
      query: {
        page: page.selected + 1
      }
    })
  }

  return (
    <>
      {isMobileWidth ? (
        <div>
          <HeaderHomeMobile title="INVENTORY" onBack={() => router.back()} />
          <div
            className="mt-1"
            style={{
              width: "90%",
              margin: "auto",
            }}
          >
            <div className="mt-2">
                <Button.Ripple
                color="primary"
                id="buttonCreate"
                name="buttonCreate"
                className="btn-next mr-1"
                  onClick={() => router.push(`${router.pathname}/add`)}
                style={{
                    width: "40%",
                }}
                >
                <span className="align-middle ml-1 d-sm-inline-block">New</span>
                </Button.Ripple>
            </div>
            <div className="mt-1">
                <InputGroup className="input-group-merge">
                <Input
                    className="search-table2 w-50"
                    type="text"
                    name="search"
                    id="search-master-user"
                    placeholder="Search"
                    onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      router.push({
                        pathname: router.pathname,
                        query: {
                          searchValue: searchField
                        }
                      });
                    }
                    }}
                    value={searchField}
                    onChange={(e) => {
                      setSearchField(e.target.value);
                      forceUpdate();
                    }}
                />
                <InputGroupAddon addonType="append">
                    <InputGroupText>
                    <Search
                          onClick={() => router.push({
                            pathname: router.pathname,
                            query: {
                              searchValue: searchField
                            }
                          })}
                        size={14}
                    />
                    </InputGroupText>
                </InputGroupAddon>
                </InputGroup>
            </div>
          </div>
          <div
            className="mt-1"
            style={{
              width: "90%",
              margin: "auto",
              height: "70vh",
              overflow: "auto",
            }}
          >
            <div className="mt-1">
              {data.data.map((item, index) => (
                <Card onClick={() => {
                  router.push({
                    pathname: router.pathname + "/edit",
                    query: {
                      id: item.id
                    }
                  })
                }} key={index} className="p-1 mt-1 border">
                  <div className="d-flex justify-content-between" style={style}>
                    <p style={{ color: "#46A583" }}>Nomor Dokumen</p>
                    <p style={{ color: "#46A583" }} className="mr-2">
                      {item.nomorPeralatan}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between" style={style}>
                    <p>Nomor Peralatan</p>
                    <p className="mr-2">{item.nomorPeralatan}</p>
                  </div>
                  <div className="d-flex justify-content-between" style={style}>
                    <p>Jenis Peralatan</p>
                    <p className="mr-2">{item.jenisPeralatan}</p>
                  </div>
                  <div className="d-flex justify-content-between" style={style}>
                    <p>Area</p>
                    <p className="mr-2">{item.area}</p>
                  </div>
                  <div className="d-flex justify-content-between" style={style}>
                    <p>Lokasi</p>
                    <p className="mr-2">{item.lokasi}</p>
                  </div>
                  <div className="d-flex justify-content-between" style={style}>
                    <p>Tgl Pembuatan</p>
                    <p className="mr-2">{moment(item.createdDate).format("DD MMM YYYY HH:MM")}</p>
                  </div>
                  <div className="d-flex justify-content-between" style={style}>
                    <p>Status</p>
                    <p className="mr-2">{item.status}</p>
                  </div>
                </Card>
              ))}
              {
                data.data != false && 
                <div
                  className="d-flex justify-content-end"
                >
                  <div>
                    <ReactPaginate
                      pageCount={data.totalPage || 0}
                      nextLabel={""}
                      // breakLabel={"..."}
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
                      containerClassName={
                        "flex pagination react-paginate m-0 justify-content-center container-pagination"
                      }
                      forcePage={page - 1}
                      onPageChange={(page) => {
                        handlePagination(page)
                      }}
                    />
                  </div>
                </div>
              }
            </div>
          </div>
          <BottomNavigator router={router} />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

InventoryPage.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query } = ctx;
    const page = query.page || 1
    const searchValue = query.searchValue || "";
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: `/auth?url=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    };
    let email = null;
    let payload = null;
    let fetchData = null;
    if (sessionData.user.UserPrincipalName) {
      email = sessionData.user.UserPrincipalName.replace("@", "%40");
    }
    if (email !== null) {
      // get all inventory as non guest
      const roleUser = await getRoleUser(email);
      const firstData = roleUser.data[0];
      payload = {
        "CSTM-COMPID": firstData.companyCode,
        "CSTM-NAME": firstData.name,
        "CSTM-EMAIL": firstData.email,
        "CSTM-ROLE": firstData.roleCode,
        "CSTM-UPN": firstData.userPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": page,
        "X-PAGESIZE": 5,
        "X-ORDERBY": "CreatedBy",
        "X-SEARCH": searchValue,
        "X-DEEPSEARCH": false
      }
      const response = await getAllInventory(sessionData.user.token, payload);
      fetchData = response;
    } else {
      // get all inventory as guest
      const { Name, Email, token } = sessionData.user;
      payload = {
        "CSTM-NAME": Name,
        "CSTM-EMAIL": Email,
        "CSTM-ROLE": "HSSE-USR",
        "CSTM-UPN": Email,
        "X-PAGINATION": true,
        "X-PAGE": page,
        "X-PAGESIZE": 5,
        "X-ORDERBY": "CreatedBy",
        "X-SEARCH": searchValue,
        "X-DEEPSEARCH": false
      }
      const response = await getAllInventory(token, payload);
      fetchData = response;
    }


    return {
      props: {
        userRoles: sessionData,
        query: ctx.query,
        data: fetchData.data,
        page: page,
        searchValue
      },
    };
  }
);

export default InventoryPage;
