class Ball{
    constructor(){
        this.speed = 0
        this.dirY = .05
        this.dirX = -.1
        this.x = 0
        this.y = 0
    }

    update(dt){
        
        this.x += dt * this.speed * this.dirX;
        this.y += dt * this.speed * this.dirY;
       
        const topWall = 3.7
        const bottomWall = -3.68

        if(this.y <= bottomWall){
            this.dirY = -this.dirY
        }else if(this.y >= topWall){
            this.dirY = -this.dirY
        }
        if(this.speed > 75){
            this.speed -= 1.2
        }else if(this.speed > 50){
            this.speed -= .8
        }else if(this.speed > 30){
            this.speed -= .1
        }
    }
    reset(){
        this.speed = 0
    }
    setSpeed(){
        
        for(let i = 0; i < 70; i++){
            if (this.speed > 125) return;
            this.speed += 1.2
        }
        
    }
    checkScore(score){
        const leftWall = -5.5
        const rightWall = 5.5
        if (this.x < leftWall) {
            this.x = 0
            this.y = 0
            this.speed = 0
            this.getRandomY()
            setTimeout(() => {
                this.speed = 30
                
            }, 400)
            return [score[0], score[1] + 1]
        } else if (this.x > rightWall) {
            this.x = 0
            this.y = 0
            this.speed = 0
            this.getRandomY()
            setTimeout(() => {
                this.speed = 30
                
            }, 400)
            return [score[0] + 1, score[1]]
        }
        return false;
    }
    getRandomY(){
        const rand = [.05, -.05, .06, -.06]
        this.dirY = rand[Math.floor(Math.random() * rand.length)]
    }
    setStart(){
        this.speed = 30
    }
    setDirection(dirX, dirY){
        this.dirX = dirX
        this.dirY = dirY
    }
    

    serializeForUpdate(){
        return{
            x: this.x,
            y: this.y,
            dirX: this.dirX,
            dirY: this.dirY
        }
    }
}

module.exports = Ball
