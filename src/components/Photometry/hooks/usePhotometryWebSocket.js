import { useState, useEffect, useRef } from 'react'
import { deviceWebSocket } from '../services/deviceWebSocket'

/**
 * Hook for automatic WebSocket control.
 * Auto-connects when a sampleId is selected.
 */
export const usePhotometryWebSocket = (sampleId) => {
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

  // Auto-connect when sample changes
  useEffect(() => {
    setLiveData(null)
    
    if (!sampleId) {
      if (deviceWebSocket.getStatus() === 'CONNECTED' || deviceWebSocket.getStatus() === 'CONNECTING') {
        deviceWebSocket.disconnect()
      }
      return
    }

    setIsConnecting(true)
    deviceWebSocket.connect(sampleId).catch((err) => {
      console.error('WebSocket auto-connect failed:', err)
      if (isMountedRef.current) setIsConnecting(false)
    })
  }, [sampleId])

  // Allow setting initial data before websocket frames arrive
  const setInitialData = (data) => {
    if (isMountedRef.current) setLiveData(data)
  }

  return { connectionStatus, liveData, isConnecting, setInitialData }
}
