import { useState, useEffect, useRef } from 'react'
import { deviceWebSocket } from '../services/deviceWebSocket'

/**
 * Hook for automatic WebSocket control.
 * Auto-connects when a sampleId is selected.
 */
export const useElectrochemistryWebSocket = (sampleId) => {
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED')
  const [liveData, setLiveData] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const isMountedRef = useRef(true)

  // Subscribe to WebSocket messages and status changes
  useEffect(() => {
    isMountedRef.current = true

    const unsubMessage = deviceWebSocket.onMessage((data) => {
      if (isMountedRef.current && data) setLiveData(data)
    })

    const unsubStatus = deviceWebSocket.onStatusChange((status) => {
      if (isMountedRef.current) {
        setConnectionStatus(status)
        if (status === 'CONNECTED' || status === 'DISCONNECTED' || status === 'ERROR') {
          setIsConnecting(false)
        }
      }
    })

    return () => {
      isMountedRef.current = false
      unsubMessage()
      unsubStatus()
      deviceWebSocket.disconnect()
    }
  }, [])

  // Clear live data when sample changes so stale data is not shown
  useEffect(() => {
    setLiveData(null)
  }, [sampleId])

  // Allow setting initial data before websocket frames arrive
  const setInitialData = (data) => {
    if (isMountedRef.current) setLiveData(data)
  }

  const connect = async () => {
    if (!sampleId) return
    setIsConnecting(true)
    try {
      await deviceWebSocket.connect(sampleId)
    } catch (err) {
      console.error('WebSocket connect failed:', err)
      if (isMountedRef.current) setIsConnecting(false)
      throw err
    }
  }

  const disconnect = async () => {
    await deviceWebSocket.disconnect()
  }

  return { connectionStatus, liveData, isConnecting, setInitialData, connect, disconnect }
}
