class StatusBar {

    constructor(st) {
        extend(this, {
            tag: '',
        }, st)
    }

    show(tag) {
        this.tag = tag
    }

    draw(ctx, $) {
        if (!this.tag) return
        ctx.font = env.style.font
        ctx.fillStyle = $.pal.toRGBA(3)
        ctx.textAlign = 'left'
        ctx.textBaseline = 'bottom'
        ctx.fillText(this.tag, 0, $.fh)
    }
}
