function bend(weapon, targetC, spread) {
    if (rnd() > weapon.precision) {
        const delta = RND(1, spread) * lib.math.rnds()
        targetC += delta
    }
    return targetC
}

class Ship {

    constructor(blueprint) {
        this.name = blueprint.name
        this.blueprint = blueprint
        this.w = blueprint.w
        this.h = blueprint.h

        this.grid = []
        this.pods = []

        const podDNA = dna.zpods._dir
        for (let y = 0; y < blueprint.h; y++) {
            for (let x = 0; x < blueprint.w; x++) {
                const podName = blueprint.podAt(x, y)
                const podCons = podDNA[podName]
                if (podCons) {
                    const pod = new podCons()
                    this.mountPod(pod, x, y)
                }
            }
        }

        this.rechargePriority = 'weapons'
        this.targetAutoSelection = true
        this.targetPriority = 'systems'

        this.score = {
            shots: 0,  // shots made
            hits: 0,   // hits sustained
            lost: 0,   // pods lost
            energy: 0, // energy consumed
        }
    }

    cellType(x, y) {
        return this.blueprint.cellType(x, y)
    }

    podAt(x, y) {
        const pod = this.grid[y*this.w + x]
        if (pod) return (pod.kind || pod.name)
        return this.blueprint.cellAt(x, y)
    }

    forEachPod(fn) {
        this.pods.forEach(pod => {
            if (pod && !pod.dead) fn(pod)
        })
    }

    podsOf(kind) {
        let i = 0
        this.pods.forEach(pod => {
            if (pod.kind === kind) i++
        })
        return i
    }

    getPod(x, y) {
        return this.grid[y*this.w + x]
    }

    mountPod(pod, x, y) {
        // clean up the cell from possible existing pod
        if (this.getPod(x, y)) {
            this.killPod(x, y)
        }

        // mount
        pod.x = x
        pod.y = y
        pod.ship = this
        this.pods.push(pod)
        this.grid[y * this.w + x] = pod
    
        // set serial, provide kind and rename
        pod.id = this.pods.length
        pod.kind = pod.name
        pod.name += ' #' + (this.podsOf(pod.kind) + 1)
    }

