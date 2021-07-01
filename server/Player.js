class Player{
    constructor(id, name, selected, x, y, dir){
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.selected = selected
        this.dir = dir;
    }

    update(dt){
        this.y += dt * 60 * this.dir
        const topWall = 3.7
        const bottomWall = -3.68
        if (this.y > topWall - .42){
            this.y = topWall - .42
        } else if (this.y < bottomWall + .39){
            this.y = bottomWall + .39
        }
    }

    distanceTo(ball){
        if(this.x < 0){
            const dx = ball.x - this.x
            const y = this.y
            return {dx: dx, y:y}
        }else{
            const dx = this.x - ball.x
            const y = this.y
            return { dx: dx, y: y }
        }
        
       

    }
    setDirection(dir){
        this.dir = dir
    }

    serializeForUpdate(){
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            dir: this.dir
        }
    }


}

module.exports = Player