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
    Button,
    Card
} from 'reactstrap';
import Label from "reactstrap/lib/Label";
import ModalAddPhoto from "components/Mobile_version/modal/ModalAddPhoto";
import { confirmAlertNotification } from "components/notification";
import ModalSearchTools from "components/Mobile_version/modal/ModalSearchTools";
import Inventory from "components/Mobile_version/inventory/ImageInventory";
import DatePicker from "react-datepicker";
import {
    Calendar,
    Plus,
    Trash
} from 'react-feather';
import { getDetailInventory } from "helpers/inventory";
import { getRoleUser } from "helpers/auth";
import ParameterData from "components/Mobile_version/inventory/ParameterDataInventory";
import Select from "react-select";
import ParameterDataInventory from "components/Mobile_version/inventory/ParameterDataInventory";
import { selectThemeColors } from "src/utility/Utils";
import JenisPeralatanInventory from "components/Mobile_version/inventory/JenisPeralatanInventory";

const Update = ({ data }) => {
    console.log(data);
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
  const style5 = {
    borderRadius: 10,
    backgroundColor: '#46a583',
    height: 48,
    width: '30%',
    // margin: 'auto',
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
    placeItems: 'center',
    fontSize: 14,
    fontWeight: 600,
    display: 'flex',
    gap: 10
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
                onSubmit={(file) => {
                    console.log(file);
                    data.inventoryDetailGambar.push({
                        nama: file.name,
                        image: file.file,
                        isNew: true
                    });
                    setVisibleAddPhoto(false);
                    forceUpdate();
                }}
            />
        }
        <HeaderHomeMobile title="UPDATE INVENTORY" onBack={() => router.back()} />
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
                    <p>{data.nomorPeralatan}</p>
                </div>
                <div style={style}>
                    <p>{data.nomorPeralatan}</p>
                </div>
                <div style={style}>
                    <p>{data.jenisPeralatan}</p>
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
                    value={data.lokasi}
                    onChange={(e) => {
                        data.lokasi = e.target.value;
                        forceUpdate();
                    }}
                />
            </div>
            <div className="mt-1">
                <Label className="form-label">
                    Area{" "}
                </Label>
                <Input
                    type="text"
                    name="text"
                    id="exampleText"
                    placeholder="text"
                    value={data.area}
                    onChange={(e) => {
                        data.area = e.target.value;
                        forceUpdate();
                    }}
                />
            </div>
            <div className="mt-1">
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
                        value={data.periodePengecekan}
                        onChange={(e) => {
                            data.periodePengecekan = e.target.value;
                            forceUpdate();
                        }}
                    />
                    <Label style={{paddingTop: 10, minWidth: '30%'}}>bulan sekali</Label>
                </div>
            </div>
            <div className="mt-1">
                <Label className="form-label">
                Tanggal Pengecekan{" "}
                </Label>
                <div className="form-control d-flex justify-content-between align-items-center pl-0">
                    <DatePicker
                        placeholderText="Placeholder"
                        dateFormat="dd MMM yyyy"
                        showMonthDropdown
                        showYearDropdown
                        selected={new Date(data.tanggalPengecekan)}
                        dropdownMode="select"
                        className="form-control w-100 border-left-0 border-right-0"
                    />
                    <div className="mx-50"></div>
                    <Calendar size={18} />
                </div>
            </div>
            {
                data.jenisPeralatan === "APAR" &&
                <>
                    <div className="mt-1">
                        <Label className="form-label">
                        Media{" "}
                        </Label>
                        <div className="d-flex justify-content-between align-items-center pl-0">
                            <Select
                                theme={selectThemeColors}
                                // isClearable={false}
                                className="custom-input-color w-100"
                                classNamePrefix="select"
                                options={[]}
                                placeholder="media"
                            />
                        </div>
                    </div>
                    <div className="mt-1">
                        <Label className="form-label">
                            Merk{" "}
                        </Label>
                        <Input
                            type="text"
                            name="text"
                            id="exampleText"
                            placeholder="text"
                            value={data.area}
                            onChange={(e) => {
                                data.area = e.target.value;
                                forceUpdate();
                            }}
                        />
                    </div>
                    <div className="mt-1">
                        <Label className="form-label">
                            Kapasitas{" "}
                        </Label>
                        <Input
                            type="text"
                            name="text"
                            id="exampleText"
                            placeholder="text"
                            value={data.area}
                            onChange={(e) => {
                                data.area = e.target.value;
                                forceUpdate();
                            }}
                        />
                    </div>
                    <div className="mt-1">
                        <Label className="form-label">
                            Berat{" "}
                        </Label>
                        <Input
                            type="text"
                            name="text"
                            id="exampleText"
                            placeholder="text"
                            value={data.area}
                            onChange={(e) => {
                                data.area = e.target.value;
                                forceUpdate();
                            }}
                        />
                    </div>
                    <div className="mt-1">
                        <Label className="form-label">
                        Tgl ED Tabung{" "}
                        </Label>
                        <div className="form-control d-flex justify-content-between align-items-center pl-0">
                            <DatePicker
                                placeholderText="Placeholder"
                                dateFormat="dd MMM yyyy"
                                showMonthDropdown
                                showYearDropdown
                                selected={new Date(data.tanggalPengecekan)}
                                dropdownMode="select"
                                className="form-control w-100 border-left-0 border-right-0"
                            />
                            <div className="mx-50"></div>
                            <Calendar size={18} />
                        </div>
                    </div>
                </>
            }
        </div>
        {
            data.jenisPeralatan === "SPILL KIT" ||
            data.jenisPeralatan === "APD" ||
            data.jenisPeralatan === "Hydrant" &&
            <>
                <div className="mx-2 my-2" style={{
                    borderRadius: 10,
                    backgroundColor: '#46a583',
                    height: 48,
                    maxWidth: '50%',
                    // margin: 'auto',
                    marginTop: 20,
                    textAlign: 'center',
                    color: 'white',
                    placeItems: 'center',
                    fontSize: 14,
                    fontWeight: 600,
                    display: 'flex',
                    gap: 10,
                    // width: '100%'
                }}
                    onClick={() => {
                        data.inventoryDetailJenis.push({
                            jenis: "",
                            jumlah: "",
                            isNew: true
                        });
                        forceUpdate();
                    }}
                >
                    <Plus className="ml-1" width={15} />
                    <p style={{paddingTop: 15}}>
                        Jenis {data.jenisPeralatan}
                    </p>
                </div>
                <JenisPeralatanInventory 
                    data={data.inventoryDetailJenis} 
                    handleDelete={(index) => {
                        data.inventoryDetailJenis.splice(index, 1);
                        forceUpdate();
                    }}
                />
            </>
        }
        <div className="mx-2 my-2" style={style5}
            onClick={() => {
                data.inventoryDetailParameter.push({
                    nama: "",
                    keterangan: "",
                    isNew: true
                });
                forceUpdate();
            }}
        >
            <Plus className="ml-1" width={15} />
            <p style={{paddingTop: 15}}>
                Parameter
            </p>
        </div>
        <ParameterDataInventory 
            data={data.inventoryDetailParameter} 
            handleDelete={(index) => {
                data.inventoryDetailParameter.splice(index, 1);
                forceUpdate()
            }}
        />
        <div className="mt-1">
            <h6 className="mx-2">Gambar Inventory</h6>
            <Inventory 
                data={data.inventoryDetailGambar} 
                onDelete={(index) => {
                    data.inventoryDetailGambar.splice(index, 1);
                    forceUpdate()
                }} 
                onAddImage={() => setVisibleAddPhoto(true)}
            />
        </div>
        <div style={style4}
            onClick={() => 
                confirmAlertNotification("Konfirmasi submit inventory", "Apakah anda yakin submit inventory?",
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
    const { id } = ctx.query;

    if (!sessionData) {
      return {
        redirect: {
          destination: "/auth",
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
        const roleUser = await getRoleUser(email);
        const firstData = roleUser.data[0];
        payload = {
            "CSTM-COMPID": firstData.companyCode,
            "CSTM-NAME": firstData.name,
            "CSTM-EMAIL": firstData.email,
            "CSTM-ROLE": firstData.roleCode,
            "CSTM-UPN": firstData.userPrincipalName,
            "X-PAGINATION": true,
            "X-PAGE": 1,
            "X-PAGESIZE": 5,
            "X-ORDERBY": "CreatedBy",
            "X-DEEPSEARCH": false
        }
        const response = await getDetailInventory(sessionData.user.token, payload, id);
        fetchData = response;
    } else {
        const { Name, Email, token } = sessionData.user;
        payload = {
            "CSTM-NAME": Name,
            "CSTM-EMAIL": Email,
            "CSTM-ROLE": "HSSE-USR",
            "CSTM-UPN": Email,
            "X-PAGINATION": true,
            "X-PAGE": 1,
            "X-PAGESIZE": 5,
            "X-ORDERBY": "CreatedBy",
            "X-DEEPSEARCH": false
        }
        const response = await getDetailInventory(sessionData.user.token, payload, id);
        fetchData = response;
    }


    return {
      props: { 
        userRoles: sessionData,
        query: ctx.query,
        data: fetchData
      },
    };
  }
);

export default Update;
