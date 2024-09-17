const Z = 21
let timeout = 0

function evo(dt) {
    if (timeout > 0) {
        timeout -= dt
        if (timeout < 0) this.fadeOut()
    }
}

function keep(time) {
    this.state = 0
    timeout = time
}

function fadeOut() {
    if (this.state) return
    this.state = 1

    lab.control.player.unbindAll(this)

    const activeScreen = this
    lab.vfx.itransit(() => {
        activeScreen.hide()
        trap('menu')
    })
}

function draw() {
    image(res.title, 0, 0, rx(1), ry(1))

    alignCenter()
    baseMiddle()
    font(env.style.titleFont)

    fill(env.style.color.c0)
    text(env.msg.gameTitle, rx(.5)+1, ry(.5)+1)

    fill(env.style.color.c3)
    text(env.msg.gameTitle, rx(.5), ry(.5))


    alignRight()
    baseBottom()
    font(env.style.font)
    let x = rx(1) - 8
    let y = ry(1) - 8
    text('by Igor Khotin', x, y)
}

function activate(action) {
    this.fadeOut()
    sfx.play('use', env.mixer.level.apply)
}
