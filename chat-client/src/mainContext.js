import React, { useState } from 'react'

const MainContext = React.createContext()

const MainProvider = ({ children }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [game, setGame] = useState('')
    return (
        <MainContext.Provider value={{ name, room, game, setName, setRoom, setGame }}>
            {children}
        </MainContext.Provider>
    )
}

export { MainContext, MainProvider } 