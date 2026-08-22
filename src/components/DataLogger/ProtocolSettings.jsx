import React from 'react';
import { Card, Select } from '../ui';

const ProtocolSettings = ({ formData, onDropdownSelect }) => {
    const protocolOptions = ["MODBUS_RTU", "MODBUS_ASCII"];
    const baudRateOptions = ["2400", "4800", "9600", "19200", "38400", "57600", "115200"];
    const parityOptions = ["ODD", "EVEN", "NONE"];
    const stopBitsOptions = ["1", "2"];
    const dataBitsOptions = ["5", "6", "7", "8"];

    return (
        <Card title="SELECT PROTOCOL" subtitle="Define serial bus parameters for downstream devices">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="PROTOCOL"
                    value={formData.protocol}
                    onChange={(e) => onDropdownSelect("protocol", e.target.value)}
                    options={protocolOptions}
                    placeholder="SELECT PROTOCOL"
                />
                <Select
                    label="BAUD RATE"
                    value={formData.baudRate}
                    onChange={(e) => onDropdownSelect("baudRate", e.target.value)}
                    options={baudRateOptions}
                    placeholder="SELECT BAUD RATE"
                />
                <Select
                    label="PARITY"
                    value={formData.parity}
                    onChange={(e) => onDropdownSelect("parity", e.target.value)}
                    options={parityOptions}
                    placeholder="SELECT PARITY"
                />
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="STOP BITS"
                        value={formData.stopBits}
                        onChange={(e) => onDropdownSelect("stopBits", e.target.value)}
                        options={stopBitsOptions}
                        placeholder="STOP"
                    />
                    <Select
                        label="DATA BITS"
                        value={formData.dataBits}
                        onChange={(e) => onDropdownSelect("dataBits", e.target.value)}
                        options={dataBitsOptions}
                        placeholder="DATA"
                    />
                </div>
            </div>
        </Card>
    );
};

export default ProtocolSettings;
