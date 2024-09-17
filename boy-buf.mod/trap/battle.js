function battle(lastPlayer) {
    lab.screen.battle.show()

    const playerA = lastPlayer.prev
    const playerB = lastPlayer
    lab.screen.battle.control.startBattle(playerA, playerB)
}
