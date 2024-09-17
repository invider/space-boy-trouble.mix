const df = {
    x: 0,
    y: 0,
    r: 8,
    speed: -120,
}

class Projectile {

    constructor(st) {
        augment(this, df)
        augment(this, st) 

        switch(this.type) {
            case 'laser':
                this.r = 15
                break
            case 'driver':
                this.r = 3
                break
            case 'missile':
                this.r = 8
                break
        }

        if (this.target) {
            this.speed *= -1
            // this.speed /= 4 // slow it down
            this.x = this.target.x
            this.y = -2*this.r - RND(env.tune.incomingProjectileSpread)
            if (this.type === 'missile') {
                this.type = 'fragment'
            }
        }
    }

    evo(dt) {
        this.y += this.speed * dt

        if (this.target) {
            if (this.y >= this.target.y) {
                this.kill()
                this.onHit()
            }

        } else if (this.y < -this.r) {
            this.kill()
            this.onOut()
        }
    }

    draw() {
        save()
        if (this.type === 'missile') {
            const s = env.style.cellSize - 2
            const x = floor(this.x - s/2)
            const y = floor(this.y - s/2)
            res.pods.draw(32, x, y, s, s)

        } else if (this.type === 'driver') {
            translate(-.5, -.5)
            lineWidth(1)

            stroke(env.style.color.c3)
            const x = floor(this.x)
            const y = floor(this.y-this.r)
            rect(x-1, y-1, 2, 2)

        } else if (this.type === 'fragment') {
            fill(env.style.color.c3)
            const x = floor(this.x)
            const y = floor(this.y-this.r)
            rect(x-1, y-1, 2, 2)

        } else {
            translate(-.5, 0)

            lineWidth(1)
            stroke(env.style.color.c3)
            const x = floor(this.x)

            
            const y = this.target? floor(this.y-this.r) : floor(this.y)
            line(x, y, x, y + this.r)
        }
        restore()
    }

    kill() {
        this.__.detach(this)
    }
}
