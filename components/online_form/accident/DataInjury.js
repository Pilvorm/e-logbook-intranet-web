import React, {useState} from 'react';
import {
    Label,
    Input
} from 'reactstrap';
import Checkbox from '@mui/material/Checkbox';
import Select from "react-select";

const DataInjury = ({
data, forceUpdate, lainnya, setLainnya, dataValue,
normalInjury, heavyInjury
}) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const dropdownOptions = [
        {label: "Tidak Cedera", value: "Tidak Cedera"},
        {label: "Cedera Sedang", value: "Cedera Sedang"},
        {label: "Cedera Berat", value: "Cedera Berat"},
        {label: "Meninggal Dunia / Fatality", value: "Meninggal Dunia / Fatality"},
    ];

    const [cederaSedangDummy] = useState([
        {
            name: "Patah ulang / retak",
            isChecked: false
        },
        {
            name: "Luka robek / tersayat dalam / tertusuk dalam",
            isChecked: false
        },
        {
            name: "Luka bakar / iritasi kimia",
            isChecked: false
        },
        {
            name: "Luka iritasi - kemasukan benda asing (mata)",
            isChecked: false
        },
        {
            name: "Terkilir / nyeri otot",
            isChecked: false
        },
        {
            name: "Gegar otak",
            isChecked: false
        },
        {
            name: "Luka bakar - api/panas",
            isChecked: false
        },
        {
            name: "Sesak nafas / gangguan pernafasan",
            isChecked: false
        },
        {
            name: "Cedera lain dengan perawatan medis",
            isChecked: false
        },
    ]);

    const [cederaBeratDummy] = useState([
        {
            name: "Amputasi / Cacat Permanen",
            isChecked: false
        },
        {
            name: "Keracunan",
            isChecked: false
        },
        {
            name: "Kanker / Penyebab penyakit berbahaya lain",
            isChecked: false
        },
    ]);

    const checkedBoolean = {
        "Incomplete": false,
        "Completed": true,
    };

    const [checkedBox, setCheckedBox] = useState(checkedBoolean);


    return (
        <div className="w-100">
            <Label className="form-label">
                <h6>Bagian Tubuh yang terluka{" "}<span style={{ color: "red" }}>*</span></h6>
                
            </Label>
            <div className="d-flex flex-wrap w-100">
                <div style={{width: "25%"}}>
                    {
                        data.map((item, index) => {
                            return (
                                <>
                                {
                                    index !== 2 && (index % 2 === 0) &&
                                    <div key={index} className="d-flex" >
                                        <Checkbox
                                        {...label}
                                        onChange={(e) => {
                                            console.log(e.target);
                                        }}
                                        color="success"
                                        />
                                        <p style={{paddingTop: 12}}>{item.name}</p>
                                    </div>
                                }
                                </>
                            )
                        })
                    }
                </div>
                <div style={{width: "25%"}}>
                    {
                        data.map((item, index) => {
                            return (
                                <>
                                {
                                    index !== 25 && (index % 2 !== 0) &&
                                    <div>
                                        <div key={index} className="d-flex" >
                                            <Checkbox
                                            {...label}
                                            onClick={() => {
                                                item.isChecked = !item.isChecked;
                                                forceUpdate()
                                            }}
                                            color="success"
                                            />
                                            <p style={{paddingTop: 12}}>{item.name}</p>
                                        </div>
                                        {
                                            item.isChecked && item.name === "Lainnya" &&
                                            <div className="px-1">
                                                <Input
                                                    placeholder="lainnya"
                                                    value={lainnya}
                                                    onChange={(e) => setLainnya(e.target.value)}
                                                />
                                            </div>
                                        }
                                    </div>
                                }
                                </>
                            )
                        })
                    }
                </div>
                <div style={{width: "35%"}}>
                    {
                        data.map((item, index) => {
                            return (
                                <>
                                {
                                    index === 2 &&
                                    <div key={index} className="d-flex" >
                                        <p style={{paddingTop: 12}}>{item.name}</p>
                                    </div>
                                }
                                </>
                            )
                        })
                    }
                    <Select
                        classNamePrefix="select"
                        // placeholder=""
                        options={dropdownOptions}
                        placeholder={dataValue.injury}
                        value={dataValue.injury}
                        onChange={(e) => {
                            console.log(e.value);
                            dataValue.injury = e.value;
                            forceUpdate()
                        }}
                    ></Select>
                    {
                        dataValue.injury === "Cedera Sedang" ?
                        <div className="mt-1">
                            <h6 className="text-medium">{dataValue.injury}</h6>
                            {
                                cederaSedangDummy.map((item, index) => {
                                    return (
                                        <div key={index} className="d-flex" >
                                            <Checkbox
                                                {...label}
                                                onChange={(e) => {
                                                    if (e.target.checked === true) {
                                                        normalInjury.push({
                                                            name: item.name
                                                        });
                                                        cederaSedangDummy[index].isChecked = true;
                                                    } else {
                                                        normalInjury.find((a, b) => {
                                                            if (a?.name === item.name) {
                                                                normalInjury.splice(b, 1)
                                                            }
                                                        });
                                                        cederaSedangDummy[index].isChecked = false;
                                                    }
                                                    forceUpdate();
                                                }}
                                                color="success"
                                                checked={item.isChecked ? true : false}
                                            />
                                            <p style={{paddingTop: 12}}>{item.name}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        :
                        dataValue.injury === "Cedera Berat" ?
                        <div className="mt-1">
                            <h6 className="text-medium">{dataValue.injury}</h6>
                            {
                                cederaBeratDummy.map((item, index) => {
                                    return (
                                        <>
                                            <div key={index} className="d-flex" >
                                                <Checkbox
                                                    {...label}
                                                    onChange={(e) => {
                                                        if (e.target.checked === true) {
                                                            heavyInjury.push({
                                                                name: item.name
                                                            })
                                                            item.isChecked = true;
                                                        } else {
                                                            heavyInjury.find((a, b) => {
                                                                if (a?.name === item.name) {
                                                                    heavyInjury.splice(b, 1)
                                                                }
                                                            })
                                                            item.isChecked = false;
                                                        }
                                                        forceUpdate();
                                                    }}
                                                    color="success"
                                                    checked={item.isChecked ? true : false}
                                                />
                                                <p style={{paddingTop: 12}}>{item.name}</p>
                                            </div>
                                            {
                                                item.isChecked && item.name === "Kanker / Penyebab penyakit berbahaya lain" &&
                                                <div>
                                                    <Input 
                                                        placeholder="Kanker / Penyebab penyakit berbahaya lain"
                                                    />
                                                </div>
                                            }
                                        </>
                                    )
                                })
                            }
                        </div>
                        :
                        dataValue.injury === "Meninggal Dunia / Fatality" ?
                        <div>
                        </div>
                        :null
                    }
                </div>
            </div>
        </div>
    )
};

export default DataInjury;