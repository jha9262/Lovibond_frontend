import { createContext, useContext, useState } from 'react'

const LiveStatusContext = createContext(null)

export const LiveStatusProvider = ({ children }) => {
  const [connected, setConnected] = useState(false)
  return (
    <LiveStatusContext.Provider value={{ connected, setConnected }}>
      {children}
    </LiveStatusContext.Provider>
  )
}

export const useLiveStatus = () => useContext(LiveStatusContext)
