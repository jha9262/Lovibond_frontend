import React from 'react';
import { Card, Input, Button } from '../ui';
import { HiOutlineWifi, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineRefresh } from "react-icons/hi";

const WiFiConfiguration = ({
    wifiSSID,
    setWifiSSID,
    wifiPassword,
    setWifiPassword,
    showPassword,
    setShowPassword,
    inputsEnabled,
    setInputsEnabled,
    stationIp,
    localIp,
    onScanWifi,
    wifiStrength
}) => {
    return (
        <Card
            title="WIFI CONFIGURATION"
            subtitle="Configure wireless interface and access credentials"
            footer={
                <div className="flex justify-between items-center w-full">
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-industrial-400">STATION IP</span>
                           <span className="font-mono text-industrial-700">{stationIp || 'NA'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-industrial-400">ACCESS POINT IP</span>
                            <span className="font-mono text-industrial-700">{localIp || 'NA'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-industrial-400">WIFI STRENGTH</span>
                            <span className="font-mono text-industrial-700">{wifiStrength || 'NA'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="enableWifi"
                            checked={inputsEnabled}
                            onChange={(e) => setInputsEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-industrial-300 focus:ring-industrial-900 text-industrial-900"
                        />
                        <label htmlFor="enableWifi" className="text-xs font-bold text-industrial-900 uppercase">ENABLE</label>
                    </div>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="flex gap-2 items-end">
                    <Input
                        label="SSID"
                        placeholder="ENTER SSID"
                        value={wifiSSID}
                        onChange={(e) => setWifiSSID(e.target.value)}
                        disabled={!inputsEnabled}
                        icon={HiOutlineWifi}
                        className="flex-grow"
                    />
                    <Button
                        variant="secondary"
                        className="!p-2.5 h-[42px]"
                        onClick={onScanWifi}
                        disabled={!inputsEnabled}
                        icon={HiOutlineRefresh}
                        label="SCAN WIFI"
                    />
                </div>

                <div className="relative">
                    <Input
                        label="PASSWORD"
                        type={showPassword ? "text" : "password"}
                        placeholder="ENTER PASSWORD"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        disabled={!inputsEnabled}
                        icon={HiOutlineLockClosed}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-[34px] text-industrial-400 hover:text-industrial-600 transition-colors p-1"
                        onClick={() => inputsEnabled && setShowPassword(!showPassword)}
                    >
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default WiFiConfiguration;
