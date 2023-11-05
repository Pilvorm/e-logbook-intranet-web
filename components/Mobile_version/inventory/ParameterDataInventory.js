import React, {useReducer} from 'react';
import {
    Card,
    Input,
    Label
} from 'reactstrap';
import {
    Trash
} from 'react-feather';

const ParameterDataInventory = ({
    data, handleDelete
}) => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    return (
        <>
        {
            data.map((item, index) => (
                <Card key={index} className="mx-2">
                    <div>
                        <div className="mx-2 mt-1 d-flex">
                            <div className="border bg-white rounded mb-1 text-center" style={{width: 30, height: 30}}>
                                <Trash onClick={() => handleDelete(index)} width={20} height={20} color="red" style={{marginTop: 3}} />
                            </div>
                            {/* <p className="ml-1" style={{marginTop: 4}}>{item.name}</p> */}
                            
                            <p className="ml-1" style={{
                                color: '#46a583',
                                marginTop: 3
                            }}>Hapus parameter</p>
                        </div>
                        <div className="rounded mr-2">
                            <Label className="mx-1">Nama</Label>
                            <Input 
                                placeholder="nama"
                                className="mx-1"
                                style={{height: 30}}
                                value={item.nama}
                                onChange={(e) => {
                                    item.nama = e.target.value;
                                    forceUpdate()
                                }}
                            />
                        </div>
                        <div className="rounded mr-2 mt-1 mb-1">
                            <Label className="mx-1">Keterangan</Label>
                            <Input 
                                placeholder="keterangan"
                                className="mx-1"
                                style={{height: 30}}
                                value={item.keterangan}
                                onChange={(e) => {
                                    item.keterangan = e.target.value;
                                    forceUpdate()
                                }}
                            />
                        </div>
                    </div>
                </Card>
            ))
        }
        </>
    )
};

export default ParameterDataInventory;