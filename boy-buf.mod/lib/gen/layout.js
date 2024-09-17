function layout() {
    const layout = lab.screen.touch('layout', dna.trait.hideAndBind)
    _$.layout = layout

    augment(layout, {
        activate: function(action) {
            this.control.activate(action)
        }
    })

    const W = ctx.width/2 - 2
    const BX = floor(ctx.width * .2)

    layout.spawn(dna.hud.Frame, {
        title: 'layout',
        x: BX,
        y: 0,
        w: W,
        h: ctx.height - 1,
        drawContent: function() {
            const control = lab.screen.layout.control
            const blueprint = control.currentBlueprint()

            const x = floor(this.w/2)
            baseTop()
            alignCenter()
            fill(this.color)

            if (blueprint === 'random') {
                text('random', x, 60)
            } else if (blueprint === 'upload') {
                text('upload', x, 60)
            } else if (blueprint) {
                text(blueprint.name, x, 12)
                text('$' + blueprint.estimateCost(), x, 20)
                text('space: ' + blueprint.getSpace(), x, 134)
            }
        }
    })

    layout.spawn(dna.hud.PlayerData, {
        name: 'playerData',
        x: ctx.width - 1,
        y: 2,
        color: env.style.color.c3,
    })

    const grid = layout.spawn(dna.hud.ShipGrid, {
        Z: 11,
        name: 'grid',
        x: BX + 4,
        y: 32,
        layout: dna.spec.layout.whale,
    })

    layout.spawn(dna.control.LayoutControl, {
        grid: grid,
    })
}
