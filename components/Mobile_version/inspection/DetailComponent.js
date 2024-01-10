import React, {useReducer} from "react";
import Image from "next/image";
import { Label, Input, Card } from "reactstrap";
import { Trash } from "react-feather";
import { confirmAlertNotification } from "components/notification";
import { Paper, RadioGroup } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

const DetailComponent = ({ data, setVisibleAddPhoto }) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const style3 = {
    borderRadius: 10,
    backgroundColor: "#46a583",
    height: 40,
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
  return (
    <div className="mt-1">
      <div className="mx-2 mb-1">
        <Label>Status</Label>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          className="d-flex justify-content-between"
          style={{ width: "70%" }}
        >
          <div className="d-flex" style={{ gap: 20 }}>
            <div>
              <Radio checked={data.statusIsOk === true ? true : false} color="success" onChange={() => {
                data.statusIsOk = true;
                forceUpdate()
              }} />
              <Label style={{ paddingTop: 10 }}>OK</Label>
            </div>
            <div>
              <Radio checked={data.statusIsOk === false ? true : false} color="success" onChange={() => {
                data.statusIsOk = false;
                forceUpdate()
              }} />
              <Label style={{ paddingTop: 10 }}>NOT OK</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div
        className="mx-2 mb-1"
        style={style3}
        onClick={() => {setVisibleAddPhoto(true)}}
      >
        <p style={{ paddingTop: 10 }}>+ Foto</p>
      </div>
      {
        data.statusIsOk ?
        data.lampiranParameterInspeksi.map((item, index) => (
          <Paper elevation={2} key={index} className="p-1 border mx-2 mb-1">
              <div className="d-flex justify-content-between w-100">
                <div className="d-flex" style={{gap: 10}}>
                    <div className="bg-success" style={{width: 30, height: 30, borderRadius: 50, alignSelf: 'center', textAlign: 'center',}}>
                        <Label style={{paddingTop: 6, color: 'white'}}>{index + 1}</Label>
                    </div>
                    {/* <Image
                        // src={item.image}
                        src={require("public/icons/apar.png")}
                        width={70}
                        height={70}
                        objectFit="contain"
                    /> */}
                    <div>
                        <p className="text-bold text-black">{item.namaFile}</p>
                    </div>
                </div>
                <div className="mr-1 mt-2">
                    <Trash color="red" />
                </div>
              </div>
          </Paper>
        ))
        :
        data.lampiranCAPAParameterInspeksi.map((item, index) => (
          <Paper elevation={2} key={index} className="p-1 border mx-2 mb-1">
              <div className="d-flex justify-content-between w-100">
                <div className="d-flex" style={{gap: 10}}>
                    <div className="bg-success" style={{width: 30, height: 30, borderRadius: 50, alignSelf: 'center', textAlign: 'center',}}>
                        <Label style={{paddingTop: 6, color: 'white'}}>{index + 1}</Label>
                    </div>
                    {/* <Image
                        src={item.image}
                        width={70}
                        height={70}
                        objectFit="contain"
                    /> */}
                    <div>
                        <p className="text-bold text-black">{item.namaFile}</p>
                    </div>
                </div>
                <div className="mr-1 mt-2">
                    <Trash color="red" />
                </div>
              </div>
          </Paper>
        ))
      }
      <div className="mx-2 mb-1">
        <Label>Catatan</Label>
        <Input
            style={{ minHeight: 100 }}
            type="textarea"
            name="text"
            id="exampleText"
            rows="3"
            placeholder="Textarea"
            value={data.catatan}
            onChange={(e) => {
              data.catatan = e.target.value;
              forceUpdate()
            }}
        />
      </div>
    </div>
  );
};

export default DetailComponent;
