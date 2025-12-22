function hideAll() {

    lab.screen.apply(e => {
        if (isFun(e.hide)) {
            e.hide()
        } else {
            e.hidden = true
        }
    })
}
