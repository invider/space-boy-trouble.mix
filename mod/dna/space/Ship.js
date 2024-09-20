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
        //this.dir += PI * dt
    }

    draw(ctx, $) {
        ctx.save()
        ctx.imageSmoothingEnabled = false
        ctx.translate(floor(this.x) + .5, floor(this.y) + .5)
        ctx.rotate(-this.dir)

        //$.tileset.draw(1, -this.r, -this.r, this.r2, this.r2)

        ctx.strokeStyle = $.pal.toRGBA(1)

        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(0, 0, this.r, 0, PI2)
        ctx.stroke()

        //const dx = cos(this.dir),
        //      dy = sin(this.dir)
        ctx.moveTo(0, 0)
        ctx.lineTo(0, -this.r * 1.2)
        ctx.stroke()

        ctx.moveTo(-3, 0)
        ctx.lineTo(-3, -this.r * 1.2)
        ctx.stroke()
        ctx.moveTo( 3, 0)
        ctx.lineTo( 3, -this.r * 1.2)
        ctx.stroke()


        ctx.restore()
    }
}
