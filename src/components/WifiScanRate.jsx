import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import toast, { LoaderIcon } from "react-hot-toast";
import CreatableSelect from "react-select/creatable";
import { validateStaticAndGatewayIP } from "../utils/utilityFunction";
import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../config/index.js";
import { Button } from "./ui";

const WifiScan = ({ onClose, setWifiSSID, setWifiPassword }) => {
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    ssid: "",
    password: "",
    ipType: "DYNAMIC",
    staticIp: "",
    gatewayIp: "",
    retryCount: 10,
    autoSwitching: false,
    networkScanRate: "",
    wifiMode: "",
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle React Select change for SSID
  const handleSSIDChange = (selectedOption) => {
    setFormState((prev) => ({
      ...prev,
      ssid: selectedOption ? selectedOption.value : "",
    }));
  };

  /** 🔹 Fetch saved WiFi configuration */
  const fetchNetworkDetails = async () => {
    try {
      setLoadingConfig(true);
      const response = await axios.get(`${BASE_URL}/WIFI_CONFIGURATION`);
      const config = response?.data?.WIFI_CONFIGURATION;
      const setting = config?.WIFI_SETTING;

      console.log("Fetched Config:", config);

      setFormState({
        ssid: config?.AP_SSID_STA_MODE || "",
        password: config?.AP_PASSWORD_STA_MODE || "",
        ipType: setting?.STATIC_DYNAMIC_IP || "DYNAMIC",
        staticIp: setting?.STATIC_IP || "",
        gatewayIp: setting?.GATEWAY_IP || "",
        retryCount: setting?.MAX_CONN_RETRY ?? 10,
        autoSwitching: setting?.STA_AUTO_SWITCHING === "ENABLE",
        networkScanRate: setting?.STA_AUTO_SWITCHING_SCAN_RATE || "",
        wifiMode: setting?.WIFI_MODE || config?.WIFI_MODE || "STATION_MODE",
      });
    } catch (error) {
      console.error("Error fetching network config:", error);
      // toast.error("Failed to load Wi-Fi configuration");
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchWifiNetworks = async () => {
    setScanLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/GET_WIFI_AVAILABLE_NETWORK`);
      if (!response.ok) throw new Error("Network response not ok");

      const data = await response.json();
      const networks = (data.AVAILABLE_WIFI_NETWORKS || [])
        .filter((n) => n.SSID.trim() !== "")
        .map((n) => ({
          ssid: n.SSID,
          rssi: n.RSSI,
          channel: n.CHANNEL,
        }));

      setWifiNetworks(networks);
      toast.success("Scan complete");
    } catch (error) {
      console.error("Error fetching Wi-Fi networks:", error);
      toast.error("Failed to scan networks");
    } finally {
      setScanLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkDetails();
  }, []);

  /** 🔹 Save Configuration */
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      ssid,
      password,
      ipType,
      staticIp,
      gatewayIp,
      retryCount,
      autoSwitching,
      networkScanRate,
      wifiMode,
    } = formState;

    if (ipType === "STATIC" && (!staticIp.trim() || !gatewayIp.trim())) {
      toast.error("Please enter both Static IP and Gateway IP");
      setIsSubmitting(false);
      return;
    }

    if (staticIp && gatewayIp) {
      const isValid = validateStaticAndGatewayIP(staticIp, gatewayIp);
      if (!isValid) {
        toast.error("Enter valid Static and Gateway IP");
        setIsSubmitting(false);
        return;
      }
    }

    setWifiSSID(ssid);
    setWifiPassword(password);

    const data = {
      WIFI_CONFIGURATION: {
        SSID: ssid,
        PASSWORD: password,
        WIFI_SETTING: {
          WIFI_MODE: wifiMode,
          STATIC_DYNAMIC_IP: ipType.toUpperCase(),
          GATEWAY_IP: gatewayIp,
          STATIC_IP: staticIp,
          MAX_CONN_RETRY: parseInt(retryCount),
          STA_AUTO_SWITCHING: autoSwitching ? "ENABLE" : "DISABLE",
          STA_AUTO_SWITCHING_SCAN_RATE: networkScanRate || "",
        },
      },
    };

    try {
      const response = await axios.post(`${BASE_URL}/WIFI_CONFIGURATION`, data);
      toast.success(response.data || "Configured successfully");
      onClose();
      console.log(data);

    } catch (error) {
      toast.error(error?.response?.data || "Configuration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert wifi networks to react-select options format
  const ssidOptions = wifiNetworks.map((network) => ({
    value: network.ssid,
    label: `${network.ssid} (${network.rssi} dBm)`,
    rssi: network.rssi,
    channel: network.channel,
  }));

  // Find the selected option for React Select
  const selectedSSID = ssidOptions.find((option) => option.value === formState.ssid) ||
    (formState.ssid ? { value: formState.ssid, label: formState.ssid } : null);

  // Custom styles for React Select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#fb923c" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(251, 146, 60, 0.4)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#fb923c" : "#d1d5db",
      },
      borderRadius: "0.5rem",
      padding: "0.125rem",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#fb923c"
        : state.isFocused
          ? "#fed7aa"
          : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:active": {
        backgroundColor: "#fb923c",
      },
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            WIFI CONFIG
          </h2>
          <button
            className="text-gray-500 hover:text-red-500 transition"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Settings Form */}
        {loadingConfig ? (
          <div className="flex justify-center items-center h-32">
            <LoaderIcon className="animate-spin" color="orange" />
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            {/* SSID Field with Scan */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">SSID</label>
                <button
                  type="button"
                  onClick={fetchWifiNetworks}
                  disabled={scanLoading}
                  className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {scanLoading ? "Scanning..." : "Scan"}
                </button>
              </div>
              <CreatableSelect
                value={selectedSSID}
                onChange={handleSSIDChange}
                options={ssidOptions}
                isClearable
                required
                isSearchable
                placeholder="Select or enter SSID"
                styles={customSelectStyles}
                noOptionsMessage={() => "Click 'Scan' to find networks"}
                formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                menuPlacement="auto"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="text"
                name="password"
                required
                placeholder="Enter password"
                value={formState.password}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* IP Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IP Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="ipType"
                    required
                    value="DYNAMIC"
                    checked={formState.ipType === "DYNAMIC"}
                    onChange={handleFormChange}
                    className="accent-orange-500"
                  />
                  Dynamic
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="ipType"
                    value="STATIC"
                    required
                    checked={formState.ipType === "STATIC"}
                    onChange={handleFormChange}
                    className="accent-orange-500"
                  />
                  Static
                </label>
              </div>
            </div>

            {/* Static IP Fields */}
            {formState.ipType === "STATIC" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Static IP</label>
                  <input
                    type="text"
                    name="staticIp"
                    required
                    value={formState.staticIp}
                    onChange={handleFormChange}
                    placeholder="e.g. 192.168.1.50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gateway IP</label>
                  <input
                    type="text"
                    name="gatewayIp"
                    required
                    value={formState.gatewayIp}
                    onChange={handleFormChange}
                    placeholder="e.g. 192.168.1.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Retry Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Retry Count
              </label>
              <select
                name="retryCount"
                value={formState.retryCount}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
              >
                {[1, 3, 5, 10].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-Switching */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="autoSwitching"
                checked={formState.autoSwitching}
                onChange={handleFormChange}
                className="accent-orange-500"
              />
              <label className="text-sm text-gray-700">Enable Auto-Switching</label>
            </div>

            {formState.autoSwitching && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network Scan Rate (mSec)
                </label>
                <input
                  type="number"
                  name="networkScanRate"
                  value={formState.networkScanRate}
                  required
                  onChange={handleFormChange}
                  placeholder="Enter scan rate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
            )}

            {/* Save Button */}
            {/* <button
              type="submit"
              className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg transition font-semibold disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center">
                  <LoaderIcon className="animate-spin" color="white" />
                </div>
              ) : (
                "SAVE"
              )}
            </button> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WIFI MODE
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="wifiMode"
                    value="ACCESS_POINT_MODE"
                    required
                    checked={formState.wifiMode === "ACCESS_POINT_MODE"}
                    onChange={handleFormChange}
                    className="accent-orange-500"
                  />
                  AP Mode
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="wifiMode"
                    value="STATION_MODE"
                    required
                    checked={formState.wifiMode === "STATION_MODE"}
                    onChange={handleFormChange}
                    className="accent-orange-500"
                  />
                  Station Mode
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                disabled={isSubmitting}
                type="submit"
                label={isSubmitting ? (
                  <div className="flex justify-center items-center">
                    <LoaderIcon className="animate-spin" color="white" />
                  </div>
                ) : (
                  "SAVE"
                )}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

WifiScan.propTypes = {
  onClose: PropTypes.func.isRequired,
  setWifiSSID: PropTypes.func.isRequired,
  setWifiPassword: PropTypes.func.isRequired,
};

export default WifiScan;
