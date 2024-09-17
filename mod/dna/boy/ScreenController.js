class ScreenController {

    constructor(st) {
        extend(this, {
            name: 'screenController',
        }, st)
    }

    hideAll() {
        this.__.screen._ls.forEach(screen => screen.hide())
    }

    show(name) {
        // TODO implement the transition cycle: fade out - hide - wait - fade in - activate
        this.hideAll()

        const screen = this.__.screen._dir[name]
        if (!screen) throw new Error(`Failed to locate the screen [${name}]!`)

        log(`activating screen: [${name}]`)
        screen.show()
        this.__.state = name

        lab.control.controller.bindAll(screen)
    }
}
