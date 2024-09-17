const ACTIVE = 0
const HALT = 1

const rechargeModes = [
    'all',
    'weapons',
    'systems',
    'm-drivers',
    'lasers',
    'shields',
    'jammers',
    'repairs',
]
rechargeModes.id = 'recharge'

const targeting = [
    'auto',
    'manual'
]
targeting.id = 'targeting'

const targets = [
    'systems',
    'weapons',
    'shields',
    'jammers',
    'reactors',
    'armor',
]
targets.id = 'targets'



class BattleControl {

    constructor(st) {
        augment(this, st)
    }

    installAutopilot(ship) {
        log('installing autopilot for ' + ship.name + '/' + ship.player.name)
        ship.autoSelect = _.bot.computingCore.autoSelect
        ship.autoPilot = _.bot.computingCore.autoPilot
    }

    startBattle(playerA, playerB) {
        env.state = 'battle'
        const shipA = playerA.ship
        const shipB = playerB.ship
        if (playerA.hybrid) playerA.human = false
        if (playerB.hybrid) playerB.human = false
        this.installAutopilot(shipA)
        this.installAutopilot(shipB)
        this.turn = 1
        this.status = ACTIVE
        this.subturn = 0
        this.shipA = shipA
        this.shipB = shipB
        shipA.foe = shipB
        shipB.foe = shipA
        this.left.setBlueprint(shipA)
        shipA.left = true
        this.right.setBlueprint(shipB)
        shipB.right = true
        this.leftPanel.monitor(shipA)
        this.rightPanel.monitor(shipB)
        this.leftMenu.hide()
        this.rightMenu.hide()
        this.__.vfx.showAll()

        shipA.name += ' A'
        shipA.chargeForBattle()
        shipB.name += ' B'
        shipB.chargeForBattle()

        this.turnA()
        lab.control.player.bindAll(this)
    }

    humanTurn(source, target, menu, nextAction) {
        const control = this
        const actions = source.actionsAvailable()

        actions.push({ section: true, title: 'target' })
        actions.push(targeting)
        if (source.targetAutoSelection) {
            targeting.current = 0
            targets.disabled = false
        } else {
            targeting.current = 1
            targets.disabled = true
        }

        actions.push(targets)
        targets.current = targets.indexOf(source.targetPriority)

        actions.push({ section: true, title: 'charge mode' })
        actions.push(rechargeModes)
        rechargeModes.current = rechargeModes.indexOf(source.rechargePriority)

        actions.push('skip')
        actions.push('-- yield --')

        menu.selectFrom({
            items: actions,
            onSelect: function(selected) {
                let skip = false

                if (this.hidden) {
                    this.hidden = false
                    return
                }
                if (selected === '-- yield --') {
                    this.items[this.current] = 'yield'
                    sfx.play('ddenied', env.mixer.level.denied)
                    return
                }
                if (isObj(selected)) return

                this.hide()
                if (selected === 'yield') {
                    source.status = 'yield'
                    target.status = 'win'
                    control.finishBattle()
                    return
                } else if (selected === 'skip') {
                    source.skipped ++
                    skip = true
                    // do nothing

                } else {
                    if (source.player.human && !source.targetAutoSelection) {
                        // have to select target manually
                        source.manualTarget(target, function() {
                            source.launch(selected, target, this.target)
                            lab.control.player.unbindAll(this)

                            if (!control.endCondition()) {
                                if (skip) setTimeout(nextAction, env.tune.turnSkipDelay)
                                else setTimeout(nextAction, env.tune.subturnDelay)
                            }
                        })
                        return // skip auto-progression until x:y are selected

                    } else {
                        setTimeout(() => {
                            source.launch(selected, target)
                        }, env.tune.launchDelay)
                    }
                }

                if (!control.endCondition()) {
                    if (skip) setTimeout(nextAction, env.tune.turnSkipDelay)
                    else setTimeout(nextAction, env.tune.subturnDelay)
                }
            },
            onSwitch: function(switched, i) {
                const val = switched[switched.current]

                switch(switched.id) {
                case 'recharge':
                    source.setRechargePriority(val)
                    break

                case 'targeting':
                    if (val === 'manual') {
                        source.targetAutoSelection = false
                        this.items[i+1].disabled = true
                    } else {
                        source.targetAutoSelection = true
                        this.items[i+1].disabled = false
                    }
                    break

                case 'targets':
                    source.targetPriority = val
                    break
                }
            },
            onIdle: function() {
                this.focusOn('skip')
                setTimeout(() => {
                    log(`[${source.name}] bot captures control!`)
                    source.player.human = false
                    this.select()
                }, 200)
            },
        })
    }

