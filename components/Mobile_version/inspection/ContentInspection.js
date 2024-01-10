import React, { useState, useReducer } from "react";
import { Trash } from "react-feather";
import DetailComponent from "./DetailComponent";
import { Input } from "reactstrap";
import ModalAddPhoto from "../modal/ModalAddPhoto";

const ContentInspection = ({ data, handleAdd, handleDelete, handleChange }) => {
  console.log(data);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [visibleAddPhoto, setVisibleAddPhoto] = useState(false);
  const [indexArrayAddPhoto, setIndexArrayAddPhoto] = useState(null);
  const handleAddPhoto = () => {
    if (data[indexArrayAddPhoto]) {
      data[indexArrayAddPhoto].lampiranParameterInspeksi.push({
        createdBy: "Anonymous",
        createdByName: "Anonymous",
        createdDate: "2023-08-24T13:24:58.409109",
        hsseOnlineInspeksi: null,
        hsseOnlineInspeksiId: null,

        idFile: "string",
        isDeleted: false,
        keterangan: "string",
        namaFile: "string",
        namaParameter: "",
        parameterInspeksiId: 2,
        updatedBy: null,
        updatedByName: null,
        updatedDate: null,
      });
    } else {
      data[indexArrayAddPhoto].lampiranCAPAParameterInspeksi.push({
        createdBy: "Anonymous",
        createdByName: "Anonymous",
        createdDate: "2023-08-24T13:24:58.409109",
        hsseOnlineInspeksi: null,
        hsseOnlineInspeksiId: null,
        // id: 2,
        idFile: "string",
        isDeleted: false,
        keterangan: "string",
        namaFile: "string",
        namaParameter: "",
        parameterInspeksiId: 2,
        updatedBy: null,
        updatedByName: null,
        updatedDate: null,
      });
    }
    forceUpdate();
  };
  return (
    <div>
      {visibleAddPhoto && (
        <ModalAddPhoto
          isOpen={visibleAddPhoto}
          setIsOpen={(bool) => setVisibleAddPhoto(bool)}
          onSubmit={() => {
            setVisibleAddPhoto(false);
            handleAddPhoto();
            // forceUpdate();
          }}
        />
      )}
      <div>
        {data?.map((item, index) => (
          <>
            {!item.isNew && (
              <div>
                <div className="mx-2 mt-1 d-flex">
                  <div
                    className="border bg-white rounded mb-1 text-center"
                    style={{ width: 30, height: 30 }}
                  >
                    <Trash
                      onClick={() => handleDelete(index)}
                      width={20}
                      height={20}
                      color="red"
                      style={{ marginTop: 3 }}
                    />
                  </div>
                  <p className="ml-1" style={{ marginTop: 4 }}>
                    {item.namaParameter}
                  </p>
                </div>
                <div className="border mx-2 rounded">
                  <DetailComponent
                    key={index}
                    data={item}
                    setVisibleAddPhoto={(bool) => {
                      setIndexArrayAddPhoto(index);
                      setVisibleAddPhoto(bool);
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ))}
      </div>
      <div
        style={{
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
        }}
        onClick={() => handleAdd()}
      >
        <p style={{ paddingTop: 15 }}>Tambah Parameter</p>
      </div>
      <div>
        {data?.map((item, index) => (
          <>
            {item.isNew && (
              <div>
                <div className="mx-2 mt-1 d-flex">
                  <div
                    className="border bg-white rounded mb-1 text-center"
                    style={{ width: 30, height: 30 }}
                  >
                    <Trash
                      onClick={() => handleDelete(index)}
                      width={20}
                      height={20}
                      color="red"
                      style={{ marginTop: 3 }}
                    />
                  </div>
                  {/* <p className="ml-1" style={{marginTop: 4}}>{item.name}</p> */}
                  <Input
                    placeholder="nama parameter"
                    className="mx-1"
                    style={{ height: 30 }}
                    value={item.name}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="border mx-2 rounded">
                  <DetailComponent
                    key={index}
                    data={item}
                    setVisibleAddPhoto={(bool) => {
                      setIndexArrayAddPhoto(index);
                      setVisibleAddPhoto(bool);
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ))}
      </div>
      <div
        style={{
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
        }}
        onClick={() => handleAdd()}
      >
        <p style={{ paddingTop: 15 }}>Submit</p>
      </div>
    </div>
  );
};

export default ContentInspection;
