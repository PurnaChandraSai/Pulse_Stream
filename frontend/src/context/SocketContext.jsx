import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [processingVideos, setProcessingVideos] = useState({})

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    })
    
    setSocket(newSocket)

    newSocket.on('processing:update', (data) => {
      setProcessingVideos(prev => ({
        ...prev,
        [data.videoId]: data
      }))
    })

    return () => newSocket.close()
  }, [])

  return (
    <SocketContext.Provider value={{ socket, processingVideos }}>
      {children}
    </SocketContext.Provider>
  )
}
