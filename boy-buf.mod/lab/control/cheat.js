const sequence = []

function captureLeft() {
    const player = lab.screen.battle.control.shipA.player
    log(`capturing ${player.name}`)
    player.human = true
}

function captureRight() {
    const player = lab.screen.battle.control.shipB.player
    log(`capturing ${player.name}`)
    player.human = true
}

function match() {
    const s = sequence.join('')
    switch (s) {
        case '22522': captureLeft(); break;
        case '44544': captureRight(); break;
    }

}

function cheat(action) {
    if (env.state !== 'battle') return

    sequence.push(action)
    if (sequence.length > 5) {
        sequence.splice(0, 1)
    }
    match()
}
