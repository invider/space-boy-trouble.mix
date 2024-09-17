function keyUp(e) {
    const activation = env.bind.keyMap[e.code]
    if (activation) {
        lab.control.controller.stop(activation.action, activation.controller)
    }
}
