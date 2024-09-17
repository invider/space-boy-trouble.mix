function init() {
    // name MUST be removed to avoid augmentation collision
    delete this.name
}

function show() {
    this.hidden = false
    lab.control.player.bindAll(this)
}

function hide() {
    this.hidden = true
}
