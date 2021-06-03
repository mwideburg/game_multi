import React, { useState } from 'react'

const UsersContext = React.createContext()

const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [games, setGames] = useState([])
    return (
        <UsersContext.Provider value={{ users, games, setUsers, setGames }}>
            {children}
        </UsersContext.Provider>
    )
}

export { UsersContext, UsersProvider } 