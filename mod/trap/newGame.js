function newGame() {
    log('Starting a New Game')

    // TODO clear the old space if needed?
    // ...
    lab.space.killAll()
    lab.space.link(dna.collider)
    
    log('creating system zero...')
    const systemZero = lab.space.spawn(dna.space.System, {
        name: 'systemZero',
    })
    const ship = systemZero.spawn(dna.space.Ship, {
        team: 1,
        name: 'kobra',
        x:    0,
        y:    0,
    })
    lab.gameboy1.port.bind(ship)

    systemZero.spawn(dna.space.Ship, {
        team: 2,
        name: 'obra',
        x:    70,
        y:    80,
    })

    lab.gameboy1.port.jumpToSystem(systemZero)
}
