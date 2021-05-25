const users = []


const addUser = (id, name, room, position, selected) => {
    const existingUser = users.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase())

    if (existingUser) return { error: "Username has already been taken" }
    if (!name && !room) return { error: "Username and room are required" }
    if (!name) return { error: "Username is required" }
    if (!room) return { error: "Room is required" }
    
    const user = { id, name, room, position: undefined, selected, ball: null}
    users.push(user)
    return { user }
}

const updatePosition = (position, id, ball) => {
    const user = users.find(user => user.id === id)
    user.position = position
    console.log(ball)
    if(ball != undefined){
        user.ball = [ball.x, ball.y, ball.z]
    }
    
    return {user}
}
const selectedPlayer = (id, selected) => {
    let user = users.find(user => user.id == id )
    user.selected = selected
    if(selected === "player1"){
        user.position = [-5, 0, 0]
    }else if(selected === "player2"){
        user.position = [5, 0, 0]
    }

    return {user}
}
const getUser = id => {
    let user = users.find(user => user.id == id)
    return user
}

const deleteUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) return users.splice(index, 1)[0];
}

const getUsers = (room) => users.filter(user => user.room === room)
// const getGame = (room) => games.filter(game => room.game === room)

module.exports = { addUser, getUser, deleteUser, getUsers, updatePosition, selectedPlayer }
