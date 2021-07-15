const Ball = require('./ball')
const Player = require('./player')
const ComputerPlayer = require('./computerPlayer')


class Game{
    constructor(room, id){
        this.id = id
        this.sockets = {};
        this.players = {};
        this.player1 = "Player 1",
        this.player2 = "Computer Player"
        this.room = room,
        this.start = false
        this.computer = null;
        this.ball = new Ball
        this.deleteMe = false;
        this.play_comp = false;
        this.lastUpdateTime = Date.now()
        this.shouldSendUpdate = false,
        this.winner = null
        this.score = [0, 0]
        setInterval(this.update.bind(this), 1000/60)
    }
    getPlayers(){
        return this.players
    }
    checkWin(){
        
        if(this.score[0] === 10){
            this.winner = "player1"
            

        }else if(this.score[1] === 10){
            this.winner = "player2"
            
        }else{
            return;
        }

        const playerID = Object.keys(this.players).find(playerID => {
            const player = this.players[playerID]

            if(this.players[playerID].selected === this.winner) {
                
                return player
            }
        })
        
        if(playerID === undefined){
            this.winner = "Computer Player"
        }else{
            this.winner = this.players[playerID].name
        }
        
        Object.keys(this.sockets).forEach(socketID => {
            const socket = this.sockets[socketID]
            socket.emit("winner", this.winner)
        })
        this.ball.reset()
        
    }
    resetGame(){
        this.start = false
        this.winner = null
        this.score = [0, 0]
    }
    addPlayer(socket, name){
        this.sockets[socket.id] = socket
        const num_of_players = Object.keys(this.players).length
        if(Object.keys(this.players) === 2) return
        let selected = ""
        let x = 0
        if (this.start){
            return;
        }

        if(num_of_players === 0) {
            selected = "player1"
            this.player1 = name
            x = -5
            this.play_comp = true;
        }else if(num_of_players === 1){
            selected = "player2"
            this.player2 = name
            x = 5
            this.play_comp = false;
        }else{
            return;
        }
        const player = new Player(socket.id, name, selected, x, 0, 0)
        this.players[socket.id] = player
        this[player.selected] = player.name
        return this.players[socket.id]
    }

    removePlayer(id){
        delete this.sockets[id]
        if(this.players[id]){
            delete this.players[id]
            this.play_comp = true
            const keys = Object.keys(this.players)
            if(keys.length > 0){
                const atributes = (this.players[keys[0]].selected === "player1") ? ["player2", 5, 0, .1] : ["player1", -5, 0, .1]
                this.computer = new ComputerPlayer(...atributes)
                if(this.computer.selected === "player2"){
                    this.player2 = "Computer Player"
                }else{
                    this.player1 = "Computer Player"
                }
            }
 
        }
        return Object.keys(this.sockets)
    }

    handleInput(id, dir, pos){
       
        if(this.players[id]){
            this.players[id].setDirection(dir)
        }
    }
    startGame(){
        this.ball.setStart()
        this.start = true
    }
    update(){
        
        const now = Date.now()
        const dt = (now - this.lastUpdateTime) / 1000
        this.lastUpdateTime = now
        const keys = Object.keys(this.players)
        if (keys.length === 1 && this.computer === null && this.play_comp === true){
            const atributes = (this.players[keys[0]].selected === "player1") ? ["player2", 5, 0, .1] : ["player1", -5, 0, .1]
            this.computer = new ComputerPlayer(...atributes)            
        }
        const score = this.ball.checkScore(this.score)
        if(score){
            this.score = score
        }
        this.ball.update(dt)
        if(this.play_comp){
            this.computer.update(dt, this.ball)
            this.checkCollision(this.computer, this.ball)
        }
        Object.keys(this.players).forEach(playerID => {
            const player = this.players[playerID]
            player.update(dt)
            this.checkCollision(player, this.ball)
            
        })
        if (score) {
            Object.keys(this.sockets).forEach(id => {
                const socket = this.sockets[id]
                socket.emit("scored", score)
            })
        }
        this.checkWin()
        if (this.shouldSendUpdate) {
            
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID];
                const player = this.players[playerID];
                
                if(player === undefined){
                    
                    socket.emit(
                        "update",
                        this.createFanUpdate(this.score),
                    );
                }else{

                    socket.emit(
                        "update",
                        this.createUpdate(player, this.score),
                    );
                }
                
            });
            
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }
    checkCollision(player, ball){
        const {dx, y} = player.distanceTo(ball)
        
        if(dx < .3 && dx > 0 && ball.y >= y - .52 && ball.y <= y + .52){
            if(ball.y <= y - .42 || ball.y >= y + .42){
                const add = (ball.dirY > 0) ? .02 : -.02
                ball.setDirection(-ball.dirX, ball.dirY + add)

            } else if (ball.y <= y - .22 || ball.y >= y + .22){
                const add = (ball.dirY > 0) ? .02 : -.02
                ball.setDirection(-ball.dirX, ball.dirY + add)
            }else{
                ball.setDirection(-ball.dirX, ball.dirY)
            }
            ball.setSpeed()
        }   
       
    }
    createFanUpdate(){
        const object = {
            t: Date.now(),
            name: '',
            player1: "",
            player2: "",
            ball: "",
            computer: false,
            score: [0, 0]
        }
        Object.keys(this.players).forEach(playerID => {
            const player = this.players[playerID]
            object.name = player.name
            object[player.selected] = player.serializeForUpdate()
            object.ball = this.ball.serializeForUpdate()
            object.score = this.score
        });
        if(this.play_comp){
            object[this.computer.selected] = this.computer.serializeForUpdate()
            object.computer = true;
        }
        return object
    }
    createUpdate(player, score){
        if (player === undefined) return;
       
        let other;
        Object.keys(this.players).forEach(oth => {
            if(this.players[oth] != player){
                other = this.players[oth]
            }
        })
        
        if(other){
            const other_selected = other.selected
            return {
                t: Date.now(),
                name: player.name,
                [player.selected]: player.serializeForUpdate(),
                [other_selected]: other.serializeForUpdate(),
                ball: this.ball.serializeForUpdate(),
                computer: this.play_comp,
                score: this.score

            }
        }else{
            return {
                t: Date.now(),
                name: player.name,
                [player.selected]: player.serializeForUpdate(),
                [this.computer.selected]: this.computer.serializeForUpdate(),
                ball: this.ball.serializeForUpdate(),
                computer: this.play_comp,
                score: this.score

            }
        }
        
    }
}


module.exports = Game