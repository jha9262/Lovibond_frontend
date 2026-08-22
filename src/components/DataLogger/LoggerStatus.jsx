import React from 'react';
import { LoaderIcon } from 'react-hot-toast';

const LoggerStatus = ({ loading, time, serialNo, macAddress, wifiStrength }) => {
    const statusItems = [
        {label: 'WIFI STRENGTH', value: wifiStrength},
        { label: 'DATA COLLECTOR SERIAL NO', value: serialNo },
        { label: 'DATA COLLECTOR MAC', value: macAddress },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {statusItems.map((item) => (
                <div key={item.label} className="bg-white border border-industrial-200 rounded-xl p-4 shadow-industrial-sm">
                    <p className="text-[10px] font-bold text-industrial-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-black text-industrial-900 truncate">
                        {loading ? <LoaderIcon className="w-3 h-3" /> : (item.value || 'NA')}
                    </p>
                </div>
            ))}
            <div className="bg-industrial-900 border border-black rounded-xl p-4 shadow-industrial-md">
                <p className="text-[10px] font-bold text-industrial-300 uppercase tracking-widest mb-1">TIME</p>
                <p className="text-sm font-black text-white">
                    {loading ? <LoaderIcon className="w-3 h-3" /> : (time || 'NA')}
                </p>
            </div>
        </div>
    );
};

export default LoggerStatus;