    killPod(pod) {
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[i] === pod) {
                this.grid[i] = null
            }
        }
        const i = this.pods.indexOf(pod)
        if (i >= 0) this.pods.splice(i, 1)
    }

    killPodAt(x, y) {
        const pod = this.grid[y*this.w + x]
        if (!pod) return

        this.grid[y*this.w + x] = null
        const i = this.pods.indexOf(pod)
        this.pods.splice(i, 1)

        return pod
    }

    // raise shields and recharge weapons
    chargeForBattle() {
        this.pods.forEach(pod => {
            if (pod.init) pod.init()
        })
        this.maxHits = this.totalHits()
        this.maxSystemHits = this.systemHits()
        this.maxShields = this.shields()
        this.skipped = 0
    }

    actionsAvailable() {
        const actions = {}
        this.pods.forEach(pod => {
            if (pod.reactsOn) {
                const action = pod.reactsOn()
                if (action) {
                    actions[action] = true
                }
            }
        })
        return Object.keys(actions).sort()
    }

    takePodAction(pod, target, cell) {
        if (pod.activate) {
            //log(`activating ${pod.name} against ${target.name}`)
            if (!cell && this.targetAutoSelection) {
                cell = this.autoTarget(target, this.targetPriority)
            }

            if (cell) {
                this.score.shots ++
                pod.activate(target, cell.x, cell.y)
            } else {
                log(`[${this.name}] failed to select a target`)
            }

        } else {
            log("can't activate " + pod.name)
        }
    }

    launch(action, target, cell) {
        const source = this
        setTimeout(() => {
            source.takeAction(action, target, cell)
        }, env.tune.actionDelay)
    }

    takeAction(action, target, cell) {
        //log('action: ' + action)
        this.skipped = 0
        const pods = this.pods.filter(pod => pod.triggersOn && pod.triggersOn(action))

        if (pods.length === 0) {
            log('no pods to take action [' + action + ']!')
        } else {
            if (action === 'lasers') {
                // volley fire!
                const ship = this
                pods.forEach(pod =>
                    setTimeout(() => {
                        ship.takePodAction(pod, target, cell)
                    }, RND(env.tune.laserSpread))
                )

            } else {
                const pod = _$.lib.math.rnde(pods)
                //log('selected ' + pod.name)
                this.takePodAction(pod, target, cell)

            }
        }
        /*
        this.pods.forEach(pod => {
            if (pod.triggerOn) {
                const trigger = pod.triggerOn()
                if (trigger === action) {
                    actionPod = pod
                }
            }
        })
        */

    }

    autoTarget(target, goal) {
        let pods
        switch(goal) {
            case 'systems':
                pods = target.pods.filter(p => !p.dead && p.system)
                break
            case 'weapons':
                pods = target.podsByTags('laser', 'driver', 'missile')
                break
            case 'shields':
                pods = target.podsByTags('shield')
                break
            case 'jammers':
                pods = target.podsByTags('jammer')
                break
            case 'reactors':
                pods = target.podsByTags('reactor')
                break
            case 'armor':
                pods = target.podsByTags('armor')
                break
        }

        if (!pods || pods.length === 0) {
            pods = target.pods.filter(t => !t.dead && t.system)
        }
        return _$.lib.math.rnde(pods)
    }

    manualTarget(target, next, back) {
        target.visualGrid.apply = next
        target.visualGrid.back = back
        lab.control.player.bindAll(target.visualGrid)
    }

    turn() {
        this.forEachPod((pod) => {
            if (pod.turn) pod.turn()
        })
    }

    subTurn() {
        this.forEachPod((pod) => {
            if (pod.subTurn) pod.subTurn()
        })
    }


    hit(attack, x, y) {
        const pod = this.getPod(x, y)
        if (pod && pod.tag !== 'debris' && pod.tag !== 'x') {
            log(`hitting ${this.name}/${pod.name}`)
            pod.hit(attack)
        } else {
            const loc = this.visualGrid.cellScreenCoord({x, y})
            sfx.play('missed', env.mixer.level.missed)
            lib.vfx.deflect(loc.x, loc.y, this.left)
            log(`attack at ${x}:${y} missed!`)
        }
    }

    shieldFromLaser(attack) {
        this.pods.forEach(pod => {
            if (pod.tag === 'shield' && pod.charge > 0) {
                // reduce attack
                if (attack < pod.charge) {
                    pod.charge -= attack
                    attack = 0
                } else {
                    attack -= pod.charge
                    pod.charge = 0
                }
            }
        })
        return attack
    }

    armorFromDriver(attack, x, y) {
        // armor in the area
        const sx = x - 1
        const sy = y - 1
        const fx = x + 1
        const fy = y + 1
        this.pods.forEach(pod => {
            if (pod.tag === 'armor' && pod.hits > 0
                    && pod.x >= sx && pod.x <= fx
                    && pod.y >= sy && pod.y <= fy) {
                // found armor in the area, reduce attack
                if (attack < pod.hits) {
                    pod.hit(attack)
                    //pod.hits -= attack
                    attack = 0
                } else {
                    attack -= pod.hits
                    pod.hit(pod.hits)
                    //pod.hits = 0
                    //pod.ship.killPod(pod)
                    log(`[${pod.ship.name}]/${pod.name} is destroyed by mass driver`)
                }
            }
        })
        return attack
    }

    isMissileJammed() {
        for (let i = 0; i < this.pods.length; i++) {
            const pod = this.pods[i]
            if (pod.tag === 'jammer' && pod.activate()) return true
        }
        return false
    }

    incomingProjectile(weapon, x, y, onHit) {
        const loc = this.visualGrid.cellScreenCoord({x, y})
        lab.screen.battle.vfx.spawn(dna.Projectile, {
            type: weapon.kind,
            target: {
                x: loc.x,
                y: loc.y,
            },
            onHit: onHit,
        })
    }

    incoming(weapon, attack, x, y) {
        const target = this
        log(`[${this.name}] => incoming [${weapon.name}](${attack})`)
        if (weapon.tag === 'laser') {
            const origAttack = attack
            attack = this.shieldFromLaser(attack)
            if (attack < origAttack) {
                log(`laser deflected: ${origAttack-attack}/${origAttack}`)
                y = -1
                this.incomingProjectile(weapon, x, y, () => {
                    const loc = target.visualGrid.cellScreenCoord({x, y})
                    lib.vfx.deflect(loc.x, loc.y, this.left)
                    sfx.play('deflect', env.mixer.level.deflect)
                })
            }

            if (attack > 0) {
                x = bend(weapon, x, 1)
                y = bend(weapon, y, 1)
                this.incomingProjectile(weapon, x, y, () => {
                    target.hit(attack, x, y)
                })
            }

        } else if (weapon.tag === 'driver') {
            this.incomingProjectile(weapon, x, y, () => {
                const origAttack = attack
                attack = this.armorFromDriver(attack, x, y)
                if (attack < origAttack) {
                    log(`driver deflected: ${origAttack-attack}/${origAttack}`)
                }

                if (attack > 0) {
                    log('original target at ' + x + ':' + y)
                    x = bend(weapon, x, 1)
                    y = bend(weapon, y, 1)
                    log('hitting cells at ' + x + ':' + y)
                    target.hit(floor(attack * .4), x, y)
                    target.hit(floor(attack * .15), x-1, y)
                    target.hit(floor(attack * .15), x+1, y)
                    target.hit(floor(attack * .15), x, y-1)
                    target.hit(floor(attack * .15), x, y+1)
                }
                target.hit(attack, x, y)
            })

        } else if (weapon.tag === 'missile') {
            let P = 5
            if (this.isMissileJammed()) P = 10

            while(attack > 0) {
                // determine projectile
                let subAttack = weapon.minAttack + RND(weapon.subAttack)
                if (subAttack > attack) subAttack = attack

                const dx = RND(P) - floor(P/2)
                const dy = RND(P) - floor(P/2)
                //log('projectile delta: ' + dx + ':' + dy)

                const tx = x + dx
                const ty = y + dy
                this.incomingProjectile(weapon, tx, ty, () => {
                    target.hit(subAttack, tx, ty)
                })
                attack -= subAttack
            }

        } else {
            throw 'unknown type of weapon!'
        }
    }

    setRechargePriority(mode) {
        if (!mode) return
        this.rechargePriority = mode
    }

    evo(dt) {
        for (let i = 0, N = this.pods.length; i < N; i++) {
            this.pods[i].evo(dt)
        }
    }


    // ******************************************
    // status

    podsByTags() {
        const tags = arguments
        return this.pods.filter(pod => {
            for (let i = 0; i < tags.length; i++) {
                if (tags[i] === pod.tag) return true
            }
            return false
        })
    }
    
    damagedPods() {
        return this.pods.filter(pod => pod.isDamaged())
    }

    // ******************************************
    // stat

    totalHits() {
        let hits = 0
        this.pods.forEach(pod => hits += pod.hits)
        return hits
    }

    systemHits() {
        let hits = 0
        this.pods.forEach(pod => {
            if (pod.system) {
                hits += pod.hits
            }
        })
        return hits
    }

    currentCharge() {
        let charge = 0
        this.pods.forEach(pod => {
            if (pod.df.charge) {
                charge += pod.charge
            }
        })
        return charge
    }

    maxCharge() {
        let charge = 0
        this.pods.forEach(pod => {
            if (pod.df.charge) {
                charge += pod.df.charge
            }
        })
        return charge
    }

    shields() {
        let charge = 0
        this.pods.forEach(pod => {
            if (pod.tag === 'shield' || pod.tag === 'jammer') {
                charge += pod.charge
            }
        })
        return charge
    }

    weaponsCharge() {
        let charge = 0
        this.pods.forEach(pod => {
            if (pod.tag === 'laser' || pod.tag === 'driver') {
                charge += pod.charge
            }
        })
        return charge
    }

    weaponsMaxCharge() {
        let charge = 0
        this.pods.forEach(pod => {
            if (pod.tag === 'laser' || pod.tag === 'driver') {
                charge += pod.df.charge
            }
        })
        return charge
    }

    activeSystems() {
        let systems = 0
        this.pods.forEach(pod => {
            if (pod.system) {
                if (!pod.dead && pod.hits > 0) systems ++
            }
        })
        return systems
    }

    activeWeapons() {
        let weapons = 0
        this.pods.forEach(pod => {
            if (!pod.dead && pod.attack > 0) {
                 weapons ++
            }
        })
        return weapons
    }

    isDestroyed() {
        const systems = this.activeSystems()
        const weapons = this.activeWeapons()
        return (systems === 0 && weapons === 0)
    }

    destroy() {
        const ship = this
        this.status = 'destroyed'
        sfx.play('explosion2', env.mixer.level.destroyed)

        let burns = env.mixer.destroyBurns
        for (let i = 0; i < env.style.destroyExplosions; i++) {
            const x = RND(this.blueprint.w)
            const y = RND(this.blueprint.h)
            const cell = this.blueprint.cellAt(x, y)
            if (cell !== 'x') {
                const orig = {x, y}
                const loc = this.visualGrid.cellScreenCoord(orig)
                setTimeout(() => {
                    ship.mountPod(new dna.ypods.XPod(), orig.x, orig.y)
                    lib.vfx.explosion(loc.x, loc.y, this.left, env.style.color.c3)

                    if (burns > 0) {
                        sfx.play('explosion2', env.mixer.level.burn)
                        burns--
                    }
                }, RND(env.tune.finishBattleDelay))
            }
        }
    }
}
