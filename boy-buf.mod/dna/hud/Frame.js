class Frame {
    constructor(st) {
        augment(this, st)
        if (!this.name && this.title) this.name = this.title
        if (!this.color) this.color = env.style.color.c1
        if (!this.activeColor) this.activeColor = env.style.color.c2
    }

    syncTheme() {
        this.color = env.style.color.c1
        this.activeColor = env.style.color.c2
    }

    drawStripes(x, y, w) {
        save()
        translate(0, .5)
        for (let i = 0; i < 4; i++) {
            const ly = y + i*2 + 1
            line(x, ly, x+w, ly)
        }
        restore()
    }

    drawTitle() {
        baseTop()
        alignCenter()
        if (this.active) fill(this.activeColor)
        else fill(this.color)
        font(env.style.font)
        text(this.title, this.w/2, 2)
        const tw = textWidth(this.title)

        const sw = (this.w - tw - 6)/2
        if (sw > 4) {
            this.drawStripes(2, 1, sw)
            this.drawStripes(this.w-sw-2, 1, sw+1)
        }

        /*
        save()
        translate(0, .5)
        const x = this.w/2
        const y = 10
        stroke(env.style.color.c2)
        line(x-tw/2, y, x+tw/2, y)
        restore()
        */
    }

    draw() {
        save()
        translate(this.x, this.y)

        lineWidth(1)
        if (this.active) stroke(this.activeColor)
        else stroke(this.color)
        save()
        translate(.5, .5)
        rect(0, 0, this.w, this.h)
        restore()

        if (this.title) this.drawTitle()
        if (this.drawContent) this.drawContent()
        
        restore()
    }
}
