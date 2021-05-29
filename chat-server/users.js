const users = []
let games = []

const addUser = (id, name, room, position, selected) => {
    const existingUser = users.find(user => user.name.trim().toLowerCase() === name.trim().toLowerCase())

    if (existingUser) return { error: "Username has already been taken" }
    if (!name && !room) return { error: "Username and room are required" }
    if (!name) return { error: "Username is required" }
    if (!room) return { error: "Room is required" }
    
    
    const user = { id, name, room, position: undefined, selected: "none", ball: null }
    
    
    users.push(user)
    const game = getGame(room, id, user)
    game.ids.push(id)
    user.game = game
    if(game.status === false){
        selectedPlayer(user.id)
    }
    if(user.selected === "player2"){
        game.player2Name = user.name
    }

    
    
    
    return { user }
}

const updatePosition = (position, id, ball, selected) => {
    if( ball === "computer"){
        const user = users.find(user => user.id === id)
        const game = getGame(user.room, user.id, user)
        
        game.player2 = position
        return game
    }
    const user = users.find(user => user.id === id)
    const game = getGame(user.room, user.id, user)
   
    if(selected === "player1"){
        game.player1 = position
    }else if(selected === "player2"){
        game.player2 = position
    }
    user.position = position
  
    if(ball != undefined){
        let bool = true
        ball.forEach(ele => {
            if (ele === null){
                bool = false
            }
        })
        if(bool){
            
            game.ball = ball
        }
    }
    
    return {user, game}
}
const selectedPlayer = (id) => {

    let user = users.find(user => user.id == id )
    if (user.selected != "none") {
        return { selected: user.selected, user: user };
    }
    let roomUsers = getUsers(user.room)

    let player = "player1"
    roomUsers.forEach(u => {
        
        if(u.selected === "player1"){
            player = "player2"
        }else if (u.selected === "player2"){
            player = "full"
        }
    })
    
    if(player === "full"){
        user.selected = player
      
        return { selected: user.selected, user: user };
    }
    
    user.selected = player
    if(player === "player1"){
        user.position = [-5, 0, 0]
       
        
    }else if(player === "player2"){
        user.position = [5, 0, 0]
        
    }
    
    return { selected: user.selected, user: user }
}
const getUser = id => {
    let user = users.find(user => user.id == id)
    return user
}

const getGame = (room, id, user) => {
    

    let game = games.find(game => game.room == room)
    const gIdx = games.findIndex((game) => game.room === room)

    
    
    if(game != undefined){
        return game;
    }

    game = {room: room, 
        status: false, ids: [], 
        player1Name: user.name, 
        player2Name: "Player 2", 
        player1: [-5, 0, 0], 
        player2:[5, 0, 0], 
        ball: [0, 0, 0],
        ballSpeed: .1,
        ballDirY: 1,
        ballDirX: 1,
        score: [0, 0]
    }
    
    games.push(game)
    return game
}

const addScore = (room, player) => {
    const game = getGame(room)
    if(player === "player1"){
        game.score[0] += 1
    }else{
        game.score[1] += 1
    }

    return game
}
const setGame = (room) => {
    
    let game = games.find(game => game.room === room)
    game.status = true
 
    return game
}

const deleteUser = (id) => {
  
    const index = users.findIndex((user) => user.id === id);


    let gIdx = -1
    if (users.length === 0) {
        games = []
        return;
    }

    for(let i = 0; i < games.length; i++){
  
        let game = games[i]
        
        game.ids.forEach(uid => {
            let j = 0
            if(uid === id){
              
                gIdx = i
                let userIdx = users.findIndex((user) => user.id === id);
                if(users[userIdx].selected === "player2"){
                    games[i].player2 = "Player 2"
                }
                if(users[userIdx].selected === "player1"){
                    games[i].player2 = "Player 1"
                }
                if(games[i].ids.length === 1){
                    
                    games[i].ids = []
                }else{
                   
                    games[i].ids = game.ids.splice(j + 1, 1)
                    

                }
                
                return;
            }
            j += 1
        })
        i += 1
    }

    if (gIdx !== -1 && games[gIdx].ids.length === 0) games.splice(gIdx, 1)[0];
    
    if (index !== -1) return users.splice(index, 1)[0];
}
const deleteGame = (user) => {
    

}
const getUsers = (room) => users.filter(user => user.room === room)
const getGames = (room) => games.filter(game => game.room === room)

module.exports = { addUser, getUser, deleteUser, getUsers, updatePosition, selectedPlayer, getGame, setGame, deleteGame, getGames, addScore }
