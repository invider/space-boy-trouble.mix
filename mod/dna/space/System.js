class System extends LabFrame {

    constructor(st) {
        super( extend({
            hidden: true,
            paused: false,
        }, st) )
    }

    init() {
        this.spawn('space/Collider')
    }

    draw(ctx, $) {
        const ls = this._ls, N = ls.length
        for (let i = 0; i < N; i++) {
            const e = ls[i]
            if (!e.hidden) e.draw(ctx, $)
        }
    }

}
