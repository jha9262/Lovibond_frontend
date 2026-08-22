import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

const normaliseSample = (sample) => ({
  sampleId: sample.sampleId ?? sample.SAMPLE_ID ?? '',
  userId: sample.userId ?? sample.USER_ID ?? '',
  userName: sample.userName ?? sample.USER_NAME ?? '',
  createdDate: sample.createdDate ?? sample.CREATE_DATE_TIME ?? sample.CREATE_DATE ?? '',
})

export const sampleService = {
  async getSamples({ page = 1, limit = 10, search = '' } = {}) {
    try {
      const { data } = await apiClient.get('/samples')
      const rawSamples = data?.SAMPLE_CONFIGURATION?.SAMPLES
        ? Object.values(data.SAMPLE_CONFIGURATION.SAMPLES)
        : Array.isArray(data) ? data : []

      const searchLower = search.toLowerCase().trim()
      const filtered = searchLower
        ? rawSamples.filter((s) => {
            const id = String(s.SAMPLE_ID || s.sampleId || '').toLowerCase()
            const name = String(s.USER_NAME || s.userName || '').toLowerCase()
            return id.includes(searchLower) || name.includes(searchLower)
          })
        : rawSamples

      const total = filtered.length
      const totalPages = Math.ceil(total / limit) || 1
      const startIndex = (page - 1) * limit
      return {
        samples: filtered.slice(startIndex, startIndex + limit).map(normaliseSample),
        pagination: { page, limit, total, totalPages },
      }
    } catch (error) {
      console.error('[sampleService] Failed to fetch samples:', error)
      throw new Error(error.response?.data?.message || 'Unable to retrieve sample data from device.')
    }
  },

  async createSamples(samplesList) {
    try {
      const samplesObj = samplesList.reduce((acc, p, index) => {
        acc[`S_${index + 1}`] = {
          SAMPLE_ID: p.sampleId,
          SAMPLE_NAME: p.sampleId,
          CREATE_DATE_TIME: new Date().toISOString(),
          USER_ID: p.userId || '',
        }
        return acc
      }, {})

      await apiClient.post('/samples', {
        SAMPLE_CONFIGURATION: { SAMPLE_AVAILABLE_COUNT: 0, NEW_SAMPLE_ADD_COUNT: samplesList.length, SAMPLES: samplesObj },
      }, { headers: { 'Content-Type': 'application/json' } })

      return { created: samplesList.map(normaliseSample), failed: [] }
    } catch (error) {
      console.error('[sampleService] Failed to bulk create samples:', error)
      throw new Error('Unable to save samples to the device.')
    }
  },
}
