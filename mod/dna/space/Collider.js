class Collider {

    constructor(st) {
        this.hidden = true
    }

    evo(dt) {
        this.__.collide(
            (e1, e2) => {
                const d = dist(e1.x, e1.y, e2.x, e2.y)
                if (d < e1.R + e2.R) {
                    if (e1.onHit) e1.onHit(e2, d)
                    if (e2.onHit) e2.onHit(e1, d)
                }
            },
            e => e.R && !e.hidden && !e.dead
        )
    }

}
