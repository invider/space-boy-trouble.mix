function configure() {
    if ($.env.config.fast) {
        env.style.holdBeforeStart = 0
        env.style.fadeIn = 0
        env.style.fadeOut = 0
        $.env.tune.fadeKeep = 0
        $.env.tune.fadeOut = 0
    }
}

function jumpToMenu() {
    $.trap.attach(function start() {
        log('hyperjump to the menu')
        trap('menu')
    })
    return true
}

function startNewGame() {
    $.trap.attach(function start() {
        log('hyperjump to newgame')
        trap('newGame', {
             playerA: {
                 human: true,
                 budget: 1000,
             },
             playerB: {
                 human: false,
                 budget: 1000,
             },
        })
    })
    return true
}

function autostartBattle() {
    const playerA = lab.spawn(dna.Player, {
        name: 'playerA',
        title: 'Player A',
        human: true,
        balance: 1000,
    })
    const playerB = lab.spawn(dna.Player, {
        name: 'playerB',
        title: 'Player B',
        human: false,
        balance: 1000,
    })
    playerB.prev = playerA
    playerA.next = playerB

    if ($.env.config.botA) playerA.human = false
    if ($.env.config.botB) playerB.human = false
    if ($.env.config.humanA) playerA.human = true
    if ($.env.config.humanB) playerB.human = true

    const control = lab.screen.layout.control
    control.autoConstruct(playerA, $.env.config.blueprintA)
    control.autoConstruct(playerB, $.env.config.blueprintB)

    lab.screen.show()
    trap('battle', playerB)
    return true
}

function hyperjump() {
    if ($.env.config.menu) return jumpToMenu()
    if ($.env.config.newgame) return startNewGame()
    if ($.env.config.battle) return autostartBattle()
    return false
}
