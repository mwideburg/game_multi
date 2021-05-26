const users = []
const games = []

const addUser = (id, name, room, position, selected) => {
    const existingUser = users.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase())

    if (existingUser) return { error: "Username has already been taken" }
    if (!name && !room) return { error: "Username and room are required" }
    if (!name) return { error: "Username is required" }
    if (!room) return { error: "Room is required" }
    
    const user = { id, name, room, position: undefined, selected: "none", ball: null}
    users.push(user)
    return { user }
}

const updatePosition = (position, id, ball) => {
    const user = users.find(user => user.id === id)
    user.position = position
  
    if(ball != undefined){
        user.ball = [ball.x, ball.y, ball.z]
    }
    
    return {user}
}
const selectedPlayer = (id) => {
    console.log("EEHIWHELWJB")
    let user = users.find(user => user.id == id )
    let roomUsers = getUsers(user.room)
    console.log(roomUsers)
    let player = "player1"
    roomUsers.forEach(u => {
        
        if(u.selected === "player1"){
            player = "player2"
        }else if (u.selected === "player2"){
            player = "full"
        }
    })
    if(user.selected != "none"){
        return { selected: user.selected, user: user };
    }
    if(player === "full"){
        user.selected = player
        console.log("hey")
        return { selected: user.selected, user: user };
    }
    
    user.selected = player
    if(player === "player1"){
        user.position = [-5, 0, 0]
       
        
    }else if(player === "player2"){
        user.position = [5, 0, 0]
        
    }
    console.log(player)
    return { selected: user.selected, user: user }
}
const getUser = id => {
    let user = users.find(user => user.id == id)
    return user
}

const getGame = (room) => {
    

    let game = games.find(game => game.room == room)
    if(game != undefined){
        return game;
    }
    console.log("making a game")
    game = {room: room, status: false}
    games.push(game)
    return [game]
}
const setGame = (room) => {
    let game = games.find(game => game.room === room)
    games.status = true
    return game
}

const deleteUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) return users.splice(index, 1)[0];
}

const getUsers = (room) => users.filter(user => user.room === room)
// const getGame = (room) => games.filter(game => room.game === room)

module.exports = { addUser, getUser, deleteUser, getUsers, updatePosition, selectedPlayer, getGame, setGame }
