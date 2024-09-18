function newGame() {
    log('Starting a New Game')

    // TODO clear the old space if needed?
    // ...
    lab.space.killAll()
    
    log('creating system zero...')
    const systemZero = lab.space.spawn(dna.space.System, {
        name: 'systemZero',
    })
    systemZero.spawn(dna.space.Ship, {
        name: 'kobra',
        x:    0,
        y:    0,
    })

    lab.gameboy1.screen.port.jumpToSystem(systemZero)

}
