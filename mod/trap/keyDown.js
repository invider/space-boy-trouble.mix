function handleControl(e) {
    switch(e.code) {
        case 'Minus':
            env.tune.scale *= (1 - _$.env.tune.scaleFactor)
            break

        case 'Equal':
            env.tune.scale *= (1 + _$.env.tune.scaleFactor)
            break

        case 'Escape':
            // TODO reset the game?
            break
        case 'F8':
            lib.img.screenshot(env.msg.screenshotTitle)
            break
    }
}

function keyDown(e) {

    const activation = env.bind.keyMap[e.code]

    if (activation) {
        lab.control.controller.act(activation.action, activation.controller)
    } else {
        handleControl(e)
    }
}
