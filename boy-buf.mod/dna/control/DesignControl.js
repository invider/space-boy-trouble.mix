class DesignControl {

    constructor(st) {
        this.name = 'control'
        augment(this, st)
    }

    designFor(player) {
        env.state = 'design'
        this.state = 0
        this.player = player
        this.blueprint = player.blueprint
        this.title.setText(this.blueprint.name)
        this.player.buy(this.blueprint.estimateCost(), true)
        this.grid.setBlueprint(this.blueprint)
        this.playerData.setPlayer(player)

        this.designer.compilePods()

        this.selectPod()
    }

    designForBot(player) {
        env.state = 'design'
        this.player = player
        this.blueprint = player.blueprint
        this.designer.compilePods()
        this.player.buy(this.blueprint.estimateCost(), true)
    }

    selectPod() {
        this.__.blueprint.active = false
        this.__.parts.active = true
        lab.control.player.unbindAll(this.grid)
        lab.control.player.bindAll(this.designer)
    }

    placePod(pod) {
        if (!pod) return

        if (pod.name === 'build') {
            if (this.player.balance >= 0) {
                this.build()
            } else {
                sfx.play('denied', env.mixer.level.denied)
            }

        } else if (pod.name === 'download') {
            this.blueprint.download()

        } else if (pod.name === 'save') {
            this.blueprint.save()

        } else {
            this.__.parts.active = false
            this.__.blueprint.active = true
            this.grid.pod = pod
            lab.control.player.unbindAll(this.designer)
            lab.control.player.bindAll(this.grid)
        }
    }

    installPod(pod, x, y) {
        if (!pod) return
        if (this.player.buy(pod.cost)) {
            const removedPod = this.removePod(x, y, true)
            this.blueprint.placePod(x, y, pod.name, pod.cost)
            sfx.play('use', env.mixer.level.apply)
        } else {
            sfx.play('denied', env.mixer.level.denied)
        }
    }

    removePod(x, y, silent) {
        const designer = this.designer
        const podName = this.blueprint.removePod(
            x, y, (name) => {
                return designer.podPrice(name)
            })
        if (podName) {
            const price = designer.podPrice(podName)
            this.player.sell(price)
            if (!silent) sfx.play('noisy', env.mixer.level.remove)
        } else {
            if (!silent) sfx.play('denied', env.mixer.level.denied)
        }
    }

    finalizeBlueprint(blueprint) {
        blueprint.hits = blueprint.estimateHits((podName) => {
            return lib.pods.podHits(podName)
        })
    }

    constructShip(player, blueprint) {
        const ship = new dna.Ship(blueprint)
        ship.player = player
        player.ship = ship
        return ship
    }

    saveBlueprint(blueprint) {
        if (!blueprint.dirty) {
            log(`skipping ${blueprint.name} save - nothing is changed!`)
            return
        }
        if (env.opt.autosave) {
            blueprint.save()
        } else {
            dna.spec.blueprints.attach( blueprint.dump() )
        }
    }

    build() {
        if (this.state > 0) return
        this.state = 1

        this.finalizeBlueprint(this.blueprint)
        this.saveBlueprint(this.blueprint)
        const ship = this.constructShip(this.player, this.blueprint)

        const player = ship.player
        const control = this
        const activeScreen = this.__
        lab.vfx.itransit(() => {
            control.unbindAll()
            activeScreen.hide()

            if (player.next) {
                // construction for next player
                trap('layout', player.next)
            } else {
                // ships are ready, prep for the battle!
                trap('battle', player)
            }
        })
    }

    unbindAll() {
        lab.control.player.unbindAll(this.grid)
        lab.control.player.unbindAll(this.designer)
    }
}
