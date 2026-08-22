import React, { useReducer, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formReducer, initialFormState } from "../reducer/formReducer";
import { Button } from "../components/ui";
import { getLoggerConfig, updateLoggerConfig } from "../services/deviceService";
import LoadingIcon from "../components/LoadingIcon";
import WifiScanRate from "../components/WifiScanRate";

// Sub-components
import LoggerStatus from "../components/DataLogger/LoggerStatus";
import WiFiConfiguration from "../components/DataLogger/WiFiConfiguration";
import ProtocolSettings from "../components/DataLogger/ProtocolSettings";
import StorageSettings from "../components/DataLogger/StorageSettings";

import { Box } from "@mui/material";

function Datalogger({ isEmbedded = false }) {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [showWifiScan, setShowWifiScan] = useState(false);
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [macAddress, setMacAddress] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputsEnabled, setInputsEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [time, setTime] = useState("N/A");
  const [dcnIP, setDcnIp] = useState("");
  const [dataStorageRate, setDataStoarageRate] = useState("");

  const { formData, formErrors } = state;

  const handleDropdownSelect = (field, selectedValue) => {
    dispatch({ type: "UPDATE_FIELD", payload: { field, value: selectedValue } });
  };

  const secondsConverter = (value_to_convert) => {
    const h = Math.floor(value_to_convert / 3600);
    const m = Math.floor((value_to_convert % 3600) / 60);
    const s = value_to_convert % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  };

  const isFormValid = () => {
    return !Object.values(formData).some(value => value === "");
  };

  const fetchDataLoggerForm = async () => {
    try {
      setLoading(true);
      const res = await getLoggerConfig();

      const info = res?.DEVICE_LOGGER_INFORMATION;
      if (info) {
        secondsConverter(info.DEVICE_STORAGE_RATE);
        dispatch({
          type: "SET_FORM_DATA",
          payload: {
            dataCollectorName: info.DEVICE_NAME || "",
            baudRate: info.DEVICE_BAUD_RATE,
            parity: info.DEVICE_PARITY,
            dataBits: info.DEVICE_DATA_BITS,
            dataStorageCount: info.DEVICE_STORAGE_COUNT,
            stopBits: info.DEVICE_STOP_BITS,
            protocol: info.DEVICE_PROTOCOL,
            scanRate: info.DEVICE_SCAN_RATE || "",
            stationIp: info.WIFI_STA_IP_STR || "N/A",
            localIp: info.WIFI_AP_IP_STR || "N/A",
            wifiStrength: info.WIFI_STRENGTH
          },
        });
        setMacAddress(info.MAC_ADDRESS || "NA");
        setSerialNo(info.SERIAL_NUMBER || "NA");
        setWifiSSID(info.WIFI_SSID || "");
        setWifiPassword(info.WIFI_PASSWORD || "");
        setTime(info.DATE_TIME || "N/A");
        setDcnIp(info.DCN_IP_ADDRESS || "N/A");
      }
      toast.success(`DATA FETCHED SUCCESSFULLY`);
    } catch (error) {
        toast.error(error || "LOGGER DATA NOT AVAILABLE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataLoggerForm();
  }, []);

  const getISTDateTime = (mode = "formatted") => {
    const now = new Date();
    if (mode === "formatted") {
      const options = { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" };
      const dateStr = now.toLocaleDateString("en-GB", options);
      const timeStr = now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true });
      return { date: dateStr, time: timeStr };
    }
    const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    return istNow.toISOString().split(".")[0];
  };

  const handleInputChange = (e) => {
    const { id, value, name } = e.target;
    dispatch({ type: "UPDATE_FIELD", payload: { field: id || name, value } });
  };

  const handleSubmit = async () => {
    const toastId = toast.loading("SUBMITTING PLEASE WAIT...");
    const dt = getISTDateTime("formatted");
    const iso = getISTDateTime("iso");

    setIsSubmitting(true);
    try {
      const DATA = {
        DEVICE_LOGGER_INFORMATION: {
          CREATE_TIME: dt.time,
          CREATE_DATE: dt.date,
          DATE_TIME: iso,
          DEVICE_NAME: formData.dataCollectorName,
          DEVICE_PARITY: formData.parity,
          DEVICE_BAUD_RATE: formData.baudRate,
          DEVICE_STORAGE_COUNT: formData.dataStorageCount,
          DEVICE_DATA_SCAN_RATE: formData.scanRate,
          DEVICE_STOP_BITS: formData.stopBits,
          DEVICE_STORAGE_RATE: String(dataStorageRate),
          DEVICE_DATA_BITS: formData.dataBits,
          DEVICE_PROTOCOL: formData.protocol,
        },
      };

      const response = await updateLoggerConfig(DATA);
      toast.success(response || "SUCCESS", { id: toastId });
      setInputsEnabled(false);
      setShowPassword(false);
    } catch (error) {
      toast.error(error || "SUBMISSION FAILED", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeChange = (setter, value) => {
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setter(value);
      updateStorageRate(value, setter);
    }
  };

  const updateStorageRate = (value, setter) => {
    let h = setter === setHours ? parseInt(value) || 0 : parseInt(hours) || 0;
    let m = setter === setMinutes ? parseInt(value) || 0 : parseInt(minutes) || 0;
    let s = setter === setSeconds ? parseInt(value) || 0 : parseInt(seconds) || 0;
    if (m >= 60 || s >= 60) return;
    setDataStoarageRate(h * 3600 + m * 60 + s);
  };

  if (loading && !formData.dataCollectorName) return <LoadingIcon />;

  return (
    <div className={isEmbedded ? "" : "min-h-screen bg-industrial-50 p-6 lg:p-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"}>
      <div className={isEmbedded ? "" : "max-w-[1400px] mx-auto"}>
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          {!isEmbedded && (
            <div>
              <h1 className="text-2xl font-black text-industrial-900 tracking-tight uppercase">
                DATA COLLECTOR CONFIGURATION
              </h1>
              <p className="text-industrial-500 text-sm mt-1">Manage data acquisition and network parameters</p>
            </div>
          )}
          <div className={`flex gap-4 ${isEmbedded ? "w-full justify-end" : ""}`}>
            <Button
              variant="secondary"
              icon={() => <span className="mr-2">↺</span>}
              label="SYNC HARDWARE"
              onClick={fetchDataLoggerForm}
            />
            <Button
              variant="primary"
              label={isSubmitting ? "Processing..." : "SUBMIT"}
              onClick={handleSubmit}
              disabled={ isSubmitting }
            />
          </div>
        </header>

        <LoggerStatus
          loading={loading}
          dcnIP={dcnIP}
          time={time}
          serialNo={serialNo}
          macAddress={macAddress}
          wifiStrength={formData.wifiStrength}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <WiFiConfiguration
              wifiSSID={wifiSSID}
              setWifiSSID={setWifiSSID}
              wifiPassword={wifiPassword}
              setWifiPassword={setWifiPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              inputsEnabled={inputsEnabled}
              setInputsEnabled={setInputsEnabled}
              stationIp={formData.stationIp}
              localIp={formData.localIp}
              wifiStrength = {formData.wifiStrength}
              onScanWifi={() => setShowWifiScan(true)}
            />
            <ProtocolSettings
              formData={formData}
              onDropdownSelect={handleDropdownSelect}
            />
          </div>

          <div className="space-y-8">
            <StorageSettings
              formData={formData}
              handleInputChange={handleInputChange}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
              onTimeChange={handleTimeChange}
              setHours={setHours}
              setMinutes={setMinutes}
              setSeconds={setSeconds}
              errors={formErrors}
            />
          </div>
        </div>
      </div>

      {showWifiScan && (
        <WifiScanRate
          wifiSSID={wifiSSID}
          wifiPassword={wifiPassword}
          setWifiSSID={setWifiSSID}
          onClose={() => setShowWifiScan(false)}
          setWifiPassword={setWifiPassword}
          onSelectSSID={(ssid) => {
            setWifiSSID(ssid);
            setShowWifiScan(false);
          }}
        />
      )}
    </div>
  );
}

export default Datalogger;

