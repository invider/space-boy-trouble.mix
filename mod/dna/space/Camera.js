class Camera {

    constructor(st) {
        extend(this, {
            name: 'port',
            x:    0,
            y:    0,
            statusBar: new dna.hud.StatusBar(),
        }, st)
    }

    jumpToSystem(system) {
        this.system = system
    }

    bind(target) {
        this.target = target
        this.target.port = this
    }

    draw() {
        if (!this.system) return
        const ctx = this.ctx

        this.$.translate(this.x, this.y)
        this.system.draw(ctx, this.$)
        this.statusBar.draw(ctx, this.$)
    }

    onAttach(e) {
        e.$ = this.$
        e.ctx = this.ctx
    }

    activate(action) {
        if (this.target && this.target.activate) this.target.activate(action)
    }

    act(action, dt, time) {
        if (this.target && this.target.act) this.target.act(action, dt, time)
    }

    deactivate(action) {
        if (this.target && this.target.deactivate) this.target.deactivate(action)
    }
}
