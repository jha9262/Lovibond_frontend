import { useEffect, useState } from 'react'
import { getSamples } from '../services/endpoints/sampleService'

export const useSampleData = () => {
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSamples()
      .then((res) => setSamples(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { samples, loading, error }
}
