class StatusBar {

    constructor(st) {
        extend(this, {
            tag: '',
        }, st)
    }

    show(tag) {
        this.tag = tag
        if (this.tag) {
            this.lines = this.tag.split('\n')
        } else {
            this.lines = []
        }
    }

    draw(ctx, $) {
        if (!this.tag) return
        let y = $.fh

        for (let i = this.lines.length - 1; i >= 0; i--, y -= 10) {
            const line = this.lines[i]
            ctx.font = env.style.font
            ctx.fillStyle = $.pal.toRGBA(3)
            ctx.textAlign = 'left'
            ctx.textBaseline = 'bottom'
            ctx.fillText(line, 0, y)
        }
    }
}
