function uniquelyName(blueprint, map, suffix) {
    suffix = suffix || 'mk'
    const exist = map[blueprint.name]
    if (exist) {
        // need to find a new name
        let base = blueprint.name

        let i = base.indexOf(' mk')
        if (i > 0) {
            // remove "mk" suffix
            base = base.substring(0, i)
        } else {
            i = base.indexOf(' v')
            if (i > 0) {
                // remove "v" suffix
                base = base.substring(0, i)
            }
        }

        let mk = 2
        let looking = true
        while(looking) {
            const name = base + ' ' + suffix + mk++
            if (!map[name]) {
                blueprint.name = name
                looking = false
            }
        }
    }
    map[blueprint.name] = blueprint
}

class LayoutControl {

    constructor(st) {
        this.name = 'control'
        augment(this, st)
    }

    compileBlueprints(player) {
        const blueprints = []
        const blueprintsMap = {}
        const emptyBlueprints = []
        const readyBlueprints = []
        const readyBlueprintsMap = {}
        const budget = player.balance

        // create a blueprint for each layout available
        dna.spec.layout._ls.forEach(layout => {
            if (layout.cost < budget) {
                const blueprint = new dna.Blueprint({
                    layout: layout,
                })
                blueprints.push(blueprint)
                uniquelyName(blueprint, blueprintsMap)
                emptyBlueprints.push(blueprint)
            }
        })

        // create blueprints form blueprint dumps
        dna.spec.blueprints._ls.forEach(blueprintDump => {
            const blueprint = new dna.Blueprint(blueprintDump)
            blueprint.estimateCost((podName) => {
                return lib.pods.podCost(podName)
            })
            if (blueprint.cost < budget) {
                blueprints.push(blueprint)
                uniquelyName(blueprint, blueprintsMap)
                readyBlueprints.push(blueprint)
                readyBlueprintsMap[blueprint.name] = blueprint
            }
        })

        // create blueprints from local store
        const cache = lib.util.loadCache()
        if (cache.blueprints) {
            Object.values(cache.blueprints).forEach(blueprintDump => {
                const blueprint = new dna.Blueprint(blueprintDump)
                blueprint.estimateCost((podName) => {
                    return lib.pods.podCost(podName)
                })
                if (blueprint.cost < budget) {
                    blueprints.push(blueprint)
                    uniquelyName(blueprint, blueprintsMap)
                    readyBlueprints.push(blueprint)
                    readyBlueprintsMap[blueprint.name] = blueprint
                }
            })
        }

        this.current = 0
        this.blueprints = blueprints
        this.blueprintsMap = blueprintsMap
        this.emptyBlueprints = emptyBlueprints
        this.readyBlueprints = readyBlueprints
        this.readyBlueprintsMap = readyBlueprintsMap
    }

    selectFor(player) {
        env.state = 'layout'
        this.player = player
        this.unlock()
        this.compileBlueprints(player)

        if (player.human) {
            this.__.playerData.setPlayer(player)
            this.sync()
            this.__.show()
        } else {
            this.selectForBot(player)
        }
    }

    autoConstruct(player, blueprintName) {
        let blueprint
        this.compileBlueprints(player)
        if (!blueprintName) {
            blueprint = _.bot.selectBlueprint(player, this.readyBlueprints)
            log('bot selected a blueprint ' + blueprint.name
                + ' for ' + player.name)
        } else {
            blueprint = this.readyBlueprintsMap[blueprintName]
            if (!blueprint) throw `can't find blueprint [${blueprintName}]`
        }
        player.blueprint = blueprint
        lab.screen.design.control.constructShip(player, blueprint)
    }

    selectForBot(player) {
        env.state = 'layout'
        let blueprint
        if (rnd() < env.tune.selectExistingBlueprint) {
            blueprint = _.bot.selectBlueprint(player, this.readyBlueprints)
        } else {
            blueprint = _.bot.createBlueprint(player,
                lab.screen.design.control, this.emptyBlueprints)
        }
        uniquelyName(blueprint, this.blueprintsMap, 'v')
        player.blueprint = blueprint

        log('bot selected a blueprint ' + blueprint.name + ' for ' + player.name)
        lab.screen.design.control.constructShip(player, blueprint)
        
        const control = this
        lab.vfx.itransit(() => {
            if (player.next) {
                // construction for next player
                trap('layout', player.next)
            } else {
                // ships are ready, prep for the battle!
                trap('battle', player)
            }
        })
    }

    next() {
        this.current ++
        if (this.current > this.blueprints.length + 1) {
            this.current = 0
        }
        this.sync()
        sfx.play('select', env.mixer.level.select)
    }

    prev() {
        this.current --
        if (this.current < 0) {
            this.current = this.blueprints.length + 1
        }
        this.sync()
        sfx.play('select', env.mixer.level.select)
    }

    lock() {
        if (this.state) return
        this.state = 1
        lab.control.player.unbindAll(this)
    }

    unlock() {
        this.state = 0
        lab.control.player.bindAll(this)
    }

    designForBlueprint(blueprint) {
        const control = this
        const player = this.player
        player.blueprint = blueprint

        lab.vfx.itransit(() => {
            lab.screen.layout.hide()
            uniquelyName(blueprint, control.blueprintsMap)
            trap('design', player)
        })
        sfx.play('apply', env.mixer.level.apply)
    }

    done() {
        let blueprint = this.currentBlueprint()
        if (blueprint === 'upload') {
            lib.util.uploadJSON()

        } else if (blueprint === 'random') {
            this.lock()
            blueprint = _.bot.selectBlueprint(this.player, this.readyBlueprints)
            this.designForBlueprint(blueprint)

        } else if (blueprint) {
            this.lock()
            this.designForBlueprint(blueprint)
        }
    }

    back() {
        this.lock()
        lab.vfx.itransit(() => {
            lab.screen.layout.hide()
            trap('menu')
        })
        sfx.play('apply', env.mixer.level.apply)
    }

    sync() {
        const blueprint = this.currentBlueprint()
        if (isObj(blueprint)) {
            this.__.grid.setBlueprint(blueprint)
        } else {
            this.__.grid.setBlueprint()
        }
    }

    currentPlayer() {
        return this.player
    }

    currentBlueprint() {
        const N = this.blueprints.length
        if (this.current === N) return 'random'
        else if (this.current === N+1) return 'upload'
        else return this.blueprints[this.current]
    }

    activate(action) {
        switch(action) {
            case 2: this.prev(); break;
            case 4: this.next(); break;
            case 5: this.done(); break;
            case 6: this.back(); break;
        }
    }
}
