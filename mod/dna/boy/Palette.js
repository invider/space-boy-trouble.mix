class Palette {

    constructor(st) {
        // TODO select a default or preconfigured palette
        this.pal = env.palette._ls[0]   
        log('palette')
        console.dir(this.pal)
    }

    toRGBA(icolor) {
        return this.pal[icolor % 4]
    }
}
