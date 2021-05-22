const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const PORT = process.env.PORT || 5000
const { addUser, getUser, deleteUser, getUsers, updatePosition } = require('./users')
// const { addGame, getGame, deletePlayer } = require('./games')

app.use(cors())

io.on('connection', (socket) => {
    socket.on('login', ({ name, room }, callback) => {
        const { user, error } = addUser(socket.id, name, room, [0, 0, 0])
        if (error) return callback(error)
        socket.join(user.room)
        socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
        io.in(room).emit('users', getUsers(room))
        socket.in(room).emit('playerAdded', user)
        callback()
    })
    socket.on('addPlayer', object => {
        const user = getUser(socket.id)
        updatePosition(user.id, object.position)
        console.log("adding Player")
        console.log(user)
        io.in(user.room).emit('player', { user: user.name, object: object} )
    })
    socket.on('move', position => {
        const user = getUser(socket.id);
        
        updatePosition(user.id, position)
        console.log(position)
        let users = getUsers(user.room)
        
        io.in(user.room).emit('movePlayers', users)
    })
    socket.on('sendMessage', message => {
        const user = getUser(socket.id)
        io.in(user.room).emit('message', { user: user.name, text: message });
    })


    socket.on("disconnect", () => {
        console.log("User disconnected");
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