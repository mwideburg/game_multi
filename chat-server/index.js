const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const PORT = process.env.PORT || 5000
const { addUser, getUser, deleteUser, getUsers, updatePosition, selectedPlayer, getGame, setGame, deleteGame, getGames, addScore } = require('./users')
// const { addGame, getGame, deletePlayer } = require('./games')

app.use(cors())

io.on('connection', (socket) => {
    socket.on('login', ({ name, room }, callback) => {
        const { user, error } = addUser(socket.id, name, room, null, null)
        
        if (error) return callback(error)
        socket.join(user.room)
        socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
        io.in(room).emit('users', getUsers(room, socket.id))
   
        const game = getGame(user.room, socket.id)
        const games = getGames(user.room, socket.id)

        io.in(room).emit('game', game)
        io.in(room).emit('games', games)
        setTimeout(() => {
            io.in(room).emit('playerAdded', user)
        }, 500)
        
        callback()
    })
    socket.on('addPlayer', object => {
        const user = getUser(socket.id)
        game = getGame(user.room, socket.id)
        
        if(game.status){
            return;
        }
        updatePosition(user.id, object.position)
        
        io.in(user.room).emit('player', { user: user.name, object: object} )
    })

    socket.on('start', () => {
        
        let user = getUser(socket.id)
        let room = user.room;
        setGame(room)
        const games = getGames(user.room, socket.id)
        io.in(room).emit('game', getGame(user.room))
        io.in(room).emit('games', getGames(user.room))
        
        io.in(user.room).emit('startGame')
    })
    socket.on('move', (object) => {
        if(object.ball === "computer"){
            const user = getUser(object.id);
            let comPos = updatePosition(object.position, object.id, object.ball )
            io.in(user.room).emit('movePlayers', comPos)
            return;
        }
        
        const user = getUser(object.id);
        const gamePos = updatePosition(object.position, user.id, object.ball, object.selected, object.ballSpeed, object.ballDirY, object.ballDirX)
      
        const newPos = { player1: gamePos.game.player1, player2: gamePos.game.player2, 
            ball: gamePos.game.ball, 
            ballSpeed: object.ballSpeed, 
            ballDirX: object.ballDirX,
            ballDirY: object.ballDirY
        }
        io.in(user.room).emit('movePlayers', newPos)
    })
    socket.on("playerSelected", () => {
        const user = getUser(socket.id);
        game = getGame(user.room)

        if (game.status) {
            return;
        }
        let obj = selectedPlayer(user.id)
        // updatePosition(user.position, user.id)

        io.in(user.room).emit('selectPlayer', {selected: obj.selected, user: obj.user})
    })

    socket.on('playerScored', (object) => {
        addScore(object.room, object.player)
        const games = getGames(object.room)
        io.in(object.room).emit("games",  games)
    })
    socket.on('sendMessage', message => {
        const user = getUser(socket.id)
        io.in(user.room).emit('message', { user: user.name, text: message });
    })


    socket.on("disconnect", () => {
        console.log("User disconnected");
       
        // const users = getUsers(user.room)
        // if (users.length === 1) {
        //     deleteGame(user.room)
        //     return;
      
        const user = deleteUser(socket.id)
        
        if (user) {
            io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
            
            io.in(user.room).emit('users', getUsers(user.room))
            
            io.in(user.room).emit('deleteUser', user)
        }
        
        
    })
})

app.get('/', (req, res) => {
    res.send("Server is up and running")
})

http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})