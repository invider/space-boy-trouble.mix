function putPixel(x, y, icolor) {
    // rotate first
    let sx = floor(x - this.bx + this.hw)
    let sy = floor(y - this.by + this.hh)
    //sx = sx * cos(this.br) - sy * sin(this.br)
    //sy = sx * sin(this.br) + sy * cos(this.br)
    if (sx < 0 || sx >= this.fw || sy < 0 || sy >= this.fh) return
    const b = (sy * env.cfg.width + sx) * 4
    const c = this.pal.toColorArray(icolor || 0)
    this.pdata.data[b]   = c[0]
    this.pdata.data[b+1] = c[1]
    this.pdata.data[b+2] = c[2]
    this.pdata.data[b+3] = 255
}

function drawLine(x1, y1, x2, y2, icolor) {
    const dx = abs(x2 - x1),
          dy = abs(y2 - y1),
          sx = x2 >= x1? 1 : -1,
          sy = y2 >= y1? 1 : -1

    if (dy <= dx) {
        let d = (dy << 1) - dx
        let d1 = dy << 1
        let d2 = (dy - dx) << 1
        this.putPixel(x1, y1, icolor)

        for (let x = x1 + sx, y = y1, i = 1; i <= dx; i++, x += sx) {
            if (d > 0) {
                d += d2
                y += sy
            } else {
                d += d1
            }
            this.putPixel(x, y, icolor)
        }
    } else {
        let d = (dx << 1) - dy
        let d1 = dx << 1
        let d2 = (dx - dy) << 1
        this.putPixel(x1, y1, icolor)
        for (let x = x1, y = y1 + sy, i = 1; i <= dy; i++, y += sy) {
            if (d > 0) {
                d += d2
                x += sx
            } else {
                d += d1
            }
            this.putPixel(x, y, icolor)
        }
    }
}

function drawCirclePoints(x, y, xc, yc, icolor) {
    this.putPixel(xc + x, yc + y, icolor)
    this.putPixel(xc + y, yc + x, icolor)
    this.putPixel(xc + y, yc - x, icolor)
    this.putPixel(xc + x, yc - y, icolor)
    this.putPixel(xc - x, yc - y, icolor)
    this.putPixel(xc - y, yc - x, icolor)
    this.putPixel(xc - y, yc + x, icolor)
    this.putPixel(xc - x, yc + y, icolor)
}

function drawCircle(xc, yc, r, icolor) {
    let x = 0,
        y = r,
        d = 1 - r,
        delta1 = 3,
        delta2 = -2*r + 5
    this.drawCirclePoints(x, y, xc, yc, icolor)
    while(y > x) {
        if (d < 0) {
            d += delta1
            delta1 += 2
            delta2 += 2
            x++
        } else {
            d += delta2
            delta1 += 2
            delta2 += 4
            x++
            y--
        }
        this.drawCirclePoints(x, y, xc, yc, icolor)
    }
}
