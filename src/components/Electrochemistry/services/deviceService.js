import axios from 'axios'
import { deviceMock } from '../mocks/deviceMock'



const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const deviceService = {
  getSampleConfiguration: async () => {
    // using global USE_MOCK if exists, else fallback to false
    const mock = typeof USE_MOCK !== 'undefined' ? USE_MOCK : false;
    if (mock) return deviceMock.getSampleConfiguration()
    const response = await axios.get(`${API_URL}/SAMPLE_CONFIGURATION`, { params: { _t: Date.now() }, timeout: 15000 })
    return response.data
  },

  selectSample: async (id, name) => {
    const mock = typeof USE_MOCK !== 'undefined' ? USE_MOCK : false;
    if (mock) return { success: true }
    const sId = id || name || '';
    const response = await axios.get(`${API_URL}/SAMPLE_MANAGER_CONFIGURATION`, { 
      params: { ID: sId, SAMPLE_ID: sId, MODULE: 1, _t: Date.now() },
      headers: { 'Custom-Sample-ID': sId },
      timeout: 15000
    })
    return response.data
  },

  getLiveData: async (sampleId) => {
    const mock = typeof USE_MOCK !== 'undefined' ? USE_MOCK : false;
    if (mock) return deviceMock.getLiveData(sampleId)
    const sId = sampleId || '';
    const response = await axios.get(`${API_URL}/LIVE_DATA`, { 
      params: { ID: sId, SAMPLE_ID: sId, 'Custom-Sample-ID': sId, _t: Date.now() },
      headers: { 'Custom-Sample-ID': sId },
      timeout: 15000
    })
    return response.data
  },

  setDeviceState: async (isOn) => {
    const mock = typeof USE_MOCK !== 'undefined' ? USE_MOCK : false;
    if (mock) return { success: true }
    const stateStr = isOn ? 'CONNECT' : 'DISCONNECT'
    console.log("stateStr",stateStr)
    const response = await axios.get(`${API_URL}/DEVICE_CONNECTION`, {
      params: { STATE: stateStr, MODULE: 1, _t: Date.now() },
      timeout: 15000
    })
    return response.data
  },

  saveSnapshot: async (sampleId, activeTest) => {
    const sId = sampleId || '';
    const response = await axios.get(`${API_URL}/SAVE_UPDATE`, { 
      params: { ID: sId, SAMPLE_ID: sId, MODULE: 1, ACTIVE_TEST: activeTest, _t: Date.now() },
      headers: { 'Custom-Sample-ID': sId },
      timeout: 15000 
    })
    return response.data
  },
}
