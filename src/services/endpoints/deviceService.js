import api from '../api'

export const getDeviceStatus = () => api.get('/status')
export const rebootDevice = () => api.post('/reboot')
