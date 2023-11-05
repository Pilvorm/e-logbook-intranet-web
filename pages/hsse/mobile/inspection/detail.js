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
import { Trash, Search } from "react-feather";
import { Input } from "reactstrap";
import Label from "reactstrap/lib/Label";
import ModalAddPhoto from "components/Mobile_version/modal/ModalAddPhoto";
import { confirmAlertNotification } from "components/notification";
import ModalSearchTools from "components/Mobile_version/modal/ModalSearchTools";
import ContentInspection from "components/Mobile_version/inspection/ContentInspection";
import { getInspectionById } from "helpers/inspection";
import moment from "moment";

const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
});

const DetailInspection = ({ userRoles, query, data }) => {
  console.log(data, "<<<");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
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
    width: "25%",
    marginTop: 20,
    textAlign: "center",
    color: "white",
    placeItems: "start",
    fontSize: 14,
    fontWeight: 600,
  };
  const style4 = {
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
  const [visibleAddPhoto, setVisibleAddPhoto] = useState(false);
  const [visibleSeeMore, setVisibleSeeMore] = useState(false);
  const [labelSeeMore, setLabelSeeMore] = useState("See More");
  const [modalSearch, setModalSearch] = useState(false);
  const [noPengaduanSelected, setNoPengaduanSelected] = useState({ no: 1 });
  const [toolsType, setToolsType] = useState({
    name: "APAR",
    data: [
      {
        name: "Pressure / Tekanan",
      },
      {
        name: "Segel Pin / Seal",
      },
      {
        name: "Hose / Nozzle",
      },
      {
        name: "Tabung",
      },
      {
        name: "Head Grip",
      },
      {
        name: "Pin",
      },
      {
        name: "Berat",
      },
    ],
  });
  const [arrPhotoDummy, setArrPhotoDummy] = useState([
    {
      name: "APAR TIANG",
      image: require("../../../../public/icons/apar_tiang.png"),
    },
    {
      name: "APAR",
      image: require("../../../../public/icons/apar.png"),
    },
  ]);

  useEffect(() => {
    if (isMobileWidth) {
      setIsMobileDevice(true);
    } else {
      router.push("/home");
    }
  }, [isMobileWidth]);

  const handleAdd = () => {
    data?.parameterInspeksi?.push({
      catatan: "string",
      createdBy: "Anonymous",
      createdByName: "Anonymous",
      createdDate: "2023-08-24T13:24:58.409108",
      hsseOnlineInspeksiId: 2,
      id: 2,
      isDeleted: false,
      keteranganCAPA: "string",
      lampiranCAPAParameterInspeksi: [],
      lampiranParameterInspeksi: [],
      namaParameter: "string",
      statusIsOk: true,
      tindakLanjutCAPA: "string",
      updatedBy: null,
      updatedByName: null,
      updatedDate: null,
      isNew: true,
    });
    forceUpdate();
  };

  const handleDelete = (index) => {
    data?.parameterInspeksi?.splice(index, 1);
    forceUpdate();
  };

  return (
    <>
      {isMobileWidth ? (
        <div>
          {visibleAddPhoto && (
            <ModalAddPhoto
              isOpen={visibleAddPhoto}
              setIsOpen={(bool) => setVisibleAddPhoto(bool)}
              onSubmit={(data) => {
                console.log(data);
                arrPhotoDummy.push({
                  name: data.name,
                  image: data.file,
                  isNew: true,
                });
                setVisibleAddPhoto(false);
                forceUpdate();
              }}
            />
          )}
          <HeaderHomeMobile title="INSPEKSI" onBack={() => router.back()} />
          <div
            style={{
              width: "60%",
              margin: "auto",
            }}
          >
            <Carousel
              child={[
                <div>
                  <Image
                    src={require("../../../../public/icons/apar_tiang.png")}
                    style={{ marginTop: 10, objectFit: "cover" }}
                  />
                </div>,
              ]}
            />
          </div>
          <div
            className="d-flex"
            style={{
              width: "90%",
              margin: "auto",
              gap: 10,
            }}
          >
            <div style={{ width: "48%" }}>
              <div style={style}>
                <p>Nomor Inspeksi</p>
              </div>
              <div style={style}>
                <p>Nomor Peralatan</p>
              </div>
              <div style={style}>
                <p>Jenis Peralatan</p>
              </div>
              <div style={style}>
                <p>Lokasi</p>
              </div>
            </div>
            <div style={{ width: "48%" }}>
              <div style={style2}>
                <p>{data.nomorInspeksi}</p>
              </div>
              <div style={style2}>
                <p>{data.nomorPeralatan}</p>
              </div>
              <div style={style2}>
                <p>{data.jenisPeralatan}</p>
              </div>
              <div style={style2}>
                <p>{data.area}</p>
              </div>
            </div>
          </div>
          {visibleSeeMore && (
            <>
              <div
                className="d-flex"
                style={{
                  width: "90%",
                  margin: "auto",
                  gap: 10,
                }}
              >
                <div style={{ width: "48%" }}>
                  <div style={style}>
                    <p>Media</p>
                  </div>
                  <div style={style}>
                    <p>Merk</p>
                  </div>
                  <div style={style}>
                    <p>Berat</p>
                  </div>
                  <div style={style}>
                    <p>Kapasitas</p>
                  </div>
                  <div style={style}>
                    <p>Tgl ED Tabung</p>
                  </div>
                </div>
                <div style={{ width: "48%" }}>
                  <div style={style2}>
                    <p>{data.media}</p>
                  </div>
                  <div style={style2}>
                    <p>{data.merk}</p>
                  </div>
                  <div style={style2}>
                    <p>{data.berat}</p>
                  </div>
                  <div style={style2}>
                    <p>{data.kapasitas}</p>
                  </div>
                  <div style={style2}>
                    <p>
                      {moment(data.tglEDTabung).format("DD MMM YYYY HH:MM")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          <div>
            <h6
              onClick={() => {
                setVisibleSeeMore(!visibleSeeMore);
                if (!visibleSeeMore) {
                  setLabelSeeMore("See Less");
                } else {
                  setLabelSeeMore("See More");
                }
              }}
              className="text-center mt-1"
              style={{
                textDecoration: "underline",
                color: "#46A583",
              }}
            >
              {labelSeeMore}
            </h6>
          </div>
          <div className="mt-2">
            <ContentInspection
              handleAdd={() => handleAdd()}
              handleDelete={handleDelete}
              data={data?.parameterInspeksi}
              arrPhotoDummy={arrPhotoDummy}
              handleChange={(e, index) => {
                toolsType.data[index].name = e.target.value;
                forceUpdate();
              }}
            />
          </div>
          <div style={{ height: 20 }} />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

DetailInspection.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const sessionData = await getSession(ctx);
    const { query } = ctx;
    console.log(query);
    let dataApi = [];

    if (!sessionData) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    if (query.id) {
      const fetchData = await getInspectionById(
        sessionData.user.token,
        query.id
      );
      console.log(fetchData, "detail <<<<");
      dataApi = fetchData;
    }

    return {
      props: {
        userRoles: sessionData,
        query: ctx.query,
        data: dataApi,
      },
    };
  }
);

export default DetailInspection;
