class Separator {
    constructor(st) {
        augment(this, st)
        if (!this.color) this.color = env.style.color.c3
    }

    draw() {
        lineWidth(2)
        stroke(this.color)
        line(this.x, 10, this.x, ctx.height)

        lineWidth(1)
        rect(50.5, +.5, 60, 9)

        baseTop()
        alignCenter()
        font(env.style.font)
        fill(env.style.color.c3)
        text('Turn ' + this.__.control.turn, ctx.width/2, 1)
    }
}
