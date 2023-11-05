import React, { useEffect, useState, useReducer } from "react";
import { getSession } from "next-auth/react";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { useRouter } from "next/router";
import useMobileDetector from "components/useMobileDetector";
import dynamic from "next/dynamic";
import HeaderHomeMobile from "components/Header-home-mobile/HeaderHomeMobile";
import Carousel from "components/Carousel";
import Image from "next/image";
import { Trash, Search, Plus } from "react-feather";
import {
  Button,
  Card,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner,
} from "reactstrap";
import Label from "reactstrap/lib/Label";
import ModalAddPhoto from "components/Mobile_version/modal/ModalAddPhoto";
import { confirmAlertNotification } from "components/notification";
import ModalSearchTools from "components/Mobile_version/modal/ModalSearchTools";
import { getListPengaduan } from "redux/actions/pengaduan";
import { reauthenticate } from "redux/actions/auth";
import { useDispatch } from "react-redux";
import PengaduanCard from "components/Mobile_version/Pengaduan/PengaduanCard";

const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
});

const Pengaduan = ({ sessionData, query, data, token }) => {
  console.log(data, "DATAAAA");
  const router = useRouter();
  const dispatch = useDispatch();

  const isMobileWidth = useMobileDetector();
  const [isMobileDevice, setIsMobileDevice] = useState(isMobileWidth);

  const [dataState, setDataState] = useState(data?.data || []);
  const [page, setPage] = useState(data?.currentPage + 1 || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(data?.hasNext || false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isMobileWidth) {
      setIsMobileDevice(true);
    } else {
      router.push("/home");
    }
  }, [isMobileWidth]);

  const hitAPI = async (idx) => {
    const response = await dispatch(
      getListPengaduan({
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0],
        "CSTM-UPN": sessionData.user.UserPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": idx || page,
        "X-ORDERBY": "createdDate desc",
        "X-SEARCH": `*${search}*`,
        "X-FILTER": `creatorUpn=${sessionData.user.UserPrincipalName}`,
      })
    );

    console.log(response);
    return response;
  };

  const fetchMoreData = async () => {
    if (!hasNext || isLoading) return;

    setIsLoading(true);
    try {
      const response = await hitAPI();

      const newData = dataState.concat(response?.data.data);

      setDataState(newData);
      // if (response?.hasNext) {
      setHasNext(response?.data.hasNext);
      setPage(response?.data.currentPage + 1);
      // }else{
      //   setHasNext(false);
      // }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const searchHandler = async () => {
    setIsLoading(true);
    try {
      const response = await hitAPI(1);

      const newData = response?.data.data;
      setDataState(newData);
      setHasNext(response?.data.hasNext);
      setPage(response?.data.currentPage + 1);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 200 &&
        !isLoading
      ) {
        fetchMoreData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  return (
    <>
      {isMobileWidth ? (
        <>
          <HeaderHomeMobile
            title="DAFTAR PENGADUAN"
            onBack={() => router.back()}
          />
          <div className="m-1">
            <Button.Ripple
              color="info"
              className="mr-1 mb-1"
              onClick={() => router.push("/hsse/mobile/pengaduan/add")}
            >
              <div className="d-flex" style={{ alignItems: "center" }}>
                <Plus size={15} />
                <span className="ml-1">Buat Pengaduan</span>
              </div>
            </Button.Ripple>
            <>
              <InputGroup className="input-group-merge">
                <Input
                  className="search-table2 w-50"
                  type="text"
                  name="search"
                  id="search-master-user"
                  placeholder="Search"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                    }
                  }}
                  // value={tempSearchQuery || searchQuery}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>
                    <Search
                      onClick={() => {
                        setPage(1);
                        searchHandler();
                      }}
                      size={14}
                    />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </>
            {dataState &&
              dataState.map((item) => {
                return <PengaduanCard item={item} />;
              })}
            {isLoading && (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </>
      ) : null}
    </>
  );
};

Pengaduan.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const sessionData = await getSession(ctx);
    const { query } = ctx;
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

    const response = await store.dispatch(
      getListPengaduan({
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0],
        "CSTM-UPN": sessionData.user.UserPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": query.pageNumber || 1,
        "X-ORDERBY": "id desc",
      })
    );

    return {
      props: {
        sessionData,
        query: ctx.query,
        data: response.data,
        token: sessionData.user.token,
      },
    };
  }
);

export default Pengaduan;
