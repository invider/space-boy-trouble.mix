function init() {
    // we don't want to set the recepient name
    delete this.name
    delete this.init
}

function gxy(lx, ly) {
    return [
        this.x + lx * cos(this.dir) - ly * sin(this.dir),
        this.y + lx * sin(this.dir) + ly * cos(this.dir)
    ]
}
