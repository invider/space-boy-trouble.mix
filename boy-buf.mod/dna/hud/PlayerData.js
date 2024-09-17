class PlayerData {

    constructor(st) {
        augment(this, st)
        this.color = env.style.color.c1
    }

    syncTheme() {
        this.color = env.style.color.c1
    }

    draw() {
        if (!this.player) return

        baseTop()
        alignRight()
        fill(this.color)
        font(env.style.font)

        const x = this.x
        const y = this.y
        text(this.player.title, x, y)

        let prefix = '$'
        let balance = this.player.balance
        if (balance < 0) {
            prefix = '-$'
            balance *= -1
        }
        text(prefix + balance, x, y+10)
    }

    setPlayer(player) {
        this.player = player
    }
}
