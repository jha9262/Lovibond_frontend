import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const deviceService = {
  getSampleConfiguration: async () => {
    const response = await axios.get(`${API_URL}/SAMPLE_CONFIGURATION`, { params: { _t: Date.now() }, timeout: 15000 })
    return response.data
  },

  selectSample: async (id, name) => {
    const sId = id || name || '';
    const response = await axios.get(`${API_URL}/SAMPLE_MANAGER_CONFIGURATION`, { 
      params: { ID: sId, SAMPLE_ID: sId, MODULE: 2, _t: Date.now() },
      headers: { 'Custom-Sample-ID': sId },
      timeout: 5000
    })
    return response.data
  },

  getLiveData: async (sampleId) => {
    const sId = sampleId || '';
    const response = await axios.get(`${API_URL}/LIVE_DATA`, { 
      params: { ID: sId, SAMPLE_ID: sId, 'Custom-Sample-ID': sId, _t: Date.now() },
      headers: { 'Custom-Sample-ID': sId },
      timeout: 15000
    })
    return response.data
  },

  setDeviceState: async (isOn) => {
    const stateStr = isOn ? 'CONNECT' : 'DISCONNECT'
    const response = await axios.get(`${API_URL}/DEVICE_CONNECTION`, {
      params: { STATE: stateStr, MODULE: 2, _t: Date.now() },
      timeout: 5000
    })
    return response.data
  },

  saveSnapshot: async (sampleId, activeTest) => {
    const sId = sampleId || '';
    const response = await axios.get(`${API_URL}/SAVE_UPDATE`, { 
      params: { ID: sId, SAMPLE_ID: sId, MODULE: 2, ACTIVE_TEST: activeTest, _t: Date.now() },
      headers: { 'Custom-Sample-ID': sId },
      timeout: 15000 
    })
    return response.data
  },
}
