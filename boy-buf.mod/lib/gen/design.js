function design() {
    const design = lab.screen.touch('design')
    augment(design, dna.trait.hidable)
    _$.design = design

    design.spawn(dna.hud.Frame, {
        title: 'blueprint',
        x: 0,
        y: 0,
        w: ctx.width/2 - 2,
        h: ctx.height - 1,
    })

    const title = design.spawn(dna.hud.Label, {
        x: 39,
        y: 19,
        text: 'blueprint',
        color: env.style.color.c1,
        syncTheme: function() {
            this.color =  env.style.color.c1
        },
    })

    const grid = design.spawn(dna.hud.ShipGrid, {
        Z: 11,
        name: 'grid',
        x: 4,
        y: 28,
        apply: function() {
            if (this.pod) {
                const {x, y} = this.target
                if (this.pod.name === 'remove') {
                    this.__.control.removePod(x, y, false)
                } else {
                    this.__.control.installPod(this.pod, x, y)
                    /*
                    if (this.__.control.player.buy(this.pod.cost)) {
                        this.blueprint.placePod(
                            this.target.x,
                            this.target.y,
                            this.pod.name,
                            this.pod.cost
                        )
                        // TODO play placement sfx
                    } else {
                        // TODO play denied sfx
                    }
                    */
                }
            }
        },
        back: function() {
            this.pod = null
            this.__.control.selectPod()
            sfx.play('apply', env.mixer.level.switch)
        }
    })

    const designerFrame = design.spawn(dna.hud.Frame, {
        title: 'parts',
        x: ctx.width/2 + 1,
        y: 0,
        w: ctx.width/2 - 2,
        h: ctx.height - 24,
    })
    const designer = design.spawn(dna.hud.Designer, {
        name: 'designer',
        x: designerFrame.x + 2,
        y: designerFrame.y + 12,
        w: designerFrame.w - 4,
        h: designerFrame.h - 16,
    })

    const playerData = design.spawn(dna.hud.PlayerData, {
        name: 'playerData',
        x: ctx.width,
        y: designerFrame.y + designerFrame.h + 4,
        color: env.style.color.c3,
    })

    design.spawn(dna.control.DesignControl, {
        grid: grid,
        title: title,
        designer: designer,
        playerData: playerData,
    })
}
