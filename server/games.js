
const Game = require('./game')
const { addUser, getUser, deleteUser, getUsers } = require('./users')

const games = {}
const addGame = (id, name, room) => {
   
    if (games[room]){
        
        return games[room]
    }
    
    const game = new Game(room, id)
   
    games[room] = game
    
    return  game 
}

const joinGame = (room, socket, name) => {
    
    const game = games[room]
    
    const player = game.addPlayer(socket, name)
    socket.in(room).emit("addPlayer", player)
    return  player
}

const deletePlayer = (id, room) => {
    const game_room = getGameById(id)[0]
    if(game_room === undefined) return
    
    if(games[game_room.room] === undefined) return
    const sockets = games[game_room.room].removePlayer(id)

    if (sockets.length === 0){
        delete games[game_room.room]
    }
    
    
}

const playAgain = (room) => {
    games[room].resetGame()
}

const deleteGame = (id) => {
  
}
const getGames = () => {
    return games
}
const getNames = (room) => {
    const game = games[room]
    return {
        player1: game.player1,
        player2: game.player2
    }
}
const getGame = (room) => {
   
    return games[room]
}
const getGameById = (id) => {
    const room = Object.values(games).filter(game => {
       
        if(game.sockets === undefined) return
        const sockets = Object.keys(game.sockets)
        if(sockets.includes(id)){
           
            return game.room
        }
    })
    return room
}
module.exports = { addGame, joinGame, deletePlayer, getGame, deleteGame, playAgain, getGames }
