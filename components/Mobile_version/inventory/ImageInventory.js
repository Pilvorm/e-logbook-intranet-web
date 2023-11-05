import React from 'react';
import Image from 'next/image';
import {
    Trash, Plus,
} from 'react-feather';

const Inventory = ({
    data, onDelete, onAddImage
}) => {

    return (
        <>
        {
            data.map((item, index) => {
                return (
                    <div className="p-1 mt-1 rounded" key={index} style={{borderStyle: "dashed", borderSpacing: 2, color: '#E2E5DE', width: '90%', margin: 'auto'}}>
                        <div className="d-flex justify-content-between">
                            <div className="d-flex">
                                <div style={{width: 24, height: 24, backgroundColor: '#46a583', borderRadius: 50, marginTop: 5}}>
                                    <p style={{textAlign: 'center', color: 'white', fontWeight: 700, paddingTop: 3}}>{index + 1}</p>
                                </div>
                                <div className="ml-1 d-flex" style={{gap: 20}} >
                                    <Image alt={`image ${item.name}`} src={item.isNew ? {uri: item.image} : item.image} width={41} height={36} />
                                    <h5 style={{paddingTop: 10, fontWeight: 700, color: 'black'}}>{item.nama}</h5>
                                </div>
                            </div>
                            <div className="border cursor-pointer" style={{width: 36, height: 36, borderRadius: 4, borderColor: '#E9E9E9', textAlignLast: 'center'}}>
                                <Trash 
                                    onClick={() => onDelete(index)}
                                    style={{marginTop: 5}} color="#f24f1f" 
                                />
                            </div>
                        </div>
                    </div>
                )
            })
        }
        <div onClick={onAddImage} className="p-1 d-flex mt-1 rounded" style={{borderStyle: "dashed", borderSpacing: 2, color: '#E2E5DE', width: '90%', margin: 'auto'}}>
            <div style={{width: 24, height: 24, backgroundColor: '#46a583', borderRadius: 50,}}>
                    <Plus color="white" />
                </div>
            <h5 className="ml-2" style={{paddingTop: 4, fontWeight: 400, color: 'black'}}>Tambah gambar inventory</h5>
        </div>
        </>
    )
};

export default Inventory;