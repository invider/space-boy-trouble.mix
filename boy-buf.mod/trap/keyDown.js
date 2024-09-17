
function handleControl(e) {
    switch(e.code) {
        case 'Minus':
            _$.env.tune.scale *= (1 - _$.env.tune.scaleFactor)
            break

        case 'Equal':
            _$.env.tune.scale *= (1 + _$.env.tune.scaleFactor)
            break

        case 'Escape':
            // TODO reset the game?
            break
        case 'F8':
            _$.lib.img.screenshot('enceladus-dockyards')
            break
    }
}

function keyDown(e) {

    const action = env.bind.keyMap[e.code]

    if (action) {
        lab.control.player.act(action.id, 0)
    } else {
        handleControl(e)
    }
}
