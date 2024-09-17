function hintAt(text, x, y, left, color) {
    color = color || env.style.color.c3
    const vfx = lab.screen.battle.vfx
    const target = left? vfx.left : vfx.right

    target.spawn(dna.hud.fadeText, {
        text: text,
        font: env.style.font,
        fillStyle: color,
        align: 'left',
        ttl: 4,
        tti: 0.3,
        ttf: 1,

        x: x,
        y: y,
        dx: RND(12) - 6,
        dy: -4 -RND(10),
    })
}

function mintAt(text, x, y, left, color) {
    color = color || env.style.color.c2

    const vfx = lab.screen.battle.vfx
    const target = left? vfx.left : vfx.right
    target.spawn(dna.hud.fadeText, {
        text: text,
        font: env.style.font,
        fillStyle: color,
        align: 'left',
        ttl: 4,
        tti: 0.3,
        ttf: 1,

        x: x,
        y: y,
        dx: RND(12) - 6,
        dy: 4 + RND(10),
    })
}

function debris(x, y, left, color) {
    color = color || env.style.color.c1

    const vfx = lab.screen.battle.vfx
    const target = left? vfx.left : vfx.right
    target.spawn(dna.Emitter, {
        x: x,
        y: y,
        color: color,
        lifespan: 0.1,
        force: 1500,
        radius: 0,
        size: 1,
        speed: 8, vspeed: 8,
        angle: 0, spread: 2*Math.PI,
        minLifespan: 0.4, vLifespan: 0.6,
        drawParticle: function() {
            fill(this.color)
            rect(floor(this.x), floor(this.y), this.r, this.r)
        }
    })
}

function explosion(x, y, left, color) {
    color = color || env.style.color.c1

    const vfx = lab.screen.battle.vfx
    const target = left? vfx.left : vfx.right
    target.spawn(dna.Emitter, {
        x: x,
        y: y,
        color: color,
        lifespan: 0.1,
        force: 2500,
        radius: 0,
        size: 1,
        speed: 15, vspeed: 0,
        angle: 0, spread: 2*Math.PI,
        minLifespan: 0.8, vLifespan: 0.4,
        drawParticle: function() {
            fill(this.color)
            rect(floor(this.x), floor(this.y), this.r, this.r)
        }
    })
}

function deflect(x, y, left, color) {
    color = color || env.style.color.c3

    const vfx = lab.screen.battle.vfx
    const target = left? vfx.left : vfx.right
    target.spawn(dna.Emitter, {
        x: x,
        y: y,
        color: color,
        lifespan: 0.05,
        force: 1000,
        radius: 0,
        size: 1,
        speed: 10, vspeed: 0,
        angle: 0, spread: 2*Math.PI,
        minLifespan: 0.4, vLifespan: 0.2,
        drawParticle: function() {
            fill(this.color)
            rect(floor(this.x), floor(this.y), this.r, this.r)
        }
    })
}

function poof(target, x, y, color) {
    color = color || env.style.color.c3

    target.spawn(dna.Emitter, {
        x: x,
        y: y,
        color: color,
        lifespan: 0.05,
        force: 1000,
        radius: 0,
        size: 1,
        speed: 10, vspeed: 0,
        angle: 0, spread: 2*Math.PI,
        minLifespan: 0.4, vLifespan: 0.2,
        drawParticle: function() {
            fill(this.color)
            rect(floor(this.x), floor(this.y), this.r, this.r)
        }
    })
}
