class Laser {

    constructor(st) {
        extend(this, {
            x:   0,
            y:   0,
            r:   10,
            dir: 0,
            lifespan: 10,
            spec: {
                speed: 25,
            },
        }, st)
    }

    gxy(lx, ly) {
        return [
            this.x + lx * cos(this.dir) - ly * sin(this.dir),
            this.y + lx * sin(this.dir) + ly * cos(this.dir)
        ]
    }

    evo(dt) {
        this.lifespan -= dt
        if (this.lifespan < 0) {
            kill(this)
            return
        }
        this.x += cos(this.dir) * this.spec.speed * dt
        this.y += sin(this.dir) * this.spec.speed * dt
    }

    draw(ctx, $) {
        const v1 = this.gxy( this.r, 0),
              v2 = this.gxy(-this.r, 0)
        $.drawCircle(this.x, this.y, this.r, 1)
        $.drawLine(v1[0], v1[1], v2[0], v2[1], 2)
    }
}
