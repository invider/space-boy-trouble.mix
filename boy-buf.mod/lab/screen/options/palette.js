
function draw() {
    const color = env.style.color

    const s = 12
    let x = rx(1) - 2*s
    let y = ry(1) - 2*s

    fill(color.c3)
    rect(x, y, s, s)

    fill(color.c1)
    rect(x+s, y, s, s)

    fill(color.c2)
    rect(x, y+s, s, s)

    fill(color.c0)
    rect(x+s, y+s, s, s)

    blocky()
    res.pods.draw(8, x-2*s, y, 2*s, 2*s)
}
