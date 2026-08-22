import api from '../api'

export const getSamples = () => api.get('/samples')
export const getSampleById = (id) => api.get(`/samples/${id}`)
export const deleteSample = (id) => api.delete(`/samples/${id}`)
