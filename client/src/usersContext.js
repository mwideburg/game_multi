import React, { useState } from 'react'

const UsersContext = React.createContext()

const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [game, setGame] = useState([])
    return (
        <UsersContext.Provider value={{ users, game, setUsers, setGame }}>
            {children}
        </UsersContext.Provider>
    )
}

export { UsersContext, UsersProvider } 