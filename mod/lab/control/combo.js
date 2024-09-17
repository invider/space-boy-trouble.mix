const MAX_LEN = 8

const sequence = []

function matchCombo(combo) {
    if (sequence.length < combo.length) return false

    let j = sequence.length - 1
    for (let i = combo.length - 1; i >= 0; i--) {
        if (sequence[j--] !== combo[i]) return false
    }
    return true
}

function matchSequence() {
    for (let comboName of Object.keys(env.bind.combos)) {
        const combo = env.bind.combos[comboName]
        if (matchCombo(combo)) exec(comboName)
    }
}

function register(action, player) {
    if (!lab.port || lab.port.disabled) return
    sequence.push(action)
    if (sequence.length > MAX_LEN) sequence.shift(1)
    matchSequence()
}

function exec(comboName) {
    sequence.length = 0

    // locate the cheat/combo function
    const fn = $.cmd.cheat.selectOne(comboName)
    if (isFun(fn)) {
        log(`combo: [${comboName}]`)
        fn()
    } else {
        log(`unknown combo: [${comboName}]`)
    }
}
