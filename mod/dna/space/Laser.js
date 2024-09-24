class Laser {

    constructor(st) {
        extend(
            this,
            dna.space.trait.directional,
            {
                x:   0,
                y:   0,
                r:   5,
                R:   5,
                dir: 0,
                lifespan: 5,
                spec: {
                    speed:  60,
                    damage: 10,
                },
            },
            st
        )

        console.dir(this)
    }

    evo(dt) {
        this.lifespan -= dt
        if (this.lifespan < 0) {
            kill(this)
            return
        }
        this.x += cos(this.dir) * this.spec.speed * dt
        this.y += sin(this.dir) * this.spec.speed * dt
    }

    draw(ctx, $) {
        const v1 = this.gxy( this.r, 0),
              v2 = this.gxy(-this.r, 0)
        $.drawLine(v1[0], v1[1], v2[0], v2[1], 2)
    }

    onHit(e) {
        if (!(e instanceof dna.space.Ship) || this.src === e) return
        log(`${e.name}/${e.hits}: HIT by a laser!`)
        e.damage(this.spec.damage)
        kill(this)
    }
}
