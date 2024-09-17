function newGame(st) {
    const playerA = lab.spawn(dna.Player, {
        name: 'playerA',
        title: 'Player A',
        human: st.playerA.human,
        hybrid: st.playerA.hybrid,
        balance: st.playerA.budget,
    })
    const playerB = lab.spawn(dna.Player, {
        name: 'playerB',
        title: 'Player B',
        human: st.playerB.human,
        hybrid: st.playerB.hybrid,
        balance: st.playerB.budget,
    })
    playerB.prev = playerA
    playerA.next = playerB

    trap('layout', playerA)
}
