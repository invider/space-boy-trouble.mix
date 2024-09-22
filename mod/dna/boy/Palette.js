class Palette {

    constructor(st) {
        // TODO select a default or preconfigured palette
        this.setPalette(env.palette._ls[0])
        log('palette')
        console.dir(this.pal)
        console.dir(this.val)
    }

    setPalette(pal) {
        this.pal = pal
        this.val = lib.color.splitPaletteToComponents(pal)
    }

    toRGBA(icolor) {
        return this.pal[icolor % 4]
    }

    toColorArray(icolor) {
        return this.val[icolor % 4]
    }
}
