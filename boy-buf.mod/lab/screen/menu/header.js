function draw() {
    alignCenter()
    baseMiddle()
    fill(env.style.color.c3)
    font(env.style.titleFont)
    text(env.msg.gameTitle, rx(.5), 16)

    text('menu', rx(.5), 40)


    alignRight()
    baseBottom()
    font(env.style.font)
    let x = rx(1) - 2
    let y = 32
    text(env.msg.version, x, y)
}
