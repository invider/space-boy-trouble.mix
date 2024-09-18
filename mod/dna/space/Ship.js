class Ship {

    constructor(st) {
        extend(this, {
            team: 0,
            x:    0,
            y:    0,
            r:    16,

            dir:  0,
        }, st)
    }

    evo(dt) {

    }

    draw(ctx, $) {
        ctx.strokeStyle = $.pal.toRGBA(1)

        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, PI2)
        ctx.stroke()

        const dx = cos(this.dir),
              dy = sin(this.dir)
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + dx * this.r * 1.2,
                   this.y + dy * this.r * 1.2)
        ctx.stroke()
    }
}
