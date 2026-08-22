import React, { useState, useEffect } from "react";
import { Button } from "./ui";

const ConfigTable = ({ selectedDevice, onConfigSubmit, onClose, initialConfig = [], isEditing = false }) => {
  const [configData, setConfigData] = useState(
    initialConfig.length > 0
      ? initialConfig
      : [{
        serialNo: 1,
        parameterName: "",
        addressType: "Decimal",
        address: "",
        scalingDecimal: "no decimal",
        dataType: "",
        unit: "",
        registerFunction: ""
      }]
  );

  const [touchedFields, setTouchedFields] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [showHexError, setShowHexError] = useState(false);
  const [hexErrorMessage, setHexErrorMessage] = useState("");

  const dataTypeOptions = [
    "1-byte(8-BIT)", "HEX(LITTLE ENDIAN)", "HEX(BIG ENDIAN)", "FLOAT(LITTLE ENDIAN)", "FLOAT(BIG ENDIAN)", "FLOAT(LITTLE SWAP ENDIAN)", "FLOAT(BIG SWAP ENDIAN)", "4-byte(LITTLE ENDIAN)", "4-byte(BIG ENDIAN)", "4-byte(LITTLE SWAP ENDIAN)", "4-byte(BIG SWAP ENDIAN)"
  ];

  const registerFunctionOptions = [
    "0x01 Read Coils",
    "0x02 Read Discrete Inputs",
    "0x03 Read Holding Registers",
    "0x04 Read Input Register"
  ];

  const scalingDecimalOptions = [
    "no decimal",
    "1 decimal",
    "2 decimal",
    "3 decimal",
    "4 decimal"
  ];

  useEffect(() => {
    if (initialConfig.length > 0) {
      const updatedConfig = initialConfig.map((item, index) => ({
        ...item,
        serialNo: item.serialNo || index + 1,
        address: item.addressType === "Hex" && item.address && !item.address.startsWith("0x") ? `0x${item.address}` : item.address,
        registerFunction: item.registerFunction || "",
        scalingDecimal: item.scalingDecimal || "no decimal"
      }));
      setConfigData(updatedConfig);
    }
  }, [initialConfig]);

  const addRow = () => {
    const newSerialNo = configData.length > 0
      ? Math.max(...configData.map(row => row.serialNo || 0)) + 1
      : 1;

    setConfigData([
      ...configData,
      {
        serialNo: newSerialNo,
        parameterName: "",
        addressType: "Decimal",
        address: "",
        scalingDecimal: "no decimal",
        dataType: "",
        unit: "",
        registerFunction: ""
      }
    ]);
  };

  const removeRow = (index) => {
    const newData = [...configData];
    newData.splice(index, 1);
    const renumbered = newData.map((item, idx) => ({
      ...item,
      serialNo: idx + 1
    }));
    setConfigData(renumbered);
    const newTouchedFields = { ...touchedFields };
    delete newTouchedFields[index];
    const remappedTouchedFields = {};
    Object.keys(newTouchedFields).forEach(key => {
      const keyIndex = parseInt(key);
      if (keyIndex > index) {
        remappedTouchedFields[keyIndex - 1] = newTouchedFields[keyIndex];
      } else {
        remappedTouchedFields[keyIndex] = newTouchedFields[keyIndex];
      }
    });
    setTouchedFields(remappedTouchedFields);
    validateForm(renumbered);
  };

  const markAsTouched = (index, field) => {
    setTouchedFields(prev => ({
      ...prev,
      [index]: { ...(prev[index] || {}), [field]: true }
    }));
    validateForm();
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

  const validateForm = (data = configData) => {
    const errors = [];
    let hasHexError = false;
    let hexError = "";

    data.forEach((row) => {
      if (!row.parameterName) errors.push(`Row ${row.serialNo}: Parameter Name is required`);
      if (!row.registerFunction) errors.push(`Row ${row.serialNo}: Register Function is required`);
      if (row.addressType === "Hex") {
        if (!row.address.startsWith("0x")) {
          errors.push(`Row ${row.serialNo}: Hex address must start with 0x`);
        } else if (!/^0x[0-9A-Fa-f]{4}$/.test(row.address)) {
          errors.push(`Row ${row.serialNo}: Hex address must be in format 0x0000 (exactly 4 digits after 0x)`);
          hasHexError = true;
          hexError = `Row ${row.serialNo}: Hex address must be in format 0x0000 (exactly 4 digits after 0x)`;
        }
      } else if (!validateAddress(row.address, row.addressType)) {
        errors.push(`Row ${row.serialNo}: Address must be 1-6 decimal digits`);
      }
      if (!row.dataType) errors.push(`Row ${row.serialNo}: Register Data Type is required`);
      if (!row.unit) errors.push(`Row ${row.serialNo}: Unit is required`);
    });

    setValidationErrors(errors);
    setHexErrorMessage(hasHexError ? hexError : "");
    return errors.length === 0;
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
    else if (field === "parameterName") {
      newData[index][field] = value.substring(0, 10);
    }
    else if (field === "unit") {
      newData[index][field] = value.substring(0, 5);
    }
    else {
      newData[index][field] = value;
    }

    setConfigData(newData);
    markAsTouched(index, field);
    if (field === "address") setShowHexError(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const newTouchedFields = {};
    configData.forEach((_, index) => {
      newTouchedFields[index] = {
        address: true,
        parameterName: true,
        dataType: true,
        registerFunction: true,
        scalingDecimal: true,
        unit: true
      };
    });
    setTouchedFields(newTouchedFields);
    const isValid = validateForm();

    let hasInvalidHexAddress = false;
    configData.forEach(row => {
      if (row.addressType === "Hex" && !/^0x[0-9A-Fa-f]{4}$/.test(row.address)) {
        hasInvalidHexAddress = true;
      }
    });

    if (hasInvalidHexAddress) {
      setShowHexError(true);
      return;
    }

    if (!isValid) return;
    if (onConfigSubmit) onConfigSubmit(configData);
  };

  const deviceTitle = selectedDevice?.name || selectedDevice?.deviceName || "Device";
  const modalTitle = isEditing
    ? `MODBUS CONFIG: ${deviceTitle}`
    : `CONFIGURE: ${deviceTitle}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-industrial-900/40 backdrop-blur-sm">
      <div className="bg-white border-2 border-industrial-200 rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-industrial-100 px-6 py-4 border-b-2 border-industrial-200 flex justify-between items-center text-center">
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
          {showHexError && hexErrorMessage && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl animate-in slide-in-from-top-2">
              <p className="text-xs font-bold uppercase tracking-tight">{hexErrorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-industrial-100 rounded-xl overflow-hidden">
              <div className="overflow-y-auto max-h-[400px]">
                <table className="w-full border-collapse">
                  <thead className="bg-industrial-50 sticky top-0 z-10 border-b-2 border-industrial-100">
                    <tr>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center w-12">SR</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">PARAMETER</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">FUNCTION</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">TYPE</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center w-24">ADDR</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">SCALING</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">DATA TYPE</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center w-16">UNIT</th>
                      <th className="px-3 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center w-12">DEL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-industrial-50">
                    {configData.map((row, index) => (
                      <tr key={index} className="hover:bg-industrial-50/50 transition-colors">
                        <td className="px-3 py-3 text-xs font-bold text-industrial-400 text-center">{index + 1}</td>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            value={row.parameterName || ""}
                            onChange={(e) => handleInputChange(index, "parameterName", e.target.value)}
                            className={`w-full bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 outline-none focus:border-industrial-900 ${isTouched(index, 'parameterName') && !row.parameterName ? "border-red-500" : "border-industrial-100"
                              }`}
                            placeholder="NAME"
                            maxLength={10}
                          />
                        </td>
                        <td className="px-2 py-3">
                          <select
                            value={row.registerFunction || ""}
                            onChange={(e) => handleInputChange(index, "registerFunction", e.target.value)}
                            className={`w-full bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 outline-none focus:border-industrial-900 ${isTouched(index, 'registerFunction') && !row.registerFunction ? "border-red-500" : "border-industrial-100"
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
                            value={row.addressType || "Decimal"}
                            onChange={(e) => handleInputChange(index, "addressType", e.target.value)}
                            className="w-full bg-industrial-50 border-2 border-industrial-100 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 outline-none focus:border-industrial-900"
                          >
                            <option value="Hex">HEX</option>
                            <option value="Decimal">DEC</option>
                          </select>
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            value={row.address || ""}
                            onChange={(e) => handleInputChange(index, "address", e.target.value)}
                            className={`w-full bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 text-center outline-none focus:border-industrial-900 ${isTouched(index, 'address') && !validateAddress(row.address, row.addressType) ? "border-red-500" : "border-industrial-100"
                              }`}
                            placeholder={row.addressType === "Hex" ? "0x0000" : "0"}
                          />
                        </td>
                        <td className="px-2 py-3">
                          <select
                            value={row.scalingDecimal || "no decimal"}
                            onChange={(e) => handleInputChange(index, "scalingDecimal", e.target.value)}
                            className="w-full bg-industrial-50 border-2 border-industrial-100 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 outline-none focus:border-industrial-900"
                          >
                            {scalingDecimalOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-3">
                          <select
                            value={row.dataType || ""}
                            onChange={(e) => handleInputChange(index, "dataType", e.target.value)}
                            className={`w-full bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 outline-none focus:border-industrial-900 ${isTouched(index, 'dataType') && !row.dataType ? "border-red-500" : "border-industrial-100"
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
                            value={row.unit || ""}
                            onChange={(e) => handleInputChange(index, "unit", e.target.value)}
                            className={`w-full bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 text-center outline-none focus:border-industrial-900 ${isTouched(index, 'unit') && !row.unit ? "border-red-500" : "border-industrial-100"
                              }`}
                            placeholder="UNIT"
                            maxLength={5}
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            disabled={configData.length <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 border-2 border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-row justify-between items-center pt-4 border-t-2 border-industrial-100">
              <Button
                type="button"
                variant="secondary"
                label="ADD PARAMETER"
                onClick={addRow}
                className="px-6 py-2"
              />
              <div className="flex gap-4">
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
                  label={isEditing ? "UPDATE CONFIGURATION" : "SAVE CONFIGURATION"}
                  className="px-8 py-2"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfigTable;