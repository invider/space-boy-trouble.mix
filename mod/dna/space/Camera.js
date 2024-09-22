class Camera {

    constructor(st) {
        extend(this, {
            name: 'port',
            x:    0,
            y:    0,
            dir:  0,
            mt: {
                dir: 0,
                speed: 0,
            },
            statusBar: new dna.hud.StatusBar(),
            spec: {
                movementTrigger: 48,
                acceleration:    20,
                deceleration:    30,
                maxSpeed:        60,
            },
        }, st)
    }

    jumpToSystem(system) {
        this.system = system
    }

    bind(target) {
        this.target = target
        this.target.port = this
    }

    evo(dt) {
        if (!this.target) return
        const d = this.distToTarget = dist(this.target.x, this.target.y, this.x, this.y)
        const dir = this.dir = bearing(this.x, this.y, this.target.x, this.target.y)
        if (d > this.spec.movementTrigger) {
            this.mt.dir = dir
            this.mt.speed = min(this.mt.speed + this.spec.acceleration * dt, this.spec.maxSpeed)
        } else {
            // decelerate
            if (this.mt.speed > 0) {
                this.mt.speed -= this.spec.deceleration * dt
                if (this.mt.speed < 0) {
                    this.mt.speed = 0
                    this.mt.dir   = 0
                }
            }
        }
        if (this.mt.speed > 0) {
            this.x += cos(this.mt.dir) * this.mt.speed * dt
            this.y += sin(this.mt.dir) * this.mt.speed * dt
        }
    }

    draw() {
        if (!this.system) return
        const ctx = this.ctx

        this.$.translate(this.x, this.y)
        this.system.draw(ctx, this.$)
        this.statusBar.draw(ctx, this.$)

        this.$.translate(0, 0)
        if (this.dir) {
            let dx = cos(this.dir)
            let dy = sin(this.dir)
            let r  = this.distToTarget
            this.$.drawLine(0, 0, dx*r, dy*r, 3)

            r = this.mt.speed
            this.$.drawLine(0, 0, dx*r, dy*r, 2)
        }
        this.statusBar.show(
            'ship: ' + round(this.target.x * 10)/10 + ':' + round(this.target.y * 10)/10
            + '\nport: ' + round(this.x * 10)/10 + ':' + round(this.y * 10)/10
            + '\nvect: ' + round(this.dir * 100)/100)
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