    botTurn(source, target, nextAction) {
        // log('bot action')
        source.autoPilot(target)

        if (!this.endCondition()) {
            setTimeout(nextAction, env.tune.subturnDelay)
        }
    }

    turnA() {
        if (this.status === HALT) return
        const source = this.shipA
        const target = this.shipB
        const control = this
        const next = (() => control.turnB())
        

        source.subTurn()
        if (source.player.human) {
            setTimeout( () => {
                this.humanTurn(source, target, this.leftMenu, next)
            }, env.tune.humanTurnDelay)
        } else {
            this.botTurn(source, target, next)
        }
    }

    turnB() {
        if (this.status === HALT) return
        const source = this.shipB
        const target = this.shipA
        const control = this
        const next = (() => control.nextTurn())

        source.subTurn()
        if (source.player.human) {
            setTimeout( () => {
                this.humanTurn(source, target, this.rightMenu, next)
            }, env.tune.humanTurnDelay)
        } else {
            this.botTurn(source, target, next)
        }
    }

    endCondition() {
        if (this.turn > env.tune.maxTurns
                || (this.shipA.skipped >= env.tune.skipsToDraw
                    && this.shipB.skipped >= env.tune.skipsToDraw)) {
            this.shipA.status = 'draw'
            this.shipB.status = 'draw'
            this.finishBattle()
            return true
        }
        
        if (this.shipA.isDestroyed() || this.shipB.isDestroyed()) {
            this.finishBattle()
            return true
        }
        return false
    }

    evo(dt) {
        if (this.shipA && this.shipB) {
            this.shipA.evo(dt)
            this.shipB.evo(dt)
        }
    }

    nextTurn() {
        if (this.status === HALT) return
        log('--------------')
        log('finishing turn')
        this.shipA.turn()
        this.shipB.turn()
        this.turn ++
        log('====================')
        log('Turn: ' + this.turn)
        log('====================')

        if (!this.endCondition()) {
            this.turnA()
            sfx.play('select', env.mixer.level.nextTurn)
        }
    }

    activate(action) {
        if (action === 6 && !this.shipA.human && !this.shipB.human) {
            this.finishBattle()
        }
    }

    determineWinner() {
        const A = this.shipA
        const B = this.shipB

        if (!A.status && !B.status) {
            const ah = A.systemHits()
            const bh = B.systemHits()

            if (A.isDestroyed()) A.destroy()
            if (B.isDestroyed()) B.destroy()

            if (A.status === 'destroyed' && !B.status) B.status = 'win'
            if (B.status === 'destroyed' && !A.status) A.status = 'win'
        }

        if (!A.status && !B.status) {
            A.status = 'draw'
            B.status = 'draw'
        }

        const res = {
            shipA: this.shipA,
            shipB: this.shipB,
        }
        if (res.shipA.status === 'yield' || res.shipB.status === 'yield') {
            res.yield = true
        }
        return res
    }

    finishBattle() {
        this.status = HALT
        const activeScreen = this.__
        lab.control.player.unbindAll()
        const scoreData = this.determineWinner()

        let delay = env.tune.finishBattleDelay
        if (scoreData.yield) delay = env.tune.yieldBattleDelay

        sfx.play('powerDown', env.mixer.level.finish)
        lab.vfx.itransit(() => {
            activeScreen.hide()
            trap('score', scoreData)
        }, delay)
    }
}
