import React, { useState } from 'react'

const MainContext = React.createContext()

const MainProvider = ({ children }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [game, setGame] = useState('')
    const [id, setID] = useState('')
    return (
        <MainContext.Provider value={{ name, room, game, id, setName, setRoom, setGame, setID }}>
            {children}
        </MainContext.Provider>
    )
}

export { MainContext, MainProvider } 