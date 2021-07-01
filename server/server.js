const express = require('express');
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const path = require('path');
const PORT = process.env.PORT || 5000
const { addUser, getUser, deleteUser, getUsers} = require('./users')
const { addGame, joinGame, deletePlayer, getGame, deleteGame, playAgain } = require('./games')


// Serve static files from the React frontend app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '/../client', 'build', 'index.html'));
    })
}


app.use(cors())

// Socket connection
io.on('connection', (socket) => {
   
    socket.on('login', ({ name, room }, callback) => {
        const { user, error } = addUser(socket.id, name, room, null, null)
        
        if (error) return callback(error)
        const game = addGame(socket.id, name, room)
        
        socket.join(user.room)
        socket.in(room).emit('notification', {id: user.name, title: 'Someone\'s here', description: `${user.name} just entered the room` })
        io.in(room).emit('users', getUsers(room, socket.id))
        setTimeout(() => {
            
            socket.in(room).emit("addPlayer", joinGame(user.room, socket, name))
        }, 500);
        
        callback()
    })
    socket.on('start', room => {
        const game = getGame(room)
        game.startGame()
    })
    socket.on('move', me => {
        const game = getGame(me.room)
        game.handleInput(me.id, me.dir)
    })
    
    socket.on('sendMessage', message => {
        const user = getUser(socket.id)
        io.in(user.room).emit('message', { user: user.name, text: message });
    })
    socket.on("reset", room => {
        playAgain(room)
    })

    socket.on("disconnect", () => {
        
        const player = deletePlayer(socket.id)
        const user = deleteUser(socket.id)
        
        if (user) {
            io.in(user.room).emit('notification', {id: user.name, title: 'Someone just left', description: `${user.name} just left the room` })
            
            io.in(user.room).emit('users', getUsers(user.room))
            io.in(user.room).emit('deleteUser', user)
        }
        
        
    })
})

app.get('/', (req, res) => {
    res.send("Server is up and running")
    
})



// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)


http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})