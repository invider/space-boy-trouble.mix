function setupGame() {
    lab.background = env.style.border
    lib.util.hideCursor()

    // DEBUG lets create a sample gameboy
    lab.spawn(dna.boy.GameBoy, {})

    lab.touch('space')

    // fade from the bootloader
    lab.vfx.transit({
        fadein:  env.style.bootFader.in,
        keep:    env.style.bootFader.keep,
        fadeout: env.style.bootFader.out,
    })
}
setupGame.Z = 11
