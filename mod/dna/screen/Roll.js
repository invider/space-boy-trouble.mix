class Roll {

    constructor(st) {
        extend(this, {
            dx:  0,
            dy: -16,
            stepX:  0,
            stepY:  10,
            startX: 0,
            startY: 144 + 8,
            stopY:  -24,
            align: 'left',
            icolor: 1,
            loop:   true,
        }, st)
        if (this.text) this.roll(this.text)
    }

    roll(txt) {
        this.lines = txt.split('\n')
        this.x = this.startX
        this.y = this.startY
    }

    evo(dt) {
        this.x += this.dx * dt
        this.y += this.dy * dt
    }

    draw() {
        this.ctx.font = env.style.font
        //this.ctx.font = env.style.titleFont
        this.ctx.textBaseline = 'top'
        this.ctx.textAlign = this.align
        this.ctx.fillStyle = this.$.pal.toRGBA(this.icolor)

        let cx = this.x, cy = this.y

        for (let i = 0; i < this.lines.length; i++) {
            if (cy > -this.stepY && cy < env.cfg.height) {
                this.ctx.fillText(this.lines[i], cx, cy)
            }
            cx += this.stepX
            cy += this.stepY
        }
        if (this.loop && this.dy < 0 && cy < this.stopY) {
            // reached the end of the roll, restart
            this.x = this.startX
            this.y = this.startY
        }
    }
}
