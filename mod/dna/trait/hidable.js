function init() {
    // [!] name MUST be removed to avoid augmentation collision
    delete this.name
}

function show() {
    this.hidden = false
    this.paused = false
}

function hide() {
    this.hidden = true
    this.paused = true
}
