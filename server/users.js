const users = []


const addUser = (id, name, room) => {
    const existingUser = users.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase())

    if (existingUser) return { error: "Username has already been taken" }
    if (!name && !room) return { error: "Username and room are required" }
    if (!name) return { error: "Username is required" }
    if (!room) return { error: "Room is required" }
    
    
    const user = { id, name, room, position: undefined, game: null, selected: "none", ball: null }
    
    
    users.push(user)
    return { user }
}
const setGame = (user, game) => {
    const use = getUser(user.id)
    use.game = { room: game.room, player1: game.player1, player2: game.player2, start: game.start }
    updateGame(user, game)
    return use
}
const updateGame = (user, game) => {
    users.forEach(u => {
        if (u.room === user.room) {
            u.game = { room: game.room, player1: game.player1, player2: game.player2, start: game.start }
        }
    })
}
const getUser = id => {
    let user = users.find(user => user.id == id)
    return user
}
const setPlayer = (player, user) => {
    if(player === undefined) return;
    console.log(player)
    const use = getUser(user.id)
    use.selected = player.selected
}

const deleteUser = (id) => {
  
    const index = users.findIndex((user) => user.id === id);

    
    if (index !== -1) return users.splice(index, 1)[0];
}


const getUsers = (room) => users.filter(user => user.room === room)


module.exports = { addUser, getUser, deleteUser, getUsers, setGame, setPlayer, updateGame}
