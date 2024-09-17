const items = [
    'rematch',
    'continue',
]

let timeout = 0

function onMove(item) {
    this.__.control.keep(env.style.scoreTimeout)
}

function onSelect(item) {
    if (item === 'rematch') {
        this.__.control.rematch()
    } else {
        this.__.control.titles()
    }
}

function setup() {
    const W = 70
    const B = floor((ctx.width-W)/2)

    const menu = this.__.spawn(dna.hud.Menu, {
        Z: 1,
        name: 'menu',
        x: B,
        y: 90,
        w: W,
        h: ctx.height-60,
        background: false,
    })
    this.menu = menu

    const score = this.__.score
    augment(this.__, {
        show: function(data) {
            this.hidden = false
            this.control.state = 0
            this.control.data = data
            this.control.keep(env.style.scoreTimeout)

            score.show(data)
            this.menu.selectFrom({
                items,
                onSelect,
                onMove,
            })
            this.menu.current = 1
        },
        hide: function() {
            this.hidden = true
            this.menu.hide()
        },
    })
}

function keep(time) {
    timeout = time
}

function evo(dt) {
    if (this.hidden || this.state > 0) return

    if (timeout > 0) {
        timeout -= dt
        if (timeout < 0) this.titles()
    }
}

function rematch() {
    if (this.state > 0) return
    this.state = 1
    this.__.menu.hide()

    const playerA = this.data.shipA.player
    const playerB = this.data.shipB.player
    // reconstruct ships
    lab.screen.design.control.constructShip(playerA, playerA.blueprint)
    lab.screen.design.control.constructShip(playerB, playerB.blueprint)

    const activeScreen = this.__
    lab.vfx.itransit(() => {
        activeScreen.hide()
        trap('battle', playerB)
    })
}

function titles() {
    if (this.state > 0) return
    this.state = 1
    this.__.menu.hide()
    this.__.score.hide()

    const activeScreen = this.__
    lab.vfx.itransit(() => {
        activeScreen.hide()
        trap('title')
    })
}
