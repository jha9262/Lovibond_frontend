import axios from 'axios';
import { API_BASE_URL as BASE_URL } from '../config/index.js';

const deviceService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
deviceService.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = error.message || 'Network Error';
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        try {
          const parsed = JSON.parse(error.response.data);
          message = parsed.MESSAGE || parsed.message || error.response.data;
        } catch {
          message = error.response.data;
        }
      } else if (error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data.MESSAGE) {
        message = error.response.data.MESSAGE;
      }
    }
    console.error('API Error:', message);
    return Promise.reject(message);
  }
);

export const login = (deviceId, password) => {
  const base64Credentials = btoa(`${deviceId}:${password}`);
  return deviceService.get('/LOGIN', {
    headers: { Authorization: `Basic ${base64Credentials}` }
  });
};

export const getLoggerConfig = () => deviceService.get('/DEVICE_DATA_LOGGER_CONFIGURATION');
export const updateLoggerConfig = (data) => deviceService.post('/DEVICE_DATA_LOGGER_CONFIGURATION', data);

export const getSlaveConfig = () => deviceService.get('/SLAVE_CONFIGURATION_DATA?REFRESH=TRUE');
export const updateSlaveConfig = (data) => deviceService.post('/SLAVE_CONFIGURATION_DATA', data);

export const getReports = (path, pathType) => 
  deviceService.get(`/REPORT_FILE_NAME_GET?REFRESH=TRUE&PATH=${path}&PATH_TYPE=${pathType}`);

export const getReportLogs = (params) => deviceService.get('/REPORT_LOGS', { params });

export const deleteReport = (path) => deviceService.delete(`/REPORT_FILE_NAME_DELETE?FILE_PATH=${path}`);

export const downloadReport = (path, fileName) => 
  deviceService.get(`/REPORT_LOG_DOWNLOAD?FILE_PATH=${path}&FILE_FORMAT=csv&FILE_NAME=${fileName}`, {
    responseType: 'blob'
  });

export const fetchLiveStatus = () => deviceService.get('/PID_LIVE_DATA');

export const updateDeviceState = (deviceState) => 
  deviceService.post('/LIVE_DATA_DEVICE_STATE', { DEVICE_STATE: deviceState });

export const updateSV = (payload) => 
  deviceService.post('/SET_SV', payload);

// Settings Management
export const getDeviceSettings = async (refresh, slaveInfo, mode) => {
  const data = await deviceService.get('/SAVED_DEVICE_SETTING_DATA_GET', {
    params: {
      REFRESH: refresh,
      SLAVE_ID: slaveInfo.SLAVE_ID,
      SLAVE_NAME: slaveInfo.SLAVE_NAME,
      SLAVE_MAKE: slaveInfo.SLAVE_MAKE,
      SLAVE_MODEL: slaveInfo.SLAVE_MODEL,
      SLAVE_NO: slaveInfo.SLAVE_NO,
      MODE: mode
    }
  });
  return data;
};

export const updateDeviceSettings = async (slaveInfo, settingsData) => {
  const data = await deviceService.put('/UPDATED_DEVICE_SETTING_DATA', settingsData, {
    params: {
      SLAVE_ID: slaveInfo.SLAVE_ID,
      SLAVE_NAME: slaveInfo.SLAVE_NAME,
      SLAVE_MAKE: slaveInfo.SLAVE_MAKE,
      SLAVE_MODEL: slaveInfo.SLAVE_MODEL,
      SLAVE_NO: slaveInfo.SLAVE_NO
    }
  });
  return data;
};

export const postDeviceSettings = async (slaveInfo, settingsData, mode) => {
  const data = await deviceService.post('/POST_SAVED_DEVICE_SETTING_DATA', settingsData, {
    params: {
      REFRESH: 'FALSE',
      SLAVE_ID: slaveInfo.SLAVE_ID,
      SLAVE_NAME: slaveInfo.SLAVE_NAME,
      SLAVE_MAKE: slaveInfo.SLAVE_MAKE,
      SLAVE_MODEL: slaveInfo.SLAVE_MODEL,
      SLAVE_NO: slaveInfo.SLAVE_NO,
      MODE: mode
    }
  });
  return data;
};

export const setSoftAlarm = async (alarmData) => {
  const data = await deviceService.post('/SOFT_SETTING', alarmData);
  return data;
};

// Batch & System
export const mainLogin = async (deviceId, password) => {
  const base64Credentials = btoa(`${deviceId}:${password}`);
  const data = await deviceService.get('/LOGIN', {
    headers: {
      Authorization: `Basic ${base64Credentials}`,
    },
  });
  return data;
};

export const batchConfiguration = async (payload) => {
  const data = await deviceService.post('/BATCH_CONFIGURATION', payload);
  return data;
};

export default deviceService;
