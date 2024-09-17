function battle() {
    const battle = lab.screen.touch('battle', dna.trait.hidable)
    _$.battle = battle

    battle.spawn(dna.Starfield, {
        x: 0,
        y: 0,
        w: rx(.5),
        h: ry(1),
        speed: 4,
        wind: -3,
    })

    battle.spawn(dna.Starfield, {
        x: rx(.5),
        y: 0,
        w: rx(.5),
        h: ry(1),
        speed: 3,
        wind: 3,
    })

    battle.spawn(dna.hud.Separator, {
        x: floor(ctx.width/2)
    })

    // create ship grids
    const GY = 18
    const left = battle.spawn(dna.hud.ShipGrid, {
        Z: 11,
        name: 'left',
        x: 4,
        y: GY,
    })

    const PY = 114
    const leftPanel = battle.spawn(dna.hud.ShipPanel, {
        Z: 12,
        name: 'leftPanel',
        x: 1,
        y: PY,
        w: 78,
        h: ctx.height - PY,
    })

    const MY = 20
    const leftMenu = battle.spawn(dna.hud.Menu, {
        Z: 31,
        name: 'leftMenu',
        x: 0,
        y: MY,
        w: 79,
        h: 100,
        showBackground: true,
        onBack: function() {
            if (this.state) this.hidden = !this.hidden
        },
        IDLE: env.tune.botControlIn,
    })

    const right = battle.spawn(dna.hud.ShipGrid, {
        Z: 11,
        name: 'right',
        x: 85,
        y: GY,
        layout: dna.spec.layout.whale,
    })

    const rightPanel = battle.spawn(dna.hud.ShipPanel, {
        Z: 12,
        name: 'rightPanel',
        x: 82,
        y: PY,
        w: 78,
        h: ctx.height - PY,
    })

    const rightMenu = battle.spawn(dna.hud.Menu, {
        Z: 31,
        name: 'rightMenu',
        x: 81,
        y: MY,
        w: 79,
        h: 100,
        showBackground: true,
        onBack: function() {
            if (this.state) this.hidden = !this.hidden
        },
        IDLE: env.tune.botControlIn,
    })

    battle.touch('vfx', {
        Z: 21,
    })
    battle.vfx.attach(new dna.ClipFrame({
        name: 'left',
        x: 0,
        y: 0,
        w: 79,
        h: 144,
    }))
    battle.vfx.attach(new dna.ClipFrame({
        name: 'right',
        x: 81,
        y: 0,
        w: 79,
        h: 144,
    }))

    battle.spawn(dna.control.BattleControl, {
        name: 'control',
        left: left,
        right: right,
        leftPanel: leftPanel,
        rightPanel: rightPanel,
        leftMenu: leftMenu,
        rightMenu: rightMenu,
    })
}
