import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const deviceService = {
  getSampleConfiguration: async () => {
    const response = await axios.get(`${API_URL}/samples`, { headers: { 'Cache-Control': 'no-store' }, timeout: 5000 })
    return response.data
  },

  selectSample: async (id, name) => {
    const response = await axios.get(`${API_URL}/select_sample`, { 
      params: { id, name },
      headers: { 'Cache-Control': 'no-store' },
      timeout: 5000
    })
    return response.data
  },

  getLiveData: async (sampleId) => {
    const response = await axios.get(`${API_URL}/LIVE_DATA`, { headers: { 'Cache-Control': 'no-store', 'Custom-Sample-ID': sampleId || '' }, timeout: 5000 })
    return response.data
  },

  setDeviceState: async (isOn) => {
    const stateStr = isOn ? 'on' : 'off'
    const response = await axios.get(`${API_URL}/websocket_connection`, {
      params: { state: stateStr, module: 'photo' },
      headers: { 'Cache-Control': 'no-store' },
      timeout: 5000
    })
    return response.data
  },

  saveSnapshot: async () => {
    const response = await axios.get(`${API_URL}/update`, { headers: { 'Cache-Control': 'no-store' }, timeout: 5000 })
    return response.data
  },
}
