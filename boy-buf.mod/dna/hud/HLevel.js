class HLevel {

    constructor(st) {
        augment(this, st)
        if (!this.bcolor) this.bcolor = env.style.color.c1
        if (!this.lcolor) this.lcolor = env.style.color.c2
    }

    draw() {
        const v = this.normalValue()

        const b = 1
        const W = this.w
        const H = this.h
        const V = floor((W - 2*b) * v)

        fill(this.bcolor)
        rect(this.x, this.y, W, H)

        fill(this.lcolor)
        rect(this.x + b, this.y + b, V, H - 2*b)
    }

    value() {
        return .25
    }

    normalValue() {
        const v = this.value()
        if (isNaN(v)) return 0
        else return limit(this.value(), 0, 1)
    }
}
