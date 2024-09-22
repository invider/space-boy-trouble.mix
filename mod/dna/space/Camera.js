class Camera {

    constructor(st) {

        extend(this, {
            name: 'port',
            x:    0,
            y:    0,
        }, st)
    }

    jumpToSystem(system) {
        this.system = system
    }

    draw() {
        if (!this.system) return
        const ctx = this.ctx

        ctx.save()
        ctx.translate(this.x + env.cfg.width * .5,
            this.y + env.cfg.height * .5 + .5)
        this.$.translate(this.x, this.y)
        this.system.draw(ctx, this.$)
        ctx.restore()
    }

    onAttach(e) {
        e.$ = this.$
        e.ctx = this.ctx
    }
}
