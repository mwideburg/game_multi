import React from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

const SocketProvider = ({ children }) => {
    let ENDPOINT
    
    if(process.env.NODE_ENV === 'production'){
        console.log("google")
        // ENDPOINT = 'https://pongrooms.uk.r.appspot.com/'
        ENDPOINT = 'http://localhost:5000'
    }else{
        console.log("Local")
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