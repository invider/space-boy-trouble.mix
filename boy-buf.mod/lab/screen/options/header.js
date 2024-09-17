function draw() {
    alignCenter()
    baseMiddle()
    fill(env.style.color.c3)
    font(env.style.titleFont)
    text(env.msg.gameTitle, rx(.5), 16)

    text('options', rx(.5), 40)
}
