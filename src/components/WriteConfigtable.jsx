import React, { useState, useEffect } from "react";
import { Button } from "./ui";
import toast from "react-hot-toast";
import { API_BASE_URL as BASE_URL } from "../config/index.js";
import Portal from "./ui/Portal";

const WriteConfigtable = ({ selectedDevice, onConfigSubmit, onClose, initialConfig = [], isEditing = false }) => {
  const [configData, setConfigData] = useState([
    {
      serialNo: 1,
      addressType: "Decimal",
      address: "",
      dataType: "",
      registerFunction: "",
      value: ""
    }
  ]);

  const [touchedFields, setTouchedFields] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerFunctionMap = {
    "Write Single Coil": 5,
    "Write Single Register": 6
  };

  const addressTypeMap = {
    "Hex": 1,
    "Decimal": 2
  };

  const dataTypeMap = {
    "1-byte(8-BIT)": 1,
    "HEX(LITTLE ENDIAN)": 2,
    "HEX(BIG ENDIAN)": 3,
    "FLOAT(LITTLE ENDIAN)": 4,
    "FLOAT(BIG ENDIAN)": 5,
    "FLOAT(LITTLE SWAP ENDIAN)": 6,
    "FLOAT(BIG SWAP ENDIAN)": 7,
    "4-byte(LITTLE ENDIAN)": 8,
    "4-byte(BIG ENDIAN)": 9,
    "4-byte(LITTLE SWAP ENDIAN)": 10,
    "4-byte(BIG SWAP ENDIAN)": 11
  };

  const dataTypeOptions = [
    "1-byte(8-BIT)",
    "HEX(LITTLE ENDIAN)",
    "HEX(BIG ENDIAN)",
    "FLOAT(LITTLE ENDIAN)",
    "FLOAT(BIG ENDIAN)",
    "FLOAT(LITTLE SWAP ENDIAN)",
    "FLOAT(BIG SWAP ENDIAN)",
    "4-byte(LITTLE ENDIAN)",
    "4-byte(BIG ENDIAN)",
    "4-byte(LITTLE SWAP ENDIAN)",
    "4-byte(BIG SWAP ENDIAN)",
  ];

  const registerFunctionOptions = [
    "Write Single Coil",
    "Write Single Register"
  ];

  useEffect(() => {
    if (initialConfig.length > 0) {
      const item = initialConfig[0];
      setConfigData([{
        serialNo: 1,
        addressType: item.addressType || "Decimal",
        address: item.addressType === "Hex" && item.address && !item.address.startsWith("0x")
          ? `0x${item.address}`
          : (item.address || ""),
        dataType: item.dataType || "",
        registerFunction: item.registerFunction || "",
        value: item.value || ""
      }]);
    }
  }, [initialConfig]);

  const validateValue = (value, registerFunction, dataType) => {
    if (!value) return false;
    if (registerFunction === "Write Single Coil") {
      return value === "0" || value === "1";
    } else if (registerFunction === "Write Single Register") {
      const num = parseInt(value, 10);
      if (isNaN(num)) return false;
      if (dataType === "1-byte(8-BIT)") {
        return num >= -128 && num <= 255;
      } else {
        return num >= -32768 && num <= 65535;
      }
    }
    return false;
  };

  const markAsTouched = (index, field) => {
    setTouchedFields(prev => ({
      ...prev,
      [index]: { ...(prev[index] || {}), [field]: true }
    }));
  };

  const isTouched = (index, field) => {
    return touchedFields[index]?.[field] === true;
  };

  const validateAddress = (address, addressType) => {
    if (!address) return false;
    if (addressType === "Hex") {
      const hexRegex = /^0x[0-9A-Fa-f]{4}$/;
      return hexRegex.test(address);
    } else {
      const decimalRegex = /^\d{1,6}$/;
      return decimalRegex.test(address);
    }
  };

  const getValueRangeText = (registerFunction, dataType) => {
    if (registerFunction === "Write Single Coil") {
      return "0 or 1";
    } else if (registerFunction === "Write Single Register") {
      if (dataType === "1-byte(8-BIT)") {
        return "-128 to 255";
      } else {
        return "-32768 to 65535";
      }
    }
    return "Enter value";
  };

  const validateForm = () => {
    const errors = [];
    const row = configData[0];
    if (!row.registerFunction) errors.push(`Register Function is required`);
    if (row.addressType === "Hex") {
      if (!row.address.startsWith("0x")) {
        errors.push(`Hex address must start with 0x`);
      } else if (!/^0x[0-9A-Fa-f]{4}$/.test(row.address)) {
        errors.push(`Hex address must be in format 0x0000 (exactly 4 digits after 0x)`);
      }
    } else if (!validateAddress(row.address, row.addressType)) {
      errors.push(`Address must be 1-6 decimal digits`);
    }
    if (!row.dataType) errors.push(`Register Data Type is required`);
    if (!row.value) {
      errors.push(`Value is required`);
    } else if (!validateValue(row.value, row.registerFunction, row.dataType)) {
      if (row.registerFunction === "Write Single Coil") {
        errors.push(`Value should be 0 or 1 for Write Single Coil`);
      } else if (row.registerFunction === "Write Single Register") {
        if (row.dataType === "1-byte(8-BIT)") {
          errors.push(`Value should be an integer in range of -128 to 255`);
        } else {
          errors.push(`Value should be an integer in range of -32,768 to 65,535`);
        }
      }
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const formatConfigForAPI = () => {
    const item = configData[0];
    const formattedData = {
      WRITE_MODBUS_CONFIGURATION: {
        SLAVE_ID: selectedDevice?.SLAVE_ID || 1,
        SLAVE_NO: selectedDevice?.SLAVE_NO || 1,
        DEVICE_NAME: selectedDevice?.DEVICE_NAME || "Device",
        DEVICE_BATCH_ID: selectedDevice?.DEVICE_BATCH_ID || "",
        SLAVE_MAKE: selectedDevice?.SLAVE_MAKE || "OTHERS",
        SLAVE_MODEL: selectedDevice?.SLAVE_MODEL || "",
        DCN_NAME: selectedDevice?.DCN_NAME || "",
        WRITE_CHANNEL: {
          CHANNEL_REGISTER_FUNCTION: registerFunctionMap[item.registerFunction] || 6,
          CHANNEL_ADDRESS_TYPE: addressTypeMap[item.addressType] || 2,
          CHANNEL_ADDRESS: item.addressType === "Decimal" ? parseInt(item.address, 10) : parseInt(item.address.substring(2), 16),
          CHANNEL_REGISTER_TYPE: dataTypeMap[item.dataType] || 1,
          CHANNEL_REGISTER_VALUE: parseInt(item.value, 10)
        }
      }
    };
    return formattedData;
  };

  const handleInputChange = (index, field, value) => {
    const newData = [...configData];
    if (field === "addressType") {
      newData[index][field] = value;
      newData[index].address = value === "Hex" ? "0x" : "";
    }
    else if (field === "address") {
      if (newData[index].addressType === "Hex") {
        if (!value.startsWith("0x")) value = "0x" + value.replace(/^0x/, "");
        const hexPart = value.substring(2).replace(/[^0-9A-Fa-f]/g, "").substring(0, 4);
        newData[index].address = "0x" + hexPart;
      } else {
        newData[index].address = value.replace(/[^\d]/g, "").substring(0, 6);
      }
    }
    else if (field === "registerFunction") {
      const previousFunction = newData[index].registerFunction;
      newData[index][field] = value;
      if (value === "Write Single Coil") {
        newData[index].dataType = "1-byte(8-BIT)";
        if (newData[index].value !== "0" && newData[index].value !== "1") {
          newData[index].value = "";
        }
      } else if (value === "Write Single Register") {
        if (!newData[index].dataType) {
          newData[index].dataType = "1-byte(8-BIT)";
        }
        if (previousFunction === "Write Single Coil") {
          const numValue = parseInt(newData[index].value, 10);
          if (isNaN(numValue)) {
            newData[index].value = "";
          }
        }
      }
    }
    else if (field === "dataType") {
      const oldDataType = newData[index].dataType;
      newData[index][field] = value;
      if (newData[index].registerFunction === "Write Single Coil" && value !== "1-byte(8-BIT)") {
        newData[index].dataType = "1-byte(8-BIT)";
      }
      else if (oldDataType !== value && newData[index].value) {
        const numValue = parseInt(newData[index].value, 10);
        if (!isNaN(numValue)) {
          if (value === "1-byte(8-BIT)" && (numValue < -128 || numValue > 255)) {
            newData[index].value = "";
          } else if (value !== "1-byte(8-BIT)" && (numValue < -32768 || numValue > 65535)) {
            newData[index].value = "";
          }
        }
      }
    }
    else if (field === "value") {
      if (newData[index].registerFunction === "Write Single Coil") {
        if (value === "0" || value === "1" || value === "") {
          newData[index].value = value;
        }
      } else if (newData[index].registerFunction === "Write Single Register") {
        if (value === "" || /^-?\d*$/.test(value)) {
          newData[index].value = value;
          if (value !== "" && value !== "-") {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue)) {
              if (newData[index].dataType === "1-byte(8-BIT)") {
                if (numValue < -128) newData[index].value = "-128";
                if (numValue > 255) newData[index].value = "255";
              } else {
                if (numValue < -32768) newData[index].value = "-32768";
                if (numValue > 65535) newData[index].value = "65535";
              }
            }
          }
        }
      } else {
        newData[index].value = value;
      }
    }
    else {
      newData[index][field] = value;
    }
    setConfigData(newData);
    markAsTouched(index, field);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setFormSubmitted(true);

    const newTouchedFields = {};
    configData.forEach((_, index) => {
      newTouchedFields[index] = {
        address: true,
        dataType: true,
        registerFunction: true,
        value: true
      };
    });
    setTouchedFields(newTouchedFields);

    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);
    const formattedData = formatConfigForAPI();

    try {
      const response = await fetch(`${BASE_URL}/OTHER_CHANNEL_WRITE_MODBUS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      const responseText = await response.text();
      toast.success(responseText, { duration: 1500 });

      if (onConfigSubmit) onConfigSubmit(configData);
      onClose();
    } catch (error) {
      toast.error(error.message, { duration: 1500 });
    } finally {
      setLoading(false);
    }
  };

  const deviceTitle = selectedDevice?.name || selectedDevice?.deviceName || selectedDevice?.DEVICE_NAME || "Device";
  const modalTitle = isEditing
    ? `WRITE MODBUS: ${deviceTitle}`
    : `CONFIGURE: ${deviceTitle}`;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-industrial-900/40 backdrop-blur-sm">
        <div className="bg-white border-2 border-industrial-200 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="bg-industrial-100 px-6 py-4 border-b-2 border-industrial-200 flex justify-between items-center">
            <h2 className="text-sm font-black text-industrial-900 tracking-wider uppercase">
              {modalTitle}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-industrial-200 text-industrial-400 hover:text-industrial-900 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            {formSubmitted && validationErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl">
                <ul className="list-disc pl-5 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-[10px] font-bold uppercase tracking-tight">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-industrial-100 rounded-xl overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-industrial-50 border-b-2 border-industrial-100">
                    <tr>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center w-12">SR</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">FUNCTION</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center w-24">TYPE</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center w-28">ADDR</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">DATA TYPE</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center w-32">VALUE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-industrial-50">
                    <tr className="hover:bg-industrial-50/50 transition-colors">
                      <td className="px-3 py-3 text-xs font-bold text-industrial-400 text-center">{configData[0].serialNo}</td>
                      <td className="px-2 py-3">
                        <select
                          value={configData[0].registerFunction || ""}
                          onChange={(e) => handleInputChange(0, "registerFunction", e.target.value)}
                          className={`w-full bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 outline-none focus:border-industrial-900 ${formSubmitted && !configData[0].registerFunction ? "border-red-500" : "border-industrial-100"
                            }`}
                        >
                          <option value="">SELECT</option>
                          {registerFunctionOptions.map((func) => (
                            <option key={func} value={func}>{func}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-3">
                        <select
                          value={configData[0].addressType || "Decimal"}
                          onChange={(e) => handleInputChange(0, "addressType", e.target.value)}
                          className="w-full bg-industrial-50 border-2 border-industrial-100 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 outline-none focus:border-industrial-900"
                        >
                          <option value="Hex">HEX</option>
                          <option value="Decimal">DEC</option>
                        </select>
                      </td>
                      <td className="px-2 py-3">
                        <input
                          type="text"
                          value={configData[0].address || ""}
                          onChange={(e) => handleInputChange(0, "address", e.target.value)}
                          className={`w-full bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 text-center outline-none focus:border-industrial-900 ${formSubmitted && !validateAddress(configData[0].address, configData[0].addressType) ? "border-red-500" : "border-industrial-100"
                            }`}
                          placeholder={configData[0].addressType === "Hex" ? "0x0000" : "0"}
                        />
                      </td>
                      <td className="px-2 py-3">
                        <select
                          value={configData[0].dataType || ""}
                          onChange={(e) => handleInputChange(0, "dataType", e.target.value)}
                          disabled={configData[0].registerFunction === "Write Single Coil"}
                          className={`w-full bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 outline-none focus:border-industrial-900 disabled:opacity-50 ${formSubmitted && !configData[0].dataType && configData[0].registerFunction !== "Write Single Coil" ? "border-red-500" : "border-industrial-100"
                            }`}
                        >
                          <option value="">SELECT</option>
                          {dataTypeOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-3">
                        <input
                          type="text"
                          value={configData[0].value || ""}
                          onChange={(e) => handleInputChange(0, "value", e.target.value)}
                          className={`w-full bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 text-center outline-none focus:border-industrial-900 ${formSubmitted && !validateValue(configData[0].value, configData[0].registerFunction, configData[0].dataType) ? "border-red-500" : "border-industrial-100"
                            }`}
                          placeholder={getValueRangeText(configData[0].registerFunction, configData[0].dataType)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t-2 border-industrial-100">
                <Button
                  type="button"
                  variant="secondary"
                  label="CANCEL"
                  onClick={onClose}
                  className="px-6 py-2 bg-industrial-100 text-industrial-700 hover:bg-industrial-200 border-none"
                />
                <Button
                  type="submit"
                  variant="primary"
                  label={loading ? "SUBMITTING..." : (isEditing ? "UPDATE CONFIG" : "SUBMIT")}
                  disabled={loading}
                  className="px-8 py-2 min-w-[120px]"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default WriteConfigtable;