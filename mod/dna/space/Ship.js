class Ship {

    constructor(st) {
        extend(this, {
            team: 0,
            x:    0,
            y:    0,
            r:    8,

            dir:  0,
            mt: {
                left:  0,
                right: 0,
                forward: 0,
            },
            stats: {
                turnSpeed:    PI,
                acceleration: 40,
                deceleration: 80,
                maxSpeed:     40,
            },
        }, st)
        this.r2 = this.r * 2
    }

    evo(dt) {
        //this.port.statusBar.show('mt.fwd: ' + round(this.mt.forward * 100)/100)

        if (this.mt.left) {
            this.dir -= this.stats.turnSpeed * dt
        }
        if (this.mt.right) {
            this.dir += this.stats.turnSpeed * dt
        }
        if (this.mt.forward > 0) {
            const dx = cos(this.dir) * this.mt.forward * dt
            const dy = sin(this.dir) * this.mt.forward * dt
            this.x += dx
            this.y += dy

            if (!this.mt.pushForward) {
                // decelerate
                this.mt.forward -= this.stats.deceleration * dt
                if (this.mt.forward < 0) this.mt.forward = 0
            }
        }
    }

    gxy(lx, ly) {
        return [
            this.x + lx * cos(this.dir) - ly * sin(this.dir),
            this.y + lx * sin(this.dir) + ly * cos(this.dir)
        ]
    }

    draw(ctx, $) {
        //ctx.save()
        //ctx.imageSmoothingEnabled = false
        //ctx.translate(floor(this.x) + .5, floor(this.y) + .5)
        //ctx.rotate(-this.dir)
        
        //$.rotate(-this.dir)
        const v1 = this.gxy(this.r, 0),
              v2 = this.gxy(-this.r, -this.r*.5),
              v3 = this.gxy(-this.r,  this.r*.5)


        $.drawCircle(this.x, this.y, this.r, 1)

        $.drawLine(v2[0], v2[1], v1[0], v1[1], 2)
        $.drawLine(v3[0], v3[1], v1[0], v1[1], 2)
        $.drawLine(v2[0], v2[1], v3[0], v3[1], 2)

    }

    activate(action) {
        log('#' + action)
        switch(action) {
            case env.bind.UP:
                this.mt.pushForward = true
                break
            case env.bind.LEFT:
                this.mt.left = 1
                break
            case env.bind.RIGHT:
                this.mt.right = 1
                break
        }
    }

    act(action, dt, time) {
        switch(action) {
            case env.bind.UP:
                this.mt.forward = min(this.mt.forward + this.stats.acceleration * dt, this.stats.maxSpeed)
                break
            case env.bind.A:
                // TODO charge/shot
                break
            case env.bind.B:
                break
        }
    }

    deactivate(action) {
        log('!' + action)
        switch(action) {
            case env.bind.UP:
                this.mt.pushForward = false
                break
            case env.bind.LEFT:
                this.mt.left = 0
                break
            case env.bind.RIGHT:
                this.mt.right = 0
                break
            case env.bind.A:
                break
            case env.bind.B:
                break
        }
    }
}
