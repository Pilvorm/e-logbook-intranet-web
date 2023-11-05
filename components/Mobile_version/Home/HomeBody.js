import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
const HomeBody = ({
    modules
}) => {
    console.log(modules);
    const router = useRouter();

    return (
        <div className="d-flex"
            style={{
                gap: 40,
                flexWrap: 'wrap',
                width: '90%',
                margin: 'auto',
                marginTop: 90
            }}
        >
            {
                modules.map((item, index) => {
                    return (
                    <div key={index} onClick={() => router.push(item.moduleUrl)}>
                        <div key={index} 
                            style={{
                                borderRadius: 10,
                                backgroundColor: '#46a583',
                                height: 80,
                                width: 80,
                                color: 'white',
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: -35
                            }}
                            >
                                {item.icon}
                        </div>
                        <p style={{paddingTop: 2, fontSize: 12, textAlign: 'center', maxWidth: 80, color: 'black'}}>
                            {item.moduleName}
                        </p>
                    </div>
                )})
            }
            <div>
            </div>
        </div>
    )
};

export default HomeBody;