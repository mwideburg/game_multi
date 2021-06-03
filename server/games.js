

const { addUser, getUser, deleteUser, getUsers } = require('./users')

const games = []
const addGame = (id, room, scene) => {
    const alreadyExists = games.find(game => game.id.trim().toLowerCase() === name.trim().toLowerCase())
    if(alreadyExists){
        const game = getGame(room)
        return {scene}
    }
    const users = getUsers(room)
    const game = { id, room, users }
    games.push(game)
    return { game }
}

const addPlayer = (room, user) => {
    
    const game = getGame(room)
    game.users.push(user)
    return { game }
}

const deletePlayer = (id, room) => {
    const game = getGame(room)
    let users = game.users.filter(user => {user.id != id})
    
    if (index !== -1){
        game.users = users
        return {game}
    }
}

const getGame = (room) => games.filter(game => game.room === room)

module.exports = { addGame, addPlayer, deletePlayer, getGame }
