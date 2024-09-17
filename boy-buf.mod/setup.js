module.exports = function() {
    lib.debug.configure()
    lib.util.loadConfig()

    // patches
    _$.boy = _ // set the gameboy mix shortcut ??? We want to have multiple gameboys
    $.sys.cp('/res', '/space-boy/res')

    // res.pods.drawImage = image

    //lib.remap.sfx() // TODO refactor to WebAudio API

    //lib.remap.tiles.remap()
    //lib.pods.populate()
    
    //lib.gen.screen()
    //lib.util.hideCursor()

    lab.screen.hideAll()

    /*
    if (!lib.debug.hyperjump()) {
        lab.vfx.transit({
            fadeIn: 0,
            keep: env.style.holdBeforeStart,
            onFadeOut: function() {
                lab.screen.show()
                trap('start')
            },
            fadeOut: env.style.fadeOut,
        })
    }
    */
}
