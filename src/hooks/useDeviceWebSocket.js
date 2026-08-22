import { useEffect, useState } from 'react'
import { connect, disconnect, subscribe, unsubscribe } from '../services/websocket/deviceWebSocket'

export const useDeviceWebSocket = () => {
  const [data, setData] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const handler = (payload) => {
      setData(payload)
      setConnected(true)
    }
    subscribe(handler)
    connect()
    return () => {
      unsubscribe(handler)
      disconnect()
    }
  }, [])

  return { data, connected }
}
