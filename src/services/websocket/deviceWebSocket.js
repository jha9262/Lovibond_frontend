import { ESP32_IP, WS_RECONNECT_INTERVAL } from '../../config'
import USE_MOCK, { generateMockData } from './mocks'

let socket = null
let reconnectTimer = null
const listeners = new Set()

export const subscribe = (fn) => listeners.add(fn)
export const unsubscribe = (fn) => listeners.delete(fn)

const emit = (data) => listeners.forEach((fn) => fn(data))

export const connect = () => {
  if (USE_MOCK) {
    reconnectTimer = setInterval(() => emit(generateMockData()), 1000)
    return
  }

  socket = new WebSocket(`ws://${ESP32_IP}/ws`)

  socket.onmessage = (e) => emit(JSON.parse(e.data))
  socket.onclose = () => {
    reconnectTimer = setTimeout(connect, WS_RECONNECT_INTERVAL)
  }
}

export const disconnect = () => {
  clearInterval(reconnectTimer)
  clearTimeout(reconnectTimer)
  socket?.close()
  socket = null
}
