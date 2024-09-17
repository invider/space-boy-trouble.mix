let id = 0

class GameBoy extends LabFrame {

    constructor(st) {
        super( extend({
            name: 'gameboy' + (++id),
            framebuffer: document.createElement('canvas'),
            fw: env.cfg.width,
            fh: env.cfg.height,
            itheme: 0,
        }, st) )

        this.framebuffer.width = this.fw
        this.framebuffer.height = this.fh 

        //this.ctx = this.framebuffer.getContext('2d', { alpha: false })
        this.ctx = this.framebuffer.getContext('2d')
        //this.ctx.width = env.cfg.width
        //this.ctx.height = env.cfg.height
    }

    init() {
        this.touch('screen', {
            onAttached: function(e) {
                e.ctx = this.ctx
            }
        })
        this.screen.spawn(dna.screen.Title, {
            name: 'mainTitle',

            draw: function() {
                this.ctx.fillStyle = env.style.color.c1
                this.ctx.fillRect(16, 16, 32, 32)

                this.ctx.font = env.style.font
                //this.ctx.font = env.style.titleFont
                this.ctx.textAlign = 'left'
                this.ctx.textBaseline = 'middle'

                this.ctx.fillStyle = env.style.color.c2
                this.ctx.fillText('Space Boy is in Trouble!', 30, 20)
            }
        })
    }

    onAttached(e) {
        e.ctx = this.ctx
    }

    toRGBA(icolor) {
    }

    draw() {
        // this.ctx.clearRect(0, 0, this.fw, this.fh)
        this.ctx.fillStyle = env.style.color.c0
        this.ctx.fillRect(0, 0, this.fw, this.fh)

        // draw to the framebuffer
        super.draw()

        // TODO post-drawing vfx like transitions etc...
        // ...

        // render the framebuffer
        // TODO introduce alpha value to place with the gameboy screen fade in/out effects
        const w = this.fw * env.tune.scale // TODO get the scaling from the layout controller
        const h = this.fh * env.tune.scale
        const hb = (ctx.width - w) * .5
        const vb = (ctx.height - h) * .5
        blocky()
        image(this.framebuffer, hb, vb, w, h)
    }
}
