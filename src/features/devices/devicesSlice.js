import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getSlaveConfig, updateSlaveConfig } from "../../services/deviceService";

function getISTDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 330);

  const date = `${now.getUTCDate()} ${now.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })} ${now.getUTCFullYear()}`;
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();
  const formattedTime = `${(hours % 12) || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;

  return { date, time: formattedTime };
}

// Format for current date in DD/MM/YYYY format
function getFormattedDate() {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

// Format for current time in HH:MM format
function getFormattedTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}


export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async () => {
    const response = await getSlaveConfig();
    const savedDevices = response?.SLAVE_CONFIGURATION?.SLAVE_DEVICES || {};
    const folderName = response?.SLAVE_CONFIGURATION?.SLAVE_MAIN_FOLDER_NAME || "";

    // Map the slave keys (SLAVE_1, SLAVE_2) to an array of device objects
    const devicesArray = Object.values(savedDevices).map((slave) => ({
      slaveId: slave.SLAVE_ID || "",
      name: slave.SLAVE_NAME || "",
      make: slave.MAKE || "",
      model: slave.MODEL || "",
      controllerPin: slave.CONTROLLER_PIN || "",
      configDetails: slave.CHANNELS ? convertChannelsToConfigDetails(slave.CHANNELS) : [],
    }));

    return {
      devices: devicesArray,
      folderName,
    };
  }
);


// Convert the CHANNELS object to configDetails array format
function convertChannelsToConfigDetails(channels) {
  if (!channels) return [];

  return Object.entries(channels).map(([key, channel], index) => {
    return {
      serialNo: index + 1,
      parameterName: channel.CHANNEL_NAME || "",
      addressType: channel.CHANNEL_ADDRESS?.startsWith('0x') ? "Hex" : "Decimal",
      address: channel.CHANNEL_ADDRESS || "",
      dataType: convertDataTypeToUi(channel.CHANNEL_REGISTER_TYPE),
      unit: channel.CHANNEL_UNIT || "",
      registerFunction: convertRegisterFunctionToUi(channel.CHANNEL_REGISTER_FUNCTION),
      scalingDecimal: convertScalingDecimalToUi(channel.CHANNEL_SCALING_DECIMAL)
    };
  });
}

// Convert numeric scaling decimal to UI representation
function convertScalingDecimalToUi(decimalValue) {
  const scaleMap = {
    0: "no decimal",
    1: "1 decimal",
    2: "2 decimal",
    3: "3 decimal"
  };
  return scaleMap[decimalValue] || "no decimal";
}

// Convert UI scaling decimal to numeric value for API
function convertScalingDecimalToApi(uiValue) {
  const scaleMap = {
    "no decimal": 0,
    "1 decimal": 1,
    "2 decimal": 2,
    "3 decimal": 3,
    "4 decimal": 4
  };
  return scaleMap[uiValue] !== undefined ? scaleMap[uiValue] : 0;
}


// Convert the data type code to UI representation
function convertDataTypeToUi(dataTypeCode) {
  // Old mapping (commented out as requested)
  // const dataTypeMap = {
  //   1: "UINT16",
  //   2: "INT16",
  //   3: "UINT32",
  //   4: "INT32",
  //   5: "FLOAT",
  //   6: "DOUBLE",
  //   7: "STRING"
  // };

  // New mapping
  // const dataTypeMap = {
  //   1: "1-byte(LITTLE ENDIAN)",
  //   2: "2-byte(LITTLE ENDIAN)",
  //   3: "2-byte(BIG ENDIAN)",
  //   4: "FLOAT(LITTLE ENDIAN)",
  //   5: "FLOAT(BIG ENDIAN)",
  //   6:"4-byte(LITTLE ENDIAN)",
  //   7:"4-byte(BIG ENDIAN)"
  // };
  const dataTypeMap = {
    1: "1-byte(8-BIT)",
    2: "HEX(LITTLE ENDIAN)",
    3: "HEX(BIG ENDIAN)",
    4: "FLOAT(LITTLE ENDIAN)",
    5: "FLOAT(BIG ENDIAN)",
    6: "FLOAT(LITTLE SWAP ENDIAN)",
    7: "FLOAT(BIG SWAP ENDIAN)",
    8: "4-byte(LITTLE ENDIAN)",
    9: "4-byte(BIG ENDIAN)",
    10: "4-byte(LITTLE SWAP ENDIAN)",
    11: "4-byte(BIG SWAP ENDIAN)"
  };

  return dataTypeMap[dataTypeCode] || "";
}

// Convert the register function code to UI representation
function convertRegisterFunctionToUi(functionCode) {
  const functionMap = {
    1: "0x01 Read Coils",
    2: "0x02 Read Discrete Inputs",
    3: "0x03 Read Holding Registers",
    4: "0x04 Read Input Register"
  };
  return functionMap[functionCode] || "";
}

// Convert UI data type to code for API
function convertDataTypeToCode(dataType) {
  // Old mapping (commented out as requested)
  // const dataTypeMap = {
  //   "UINT16": 1,
  //   "INT16": 2,
  //   "UINT32": 3,
  //   "INT32": 4,
  //   "FLOAT": 5,
  //   "DOUBLE": 6,
  //   "STRING": 7
  // };

  // New mapping
  // const dataTypeMap = {
  //   "1-byte(LITTLE ENDIAN)": 1,
  //   "2-byte(LITTLE ENDIAN)": 2,
  //   "2-byte(BIG ENDIAN)": 3,
  //   "FLOAT(LITTLE ENDIAN)": 4,
  //   "FLOAT(BIG ENDIAN)": 5,
  //   "4-byte(LITTLE ENDIAN)":6,
  //   "4-byte(BIG ENDIAN)":7
  // };
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

  return dataTypeMap[dataType] || 2; // Default to 2-byte(LITTLE ENDIAN) if not found
}


// Convert UI register function to code for API
function convertRegisterFunctionToCode(registerFunction) {
  if (registerFunction.includes("0x01")) return 1;
  if (registerFunction.includes("0x02")) return 2;
  if (registerFunction.includes("0x03")) return 3;
  if (registerFunction.includes("0x04")) return 4;
  return 4; // Default to Read Input Register
}

export const saveDevices = createAsyncThunk(
  "devices/saveDevices",
  async ({ devices, folderName }) => {
    const currentDate = getFormattedDate();
    const currentTime = getFormattedTime();


    console.log("slave--devices--", devices)


    // Create the base structure
    const formattedData = {
      SLAVE_CONFIGURATION: {
        SLAVE_MAIN_FOLDER_NAME: folderName,
        SLAVE_COUNT: devices.length,
        SLAVE_DEVICES: {}
      }
    };

    // Add each device to the SLAVE_DEVICES object
    devices.forEach((device, index) => {
      const slaveKey = `SLAVE_${index + 1}`;

      // Base device data
      formattedData.SLAVE_CONFIGURATION.SLAVE_DEVICES[slaveKey] = {
        LOCAL_DATE: currentDate,
        LOCAL_TIME: currentTime,
        SLAVE_ID: parseInt(device.slaveId, 10) || 1,
        SLAVE_BATCH_ID: `BATCH_${String.fromCharCode(65 + index)}1`, // A1, B1, C1, etc.
        SLAVE_NAME: device.name || `Device${index + 1}`,
        MAKE: device.make || "DEFAULT",
        MODEL: device.model || "DEFAULT",
        CONTROLLER_PIN: device.controllerPin || "",
        PROTOCOL: "MODBUS",
        STORAGE_COUNT: 100,
        STORAGE_RATE: 10
      };

      // Add channels if MAKE and MODEL are both "OTHERS" and configDetails exists
      if (device.make === "OTHERS" && device.model === "OTHERS" && device.configDetails && device.configDetails.length > 0) {
        // Add CHANNEL_COUNT before channels object
        formattedData.SLAVE_CONFIGURATION.SLAVE_DEVICES[slaveKey].CHANNEL_COUNT = device.configDetails.length;

        const channels = {};
        console.log("DISHANT Config Details:", device.configDetails);

        device.configDetails.forEach((config, configIndex) => {
          const channelKey = `CHANNEL_${configIndex + 1}`;

          channels[channelKey] = {
            CHANNEL_NAME: config.parameterName || `Parameter${configIndex + 1}`,
            CHANNEL_ADDRESS_TYPE: config.addressType === "Hex" ? 1 : 2,
            CHANNEL_ADDRESS: config.address || "40001",
            CHANNEL_REGISTER_TYPE: convertDataTypeToCode(config.dataType),
            CHANNEL_REGISTER_FUNCTION: convertRegisterFunctionToCode(config.registerFunction),
            CHANNEL_SCALING_DECIMAL: convertScalingDecimalToApi(config.scalingDecimal),
            CHANNEL_UNIT: config.unit || ""
            // CHANNEL_VALUE and CHANNEL_VALUE_STR removed as requested
          };
        });

        // Add channels directly to the slave device
        formattedData.SLAVE_CONFIGURATION.SLAVE_DEVICES[slaveKey].CHANNELS = channels;
      }
    });

    console.log("Formatted data:", JSON.stringify(formattedData, null, 2));

    const response = await updateSlaveConfig(formattedData);
    return response;
  }
);

const devicesSlice = createSlice({
  name: "devices",
  initialState: {
    devices: [],
    newFolder: "",
    loading: false,
    error: null,
  },
  reducers: {
    addDevice: (state, action) => {
      const newDevice = action.payload;
      const isDuplicate = state.devices.some(
        (device) => device.slaveId === newDevice.slaveId || device.name === newDevice.name
      );
      if (isDuplicate) {
        toast.error("DEVICE ALREADY EXISTS");
        return;
      }
      state.devices.push(newDevice);
      toast.success("DEVICE ADDED TO LIST");
    },
    setFolderName: (state, action) => {
      state.newFolder = action.payload
    },
    deleteDevice: (state, action) => {
      const index = action.payload;
      state.devices.splice(index, 1);
    },
    updateDevice: (state, action) => {
      const { index, field, value } = action.payload;
      state.devices[index][field] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.devices;
        state.newFolder = action.payload.folderName;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error("FAILED TO FETCH DEVICES");
      })
      .addCase(saveDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDevices.fulfilled, (state) => {
        state.loading = false;
        toast.success("DEVICES CONFIGURED SUCCESSFULLY");
      })
      .addCase(saveDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error("FAILED TO SAVE DEVICES");
      });
  },
});

export const { addDevice, deleteDevice, updateDevice, setFolderName } = devicesSlice.actions;
export default devicesSlice.reducer;