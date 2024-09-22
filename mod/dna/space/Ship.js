class Ship {

    constructor(st) {
        extend(this, {
            team: 0,
            x:    0,
            y:    0,
            r:    8,

            dir:  0,
        }, st)
        this.r2 = this.r * 2
    }

    evo(dt) {
        this.dir += PI * dt
    }

    draw(ctx, $) {
        //ctx.save()
        //ctx.imageSmoothingEnabled = false
        //ctx.translate(floor(this.x) + .5, floor(this.y) + .5)
        //ctx.rotate(-this.dir)
        
        $.rotate(-this.dir)

        $.drawCircle(this.x, this.y, this.r, 1)

        const dx = cos(this.dir),
              dy = sin(this.dir)
        $.drawLine(this.x, this.x, this.x, this.y-this.r * 1.2, 1)

        $.drawLine(this.x-3, this.y, this.x-3, this.y-this.r * 1.2, 1)
        $.drawLine(this.x+3, this.y, this.x+3, this.y-this.r * 1.2, 1)
    }
}
