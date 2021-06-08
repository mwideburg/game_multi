import React from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

const SocketProvider = ({ children }) => {
    let ENDPOINT
    
    if(process.env.NODE_ENV === 'production'){
        ENDPOINT = 'https://pongrooms.uk.r.appspot.com/'
    }else{
        ENDPOINT = 'http://localhost:5000'
    }
    const socket = io(ENDPOINT, { transports: ['websocket', 'polling'] })
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider }