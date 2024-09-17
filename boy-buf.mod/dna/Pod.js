const SPEED = 100
const TIME = .05
const VTIME = .03

const df = {
    name: 'pod',
    title: 'pod mk1',
    cost: 10,
    hits: 100,
    dx: 0,
    dy: 0,

    effect: 0,
    times: 0,
    timer: 0,
}

function toZero(val, delta) {
    if (val < 0) {
        val += delta
        if (val > 0) val = 0
    } else if (val > 0) {
        val -= delta
        if (val < 0) val = 0
    }
    return val
}

class Pod {

    constructor(st) {
        augment(this, df)
        augment(this, st)
    }

    init() {
        this.hits = this.df.hits
        if (this.df.charge) this.charge = this.df.charge
        if (this.df.shots) this.shots = this.df.shots
    }

    activate() {}

    turn() {}

    recharge(capacity) {
        if (!this.df || !this.df.charge) return 0

        const need = this.df.charge - this.charge
        if (need > 0 && capacity > 0) {
            if (need > capacity) {
                // take it all!
                this.charge += capacity
                return capacity
            } else {
                this.charge += need
                return need
            }
        }
        return 0
    }

    hit(attack) {
        if (attack <= 0) return
        if (attack > this.hits) attack = this.hits
        
        const pod = this
        const loc = this.ship.visualGrid.cellScreenCoord(this)

        pod.hits -= attack
        if (pod.hits <= 0) {
            pod.hits = 0
            pod.kill()
            this.ship.score.lost ++
            log(`${pod.name} is destroyed`)
            sfx.play('explosion1', env.mixer.level.burn)
            lib.vfx.hintAt('-1 pod', loc.x, loc.y, this.ship.left)
        } else {
            sfx.play('burn', env.mixer.level.burn)
            lib.vfx.hintAt('-' + attack + ' hits', loc.x, loc.y, this.ship.left)
        }

        this.ship.score.hits ++
        lib.vfx.debris(loc.x, loc.y, this.ship.left, env.style.color.c0)
        lib.vfx.debris(loc.x, loc.y, this.ship.left, env.style.color.c1)
        pod.shake()
        //setTimeout(() => {
        //}, 300 + RND(700))
    }

    repair(hits) {
        if (this.dead || this.hits === 0 || hits <= 0) return
        if (this.hits === this.df.hits) return // already fixed

        let fix = this.df.hits - this.hits
        if (fix > hits) fix = hits

        hits -= fix

        const pod = this
        const loc = this.ship.visualGrid.cellScreenCoord(this)
        setTimeout(() => {
            pod.hits += fix
            lib.vfx.mintAt('+' + fix + ' hits', loc.x, loc.y, this.ship.left)
            //lib.vfx.debris(loc.x, loc.y, this.ship.left, env.style.color.c3)
            sfx.play('noisy', env.mixer.level.repair)
            pod.blink()
        }, 1200)

        return hits
    }

    shake() {
        this.effect = 3
        this.times  = 5
        this.timer  = TIME
    }

    vibrate(times) {
        this.effect = 1
        this.times  = 5
        this.timer  = VTIME
    }

    blink(times) {
        this.blinker = {
            times: 5,
            period: env.style.repairBlinkPeriod,
        }
        this.blinker.timer = this.blinker.period
    }

    evo(dt) {
        if (this.effect) {
            this.timer -= dt
            if (this.timer < 0) {
                this.times --

                if (this.times === 0) {
                    this.effect = 9

                } else {
                    this.timer = 2*TIME
                    switch(this.effect) {
                        case 1: this.effect = 2; break;
                        case 2: this.effect = 1; break;
                        case 3: this.effect = 4; break;
                        case 4: this.effect = 3; break;
                    }
                }

            } else {
                switch(this.effect) {
                    case 1: this.dy -= dt * SPEED; break;
                    case 2: this.dy += dt * SPEED; break;
                    case 3: this.dx -= dt * SPEED; break;
                    case 4: this.dx += dt * SPEED; break;

                    case 9:
                        this.dx = toZero(this.dx, dt * SPEED)
                        this.dy = toZero(this.dy, dt * SPEED)
                        if (this.dx === 0 && this.dy === 0) {
                            this.effect = 0
                        }
                        break
                }
            }
        }
        if (this.blinker) {
            const b = this.blinker
            b.timer -= dt
            if (b.timer > 0) this.hidden = true
            else this.hidden = false

            if (b.timer <= -b.period) {
                b.times--
                b.timer = b.period
                if (b.times <= 0) {
                    this.blinker = null
                }
            }
        }
    }

    isDamaged() {
        return (this.hits < this.df.hits)
    }

    kill() {
        this.dead = true
        this.ship.killPod(this)
        this.ship.mountPod(
            new dna.ypods.DebrisPod(), this.x, this.y)

        const loc = this.ship.visualGrid.cellScreenCoord(this)
        lib.vfx.explosion(loc.x, loc.y, this.ship.left, env.style.color.c3)
    }
}
