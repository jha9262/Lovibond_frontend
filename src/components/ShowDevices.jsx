import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices, saveDevices, updateDevice } from "../features/devices/devicesSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui";
import FolderModal from "./FolderModal";
import DeleteDeviceConfirmationModal from "./DeleteDeviceConfirmationModal";
import ConfigTable from "./ConfigTable";
import WriteConfigTable from "./WriteConfigtable";

const DeviceTable = () => {
  const dispatch = useDispatch();
  const { devices, loading } = useSelector((state) => state.devices);
  const newFolder = useSelector((state) => state.devices.newFolder);
  const [Device, setDeviceName] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [nameErrors, setNameErrors] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceIndex, setDeviceIndex] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isConfigViewModalOpen, setIsConfigViewModalOpen] = useState(false);
  const [selectedDeviceForConfig, setSelectedDeviceForConfig] = useState(null);
  const [isWriteConfigModalOpen, setIsWriteConfigModalOpen] = useState(false);
  const [selectedDeviceForWriteConfig, setSelectedDeviceForWriteConfig] = useState(null);

  const usedPins = devices.map(d => d.controllerPin).filter(pin => pin && pin !== "NONE");
  const allPins = Array.from({ length: 14 }, (_, i) => `C${i + 1}`);
  const unusedPins = allPins.filter(pin => !usedPins.includes(pin));

  const handleControllerPinChange = (index, value) => {
    dispatch(updateDevice({ index, field: "controllerPin", value }));
  };

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFolderName(newFolder);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFolderName("");
  };

  const handleSubmitFolder = () => {
    dispatch(saveDevices({ devices, folderName }));
    setIsModalOpen(false);
  };

  const handleSettingPage = (rowData) => {
    if (rowData.SLAVE_MAKE === "OTHERS" && rowData.SLAVE_MODEL === "OTHERS") {
      const deviceData = devices[rowData.SLAVE_NO - 1];
      setSelectedDeviceForWriteConfig({ ...deviceData, index: rowData.SLAVE_NO - 1 });
      setIsWriteConfigModalOpen(true);
    } else {
      const queryString = new URLSearchParams(rowData).toString();
      navigate(`/selectedSettings?${queryString}`, { state: rowData });
    }
  };

  const handleConfigView = (device, index) => {
    setSelectedDeviceForConfig({ ...device, index });
    setIsConfigViewModalOpen(true);
  };

  const handleConfigUpdate = (updatedConfig) => {
    if (selectedDeviceForConfig && selectedDeviceForConfig.index !== undefined) {
      dispatch(updateDevice({
        index: selectedDeviceForConfig.index,
        field: "configDetails",
        value: updatedConfig
      }));
    }
    setIsConfigViewModalOpen(false);
  };

  const handleWriteConfigSubmit = (updatedConfig) => {
    if (selectedDeviceForWriteConfig && selectedDeviceForWriteConfig.index !== undefined) {
      dispatch(updateDevice({
        index: selectedDeviceForWriteConfig.index,
        field: "configDetails",
        value: updatedConfig
      }));
    }
    setIsWriteConfigModalOpen(false);
  };

  const handleSlaveIdChange = (index, value) => {
    const numValue = parseInt(value, 10);
    let errors = [];
    if (numValue < 1 || numValue > 64) {
      errors.push("Slave ID must be between 1 and 64.");
    }
    setErrorMessages(errors);
    if (errors.length === 0) {
      dispatch(updateDevice({ index, field: "slaveId", value }));
    }
  };

  const handleNameChange = (index, value) => {
    const invalidChars = /[\/:?\"<>|,{}!#@$%^&*()=`]/;
    let errors = [];
    if (invalidChars.test(value)) {
      errors.push("Invalid character not allowed");
    }
    if (value.includes(" ")) {
      errors.push("Spaces are not allowed");
    }
    if (value.length > 15) {
      errors.push("Device name must be 15 characters max.");
    }
    setErrorMessages(errors);
    if (errors.length === 0) {
      dispatch(updateDevice({ index, field: "name", value }));
    }
  };

  const handleRemove = (index, deviceName) => {
    setIsDeleteModalOpen(true);
    setDeviceName(deviceName);
    setDeviceIndex(index);
  };

  const sortedDevices = devices.map((device, index) => ({
    ...device,
    originalIndex: index
  })).sort((a, b) => {
    const idA = parseInt(a.slaveId, 10) || 0;
    const idB = parseInt(b.slaveId, 10) || 0;
    return idA - idB;
  });

  return (
    <div className="space-y-6">
      <FolderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitFolder}
        folderName={folderName}
        setFolderName={setFolderName}
        newFolder={newFolder}
      />

      <DeleteDeviceConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        deviceName={Device}
        deviceIndex={deviceIndex}
        setisDeleteModalOpen={setIsDeleteModalOpen}
      />

      {isConfigViewModalOpen && selectedDeviceForConfig && (
        <ConfigTable
          selectedDevice={selectedDeviceForConfig}
          onConfigSubmit={handleConfigUpdate}
          onClose={() => setIsConfigViewModalOpen(false)}
          initialConfig={selectedDeviceForConfig.configDetails || []}
          isEditing={true}
        />
      )}

      {isWriteConfigModalOpen && selectedDeviceForWriteConfig && (
        <WriteConfigTable
          selectedDevice={selectedDeviceForWriteConfig}
          onConfigSubmit={handleWriteConfigSubmit}
          onClose={() => setIsWriteConfigModalOpen(false)}
          initialConfig={selectedDeviceForWriteConfig.configDetails || []}
          isEditing={true}
        />
      )}

      <div className="bg-white border-2 border-industrial-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-industrial-100 px-6 py-4 border-b-2 border-industrial-200 flex flex-row justify-between items-center">
          <h2 className="text-sm font-black text-industrial-900 tracking-wider uppercase">
            AVAILABLE DEVICES
          </h2>
          <Button
            variant="secondary"
            label="SUBMIT"
            onClick={() => {
              devices.length === 0
                ? dispatch(saveDevices({ devices, folderName: "DEFAULT_FOLDER" }))
                : handleOpenModal()
            }}
            disabled={loading || devices.length === 0}
            className="px-6 py-2"
          />
        </div>

        <div className="p-6">
          {errorMessages.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl">
              {errorMessages.map((error, i) => (
                <p key={i} className="text-xs font-bold uppercase tracking-tight">{error}</p>
              ))}
            </div>
          )}

          <div className="overflow-x-auto max-h-[500px] border-2 border-industrial-100 rounded-xl">
            <table className="w-full border-collapse">
              <thead className="bg-industrial-50 sticky top-0 z-10 border-b-2 border-industrial-100">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">SLAVE ID</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">DEVICE NAME</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">MAKE</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">MODEL</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">CONTROLLER PIN</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">CONFIGURE</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-industrial-500 uppercase tracking-widest text-center">DELETE</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-industrial-50">
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center text-xs font-bold text-industrial-400 uppercase tracking-widest bg-industrial-50/30">
                      {loading ? "Loading hardware data..." : "NO DEVICES CONNECTED. ADD A DEVICE TO BEGIN."}
                    </td>
                  </tr>
                ) : (
                  sortedDevices.map((row) => {
                    const index = row.originalIndex;
                    return (
                      <tr key={index} className="hover:bg-industrial-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={row.slaveId || ""}
                            onChange={(e) => handleSlaveIdChange(index, e.target.value)}
                            className="w-20 mx-auto bg-industrial-50 border-2 border-industrial-100 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 text-center outline-none focus:border-industrial-900"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.name || ""}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            className={` max-w-24 mx-auto bg-industrial-50 border-2 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 text-center outline-none focus:border-industrial-900 ${nameErrors[index] ? "border-red-500" : "border-industrial-100"
                              }`}
                          />
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-industrial-700 text-center uppercase tracking-tight">{row.make}</td>
                        <td className="px-4 py-3 text-center">
                          {row.model === "OTHERS" && row.make === "OTHERS" ? (
                            <Button
                              label="VIEW CONFIG"
                              variant="primary"
                              className="text-[10px] py-1 px-3"
                              onClick={() => handleConfigView(row, index)}
                            />
                          ) : (
                            <span className="text-xs font-bold text-industrial-700 uppercase tracking-tight">{row.model}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={row.controllerPin || "NONE"}
                            onChange={(e) => handleControllerPinChange(index, e.target.value)}
                            className="w-20 mx-auto bg-industrial-50 border-2 border-industrial-100 rounded-lg px-2 py-1.5 text-xs font-bold text-industrial-900 text-center outline-none focus:border-industrial-900"
                          >
                            <option value="NONE">NONE</option>
                            {row.controllerPin && row.controllerPin !== "NONE" && <option value={row.controllerPin}>{row.controllerPin}</option>}
                            {unusedPins.map((pin) => (
                              <option key={pin} value={pin}>{pin}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            label="SETTINGS"
                            variant="primary"
                            className="text-[10px] py-1 px-4"
                            disabled={row.make === "OTHERS" || row.make === "SENSORS"}
                            onClick={() => handleSettingPage({
                              SLAVE_NO: index + 1,
                              SLAVE_ID: row.slaveId,
                              SLAVE_NAME: row.name,
                              SLAVE_MAKE: row.make,
                              SLAVE_MODEL: row.model,
                            })}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="danger"
                            label="REMOVE"
                            className="text-[10px] py-1 px-3"
                            onClick={() => handleRemove(index, row.name)}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceTable;