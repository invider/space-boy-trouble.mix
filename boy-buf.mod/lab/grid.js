const Z = 1

const hidden = true

function draw() {
    const w = ctx.width
    const h = ctx.height
    const step = 16

    let x = 0
    let y = 0
    lineWidth(1)
    fill('#505550')
    while (y < h) {
        while (x < w) {
            plot(x, y)
            x += step
        }
        x = 0
        y += step
    }
}
