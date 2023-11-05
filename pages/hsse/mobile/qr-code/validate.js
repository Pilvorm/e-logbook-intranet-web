import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { useRouter } from "next/router";
import useMobileDetector from "components/useMobileDetector";
import dynamic from "next/dynamic";
import HeaderHomeMobile from "components/Header-home-mobile/HeaderHomeMobile";
import Carousel from "components/Carousel";
import Image from "next/image";
import { reauthenticate } from "redux/actions/auth";
import { getInventoryByNomorPeralatan } from "redux/actions/inventory";
import Apar from "components/QrCodeHome/Apar";
import JenisLain from "components/QrCodeHome/JenisLain";
import ImageContainer from "components/Mobile_version/Carousel/ImageContainer";
import { fetchImage } from "helpers/shared";
import CustomCarousel from "components/Mobile_version/Carousel/CustomCarousel";
import { getPermissionComponentByRoles } from "helpers/getPermission";
const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
});

const ValidateQr = ({ sessionData, data }) => {
  console.log(data);
  const router = useRouter();
  const style = { borderBottom: "2px solid #ebe9f2", marginTop: 5 };
  const style2 = {
    borderBottom: "2px solid #ebe9f2",
    marginTop: 5,
    color: "black",
    fontWeight: "600",
  };
  const style3 = {
    borderRadius: 10,
    backgroundColor: "#46a583",
    height: 48,
    width: "90%",
    margin: "auto",
    marginTop: 20,
    textAlign: "center",
    color: "white",
    placeItems: "center",
    fontSize: 14,
    fontWeight: 600,
  };

  const isMobileWidth = useMobileDetector();
  const [isMobileDevice, setIsMobileDevice] = useState(isMobileWidth);

  useEffect(() => {
    if (isMobileWidth) {
      setIsMobileDevice(true);
    } else {
      router.push("/home");
    }
  }, [isMobileWidth]);

  return (
    <>
      {isMobileWidth ? (
        <div>
          <HeaderHomeMobile title="HSSE ONLINE" onBack={() => router.back()} />
          <div
            style={{
              width: "75%",
              margin: "auto",
            }}
          >
            <CustomCarousel dataImage={data.inventoryDetailGambar} />
          </div>
          <div className="d-flex justify-content-center">
            <div className="w-100 text-center mx-2">
              <div>
                <div className="d-flex justify-content-between" style={style}>
                  <p className="mr-5 text-left">Nomor Peralatan</p>
                  <strong className="ml-5">{data.nomorPeralatan}</strong>
                </div>
                <div className="d-flex justify-content-between" style={style}>
                  <p className="mr-5 text-left">Jenis Peralatan</p>
                  <strong className="ml-5">{data.jenisPeralatan}</strong>
                </div>
                <div className="d-flex justify-content-between" style={style}>
                  <p className="mr-5 text-left">Lokasi</p>
                  <strong className="ml-5">{data.lokasi}</strong>
                </div>
                <div className="d-flex justify-content-between" style={style}>
                  <p className="mr-5 text-left">Area</p>
                  <strong className="ml-5">{data.area}</strong>
                </div>
                <div className="d-flex justify-content-between" style={style}>
                  <p className="mr-5 text-left">Tanggal Pengecekan Terakhir</p>
                  <strong className="ml-5"></strong>
                </div>
                <div className="d-flex justify-content-between" style={style}>
                  <p className="mr-5 text-left">
                    Tanggal Pengecekan Selanjutnya
                  </p>
                  <strong className="ml-5"></strong>
                </div>
                {data.kodeJenisPeralatan == "APR" && (
                  <Apar style={style} data={data.inventoryDetailApar} />
                )}
                <div className="d-flex justify-content-between" style={style}>
                  <p className="mr-5 text-left">
                    Status
                  </p>
                  <strong className="ml-5">{data.status}</strong>
                </div>
                {(data.kodeJenisPeralatan == "SKT" ||
                  data.jenisPeralatan == "APD") && (
                  <JenisLain
                    data={data.inventoryDetailJenis}
                    jenisPeralatan={data.jenisPeralatan}
                  />
                )}
              </div>
            </div>
          </div>
          <div
            style={style3}
            onClick={() =>
              router.push(`/hsse/mobile/inspeksi/detail/${data.id}`)
            }
          >
            <p style={{ paddingTop: 15 }}>INSPEKSI</p>
          </div>
          {getPermissionComponentByRoles(["HSSE-PIC-CAPA"]) && (
            <div style={style3}>
              <p
                style={{ paddingTop: 15 }}
                onClick={() =>
                  router.push({
                    pathname: "/hsse/mobile/inspeksi/capa",
                    query: {
                      nomorPeralatan: data?.nomorPeralatan,
                    },
                  })
                }
              >
                INPUT CAPA
              </p>
            </div>
          )}
          <div
            style={style3}
            onClick={() =>
              router.push({
                pathname: `/hsse/mobile/pengaduan/detail/${data.id}`,
               
              })
            }
          >
            <p style={{ paddingTop: 15 }}>PENGADUAN</p>
          </div>
          <div style={style3}>
            <p
              style={{ paddingTop: 15 }}
              onClick={() =>
                router.push({
                  pathname: "/mobile/inventory/edit",
                  query: {
                    id: 1,
                  },
                })
              }
            >
              UPDATE DATA INVENTORY
            </p>
          </div>
          <div style={{ height: 20 }} />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

ValidateQr.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const sessionData = await getSession(ctx);
    const { query } = ctx;

    if (!sessionData) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    store.dispatch(reauthenticate(sessionData.user.token));

    try {
      const id = query.nomorPeralatan;

      const response = await store.dispatch(
        getInventoryByNomorPeralatan(encodeURIComponent(id))
      );
      console.log(response);
      return {
        props: {
          sessionData,
          id,
          data: response,
        },
      };
    } catch (e) {
      console.log(e);
    }

    return {
      props: { sessionData },
    };
  }
);

export default ValidateQr;
