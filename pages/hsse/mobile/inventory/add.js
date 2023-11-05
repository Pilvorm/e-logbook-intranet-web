import React, { useEffect, useState, useReducer } from "react";
import { getSession } from "next-auth/react";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { useRouter } from "next/router";
import useMobileDetector from "components/useMobileDetector"
import HeaderHomeMobile from "components/Header-home-mobile/HeaderHomeMobile";
import Carousel from "components/Carousel";
import Image from "next/image";
import {
    Input,
} from 'reactstrap';
import Label from "reactstrap/lib/Label";
import ModalAddPhoto from "components/Mobile_version/modal/ModalAddPhoto";
import { confirmAlertNotification } from "components/notification";
import ModalSearchTools from "components/Mobile_version/modal/ModalSearchTools";
import Inventory from "components/Mobile_version/inventory/ImageInventory";
import DatePicker from "react-datepicker";
import {
    Calendar,
    Search
} from 'react-feather';


const Update = ({ userRoles, query }) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const router = useRouter();
  const style = {borderBottom: '2px solid #ebe9f2', marginTop: 5};
  const style4 = {
    borderRadius: 10,
    backgroundColor: '#46a583',
    height: 48,
    width: '90%',
    margin: 'auto',
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
    placeItems: 'center',
    fontSize: 14,
    fontWeight: 600,
  };

  const isMobileWidth = useMobileDetector();
  const [isMobileDevice, setIsMobileDevice] = useState(isMobileWidth);
  const [visibleAddPhoto, setVisibleAddPhoto] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [noPengaduanSelected, setNoPengaduanSelected] = useState(false);
  const [arrPhotoDummy, setArrPhotoDummy] = useState([
    {
        name: "APAR TIANG",
        image: require("../../../../public/icons/apar_tiang.png")
    },
    {
        name: "APAR",
        image: require("../../../../public/icons/apar.png")
    },
  ]);

  useEffect(() => {
    if (isMobileWidth) {
        setIsMobileDevice(true);
    } else {
      router.push('/home')
    }
  }, [isMobileWidth]);

  return (
    <>
    {
      isMobileWidth ?
      <div>
        {
            modalSearch &&
            <ModalSearchTools 
                isOpen={modalSearch}
                toggle={(bool) => setModalSearch(bool)}
                onConfirm={(data) => {
                    setNoPengaduanSelected(data)
                }}
            />
        }
        {
            visibleAddPhoto && 
            <ModalAddPhoto 
                isOpen={visibleAddPhoto} 
                setIsOpen={(bool) => setVisibleAddPhoto(bool)} 
                onSubmit={(data) => {
                    console.log(data);
                    arrPhotoDummy.push({
                        name: data.name,
                        image: data.file,
                        isNew: true
                    });
                    setVisibleAddPhoto(false);
                    forceUpdate();
                }}
            />
        }
        <HeaderHomeMobile title="DAFTAR INVENTORY" onBack={() => router.back()} />
        <div style={{
            width: '60%',
            margin: 'auto'
        }}>
            <Carousel child={[
                <div>
                    <Image src={require("../../../../public/icons/apar_tiang.png")} style={{marginTop: 10, objectFit: 'cover',}} />
                </div>
            ]} />
        </div>
        <div className="d-flex"
            style={{
                width: '90%',
                margin: 'auto',
                gap: 10
            }}
        >
            <div style={{width: '48%'}}>
                <div style={style}>
                    <p>Nomor Dokumen</p>
                </div>
                <div style={style}>
                    <p>Nomor Peralatan</p>
                </div>
                <div style={style}>
                    <p>Jenis Peralatan</p>
                </div>
            </div>
            <div style={{width: '48%'}}>
                <div style={style}>
                    <p>001/UINV/DF/23</p>
                </div>
                {/* <div style={style}>
                    <p>0001/HDT/DF</p>
                </div> */}
                <div style={{
                        borderBottom: '2px solid #ebe9f2', marginTop: 5, color: 'black', fontWeight: '600', height: 37, textAlignLast: noPengaduanSelected ? "start" : "end"
                    }}>
                    {
                        noPengaduanSelected ?
                        <div className="d-flex justify-content-between">
                            <p>{noPengaduanSelected.no}</p>
                            <Search className="mr-1"
                                onClick={() => setModalSearch(true)}
                            />
                        </div>
                        :
                        <Search className="mr-1"
                            onClick={() => setModalSearch(true)}
                        />
                    }
                </div>
                <div style={style}>
                    <p>HYDRANT</p>
                </div>
            </div>
        </div>
        <div className="mt-1" style={{
                width: '90%',
                margin: 'auto',
                gap: 10
            }}>
            <div>
                <Label className="form-label">
                    Lokasi{" "}
                </Label>
                <Input
                    type="text"
                    name="text"
                    id="exampleText"
                    placeholder="text"
                />
            </div>
            <div>
                <Label className="form-label">
                    Area{" "}
                </Label>
                <Input
                    type="text"
                    name="text"
                    id="exampleText"
                    placeholder="text"
                />
            </div>
            <div>
                <Label className="form-label">
                Periode Pengecekan{" "}
                </Label>
                <div className="d-flex" style={{width: '95%', gap: 20}}>
                    <Input 
                        type="text"
                        name="text"
                        id="exampleText"
                        placeholder="3"
                        className="text-right"
                        style={{
                            maxWidth: '70%'
                        }}
                    />
                    <Label style={{paddingTop: 10, minWidth: '30%'}}>bulan sekali</Label>
                </div>
            </div>
            <div>
                <Label className="form-label">
                Tanggal Pengecekan{" "}
                </Label>
                <div className="form-control d-flex justify-content-between align-items-center pl-0">
                    <DatePicker
                        placeholderText="Placeholder"
                        dateFormat="dd MMM yyyy"
                        showMonthDropdown
                        showYearDropdown
                        selected={new Date()}
                        dropdownMode="select"
                        className="form-control w-100 border-left-0 border-right-0"
                    />
                    <div className="mx-50"></div>
                    <Calendar size={18} />
                </div>
            </div>
        </div>
        <div className="mt-1">
            <Inventory data={arrPhotoDummy} onDelete={() => {
                arrPhotoDummy.splice(index, 1);
                forceUpdate()
            }} />
        </div>
        <div
            style={{
                width: '90%',
                margin: 'auto',
            }}
            className="mt-2"
        >
            <Label>Keterangan</Label>
            <Input
                style={{ minHeight: 100 }}
                type="textarea"
                name="text"
                id="exampleText"
                rows="3"
                placeholder="Textarea"
            />
        </div>
        <div style={style4}
            onClick={() => 
                confirmAlertNotification("Konfirmasi submit inspeksi", "Apakah anda yakin submit pengaduan?",
                () => {}
                )
            }
        >
            <p style={{paddingTop: 15}}>
                SUBMIT
            </p>
        </div>
        <div style={{height: 20}} />
      </div>
      :
        <div>
        </div>
    }
    </>
  );
};

Update.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    return {
      props: { 
        userRoles: sessionData,
        query: ctx.query
      },
    };
  }
);

export default Update;
