import axios from 'axios'

const WS_URL = import.meta.env.VITE_DEVICE_WS_URL || 'ws://192.168.4.1/LIVE_DATA'
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api'

let _ws = null
let _listeners = []
let _statusListeners = []
let _connectionState = 'DISCONNECTED'
let _currentSampleId = null

const notify = (payload) => _listeners.forEach((cb) => cb(payload))
const setStatus = (status) => { _connectionState = status; _statusListeners.forEach((cb) => cb(status)) }

const setEsp32StreamState = async (state) => {
  try {
    const apiState = state === 'on' ? 'CONNECT' : 'DISCONNECT'
    await axios.get(`${API_URL}/DEVICE_CONNECTION`, {
      params: { STATE: apiState, module: 2, _t: Date.now() },
    })
    console.log(`[deviceWebSocket] ESP32 stream state set to: ${apiState} (module: 2)`)
  } catch (err) {
    console.warn(`[deviceWebSocket] Could not set stream state to "${state}":`, err.message)
  }
}

export const deviceWebSocket = {

  /**
   * Manual connect flow:
   * 1. Calls GET /websocket_connection?state=on  → tells ESP32 to start streaming
   * 2. Opens the WebSocket connection
   */
  async connect(sampleId) {
    // If already connected to a DIFFERENT sample, disconnect first
    if (_currentSampleId !== sampleId && (_connectionState === 'CONNECTED' || _connectionState === 'CONNECTING')) {
      console.log('[deviceWebSocket] Sample changed, reconnecting...')
      if (_ws) { _ws.close(); _ws = null }
      setStatus('DISCONNECTED')
    }

    _currentSampleId = sampleId
    if (_connectionState === 'CONNECTED' || _connectionState === 'CONNECTING') return
    setStatus('CONNECTING')

    // Step 1: Tell ESP32 to start streaming
    await setEsp32StreamState('on')

    // Step 2: Open WebSocket
    _ws = new WebSocket(WS_URL)
    _ws.onopen = () => { setStatus('CONNECTED'); console.log('[deviceWebSocket] Connected') }
    _ws.onmessage = (event) => {
      try { notify(JSON.parse(event.data)) } catch (err) { console.error('[deviceWebSocket] Parse error', err) }
    }
    _ws.onerror = (error) => console.error('[deviceWebSocket] Error:', error)
    _ws.onclose = () => { console.log('[deviceWebSocket] Disconnected'); setStatus('DISCONNECTED'); _ws = null }
  },

  /**
   * Manual disconnect flow:
   * 1. Calls GET /websocket_connection?state=off  → tells ESP32 to stop streaming
   * 2. Closes the WebSocket connection
   */
  async disconnect() {
    // Step 1: Tell ESP32 to stop streaming
    await setEsp32StreamState('off')

    // Step 2: Close WebSocket
    if (_ws) { _ws.close(); _ws = null; setStatus('DISCONNECTED') }
  },

  onMessage(cb) {
    _listeners.push(cb)
    return () => { _listeners = _listeners.filter((l) => l !== cb) }
  },

  onStatusChange(cb) {
    _statusListeners.push(cb)
    cb(_connectionState)
    return () => { _statusListeners = _statusListeners.filter((l) => l !== cb) }
  },

  getStatus() { return _connectionState },
}
