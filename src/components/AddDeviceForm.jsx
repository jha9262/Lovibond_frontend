import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDevice } from "../features/devices/devicesSlice";
import { Button } from "./ui";
import ConfigTable from "./ConfigTable";

const AddDeviceForm = () => {
  const dispatch = useDispatch();
  const { devices } = useSelector((state) => state.devices);
  
  const usedPins = devices.map(d => d.controllerPin).filter(pin => pin && pin !== "NONE");
  const allPins = Array.from({ length: 14 }, (_, i) => `C${i + 1}`);
  const availablePins = allPins.filter(pin => !usedPins.includes(pin));

  const [error, setError] = useState("");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    slaveId: "",
    name: "",
    make: "",
    model: "",
    controllerPin: "NONE",
    configDetails: []
  });

  const isFormValid = formData.slaveId && formData.name && formData.make && formData.model && formData.controllerPin;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "slaveId") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, slaveId: "" }));
        setError("");
      } else {
        const numValue = Number(value);
        if (numValue >= 1 && numValue <= 64) {
          setFormData((prev) => ({ ...prev, slaveId: numValue }));
          setError("");
        } else {
          setError("SLAVE ID must be between 1 and 64");
        }
      }
    } else if (name === "name") {
      if (value.includes(" ")) {
        setError("Spaces are not allowed in device name");
      } else if (value.length <= 15) {
        setFormData((prev) => ({ ...prev, name: value }));
        setError("");
      } else {
        setError("Max 15 characters Allowed");
      }
    } else if (name === "make") {
      setFormData((prev) => ({
        ...prev,
        make: value,
        model: value === "OTHERS" ? "OTHERS" : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.make === "OTHERS" && formData.configDetails.length === 0) {
      setIsConfigModalOpen(true);
      return;
    }
    dispatch(addDevice(formData));
    setFormData({
      slaveId: "",
      name: "",
      make: "",
      model: "",
      controllerPin: "NONE",
      configDetails: []
    });
  };

  const handleConfigSubmit = (configData) => {
    const updatedFormData = { ...formData, configDetails: configData };
    dispatch(addDevice(updatedFormData));
    setIsConfigModalOpen(false);
    setFormData({
      slaveId: "",
      name: "",
      make: "",
      model: "",
      controllerPin: "NONE",
      configDetails: []
    });
  };

  const makeOptions = ["AUTONICS", "NIPPON", "SELEC", "HONEYWELL", "SENSORS", "TRINITY","UNITECH", "OTHERS"];
  const autonicsOptions = ["TK4S", "TK4M", "TK4N"];
  const nipponOptions = ["NC2438", "NC2738", "NC2538", "NC2638"];
  const sensorOptions = ["VIBRATION_SENSOR", "GYROSCOPE_SENSOR", "AUDIO_RECORDING_SENSOR", "GAS_SENSOR", "PRESSURE_SENSOR", "ANGLE_SENSOR", "ACCELERATION_SENSOR"];
  const selecOptions = ["SELEC_EM2M", "SELEC_EM368"];
  const trinityOptions = ["XPERT LITE"];
  const unitechOptions = ["UT-1403"]

  return (
    <div className="bg-white border-2 border-industrial-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-industrial-100 px-6 py-3 border-b-2 border-industrial-200">
        <h2 className="text-sm font-black text-industrial-900 tracking-wider uppercase">ADD DEVICE</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && <p className="text-red-500 text-xs font-bold uppercase">{error}</p>}

        <div className="grid grid-cols-1 gap-6">
          {/* SLAVE ID */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-industrial-500 uppercase tracking-widest px-1">
              SLAVE ID
            </label>
            <input
              type="number"
              name="slaveId"
              value={formData.slaveId}
              onChange={handleInputChange}
              className="w-full bg-industrial-50 border-2 border-industrial-200 rounded-lg px-4 py-2.5 text-sm font-bold text-industrial-900 focus:border-industrial-900 outline-none transition-all placeholder:text-industrial-300"
              placeholder="1-64"
            />
          </div>

          {/* DEVICE NAME */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-industrial-500 uppercase tracking-widest px-1">
              DEVICE NAME
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-industrial-50 border-2 border-industrial-200 rounded-lg px-4 py-2.5 text-sm font-bold text-industrial-900 focus:border-industrial-900 outline-none transition-all placeholder:text-industrial-300"
              placeholder="e.g. MOTOR_A"
            />
          </div>

          {/* MAKE */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-industrial-500 uppercase tracking-widest px-1">
              MAKE
            </label>
            <select
              name="make"
              value={formData.make}
              onChange={handleInputChange}
              className="w-full bg-industrial-50 border-2 border-industrial-200 rounded-lg px-4 py-2.5 text-sm font-bold text-industrial-900 focus:border-industrial-900 outline-none transition-all"
            >
              <option value="" disabled>SELECT MAKE</option>
              {makeOptions.map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* MODEL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-industrial-500 uppercase tracking-widest px-1">
              MODEL
            </label>
            <select
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              disabled={formData.make === "OTHERS"}
              className="w-full bg-industrial-50 border-2 border-industrial-200 rounded-lg px-4 py-2.5 text-sm font-bold text-industrial-900 focus:border-industrial-900 outline-none transition-all disabled:opacity-50"
            >
              <option value="" disabled>SELECT MODEL</option>
              {formData.make === "AUTONICS" && autonicsOptions.map(m => <option key={m} value={m}>{m}</option>)}
              {formData.make === "NIPPON" && nipponOptions.map(m => <option key={m} value={m}>{m}</option>)}
              {formData.make === "SELEC" && selecOptions.map(m => <option key={m} value={m}>{m}</option>)}
              {formData.make === "TRINITY" && trinityOptions.map(m => <option key={m} value={m}>{m}</option>)}
              {formData.make === "UNITECH" && unitechOptions.map(m => <option key={m} value={m}>{m}</option>)}
              {formData.make === "SENSORS" && sensorOptions.map(m => (
                <option key={m} value={m}>{m.replace('_SENSOR', '').replace(/_/g, ' ')}</option>
              ))}
              {formData.make === "OTHERS" && <option value="OTHERS">OTHERS</option>}
              {!formData.make && <option disabled>SELECT MAKE FIRST</option>}
            </select>
          </div>

          {/* CONTROLLER PIN */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-industrial-500 uppercase tracking-widest px-1">
              CONTROLLER PIN
            </label>
            <select
              name="controllerPin"
              value={formData.controllerPin}
              onChange={handleInputChange}
              className="w-full bg-industrial-50 border-2 border-industrial-200 rounded-lg px-4 py-2.5 text-sm font-bold text-industrial-900 focus:border-industrial-900 outline-none transition-all"
            >
              <option value="NONE">NONE</option>
              {availablePins.map((pin) => (
                <option key={pin} value={pin}>{pin}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="primary"
            label="ADD DEVICE"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full py-3"
          />
        </div>
      </form>

      {isConfigModalOpen && (
        <ConfigTable
          selectedDevice={formData}
          onConfigSubmit={handleConfigSubmit}
          onClose={() => setIsConfigModalOpen(false)}
          initialConfig={[{ serialNo: 1, channelName: "", parameter: "", alarmHigh: "", alarmLow: "", unit: "" }]}
          isEditing={false}
        />
      )}
    </div>
  );
};

export default AddDeviceForm;