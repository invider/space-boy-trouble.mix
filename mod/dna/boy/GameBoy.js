let id = 0

class GameBoy extends LabFrame {

    constructor(st) {
        super( extend({
            name: 'gameboy' + (++id),
            pal: new dna.boy.Palette(),
            framebuffer: document.createElement('canvas'),
            pixelbuffer: document.createElement('canvas'),
            fw: env.cfg.width,
            fh: env.cfg.height,
            itheme: 0,
        }, st) )

        this.framebuffer.width  = this.fw
        this.framebuffer.height = this.fh 
        this.pixelbuffer.width  = this.fw
        this.pixelbuffer.height = this.fh

        //this.ctx = this.framebuffer.getContext('2d', { alpha: false })
        const ctx = this.ctx = this.framebuffer.getContext('2d')
        this.pctx = this.pixelbuffer.getContext('2d', {
            willReadFrequently: true,
        })
        //this.ctx.width = env.cfg.width
        //this.ctx.height = env.cfg.height
        this.tileset = res.tiles.clone()
        this.tileset.drawImage = function() {
            ctx.drawImage.apply(ctx, arguments)
        }
    }

    init() {
        this.touch('screen', {
            onAttached: function(e) {
                e.$   = this.$
                e.ctx = this.ctx
                supplement(e, dna.trait.hidable)
            }
        })
        this.spawn(dna.boy.ScreenController)

        this.screen.spawn(dna.screen.Title, {
            name: 'mainTitle',

            draw: function() {
                this.ctx.fillStyle = this.$.pal.toRGBA(1)
                this.ctx.fillRect(16, 16, 32, 32)

                this.ctx.font = env.style.font
                //this.ctx.font = env.style.titleFont
                this.ctx.textAlign = 'left'
                this.ctx.textBaseline = 'top'

                this.ctx.fillStyle = this.$.pal.toRGBA(2)
                this.ctx.fillText('Space Boy is in Trouble!', 30, 20)
            },

            activate(action) {
                log('#' + action)
                this.$.screenController.show('secondTitle')
            },
        })

        this.screen.spawn(dna.screen.Title, {
            name: 'secondTitle',

            draw: function() {
                this.ctx.font = env.style.font
                //this.ctx.font = env.style.titleFont
                this.ctx.textAlign = 'left'
                this.ctx.textBaseline = 'top'

                this.ctx.fillStyle = this.$.pal.toRGBA(2)
                this.ctx.fillText('The Second Message', 0, 0)
            },

            activate(action) {
                log('#' + action)
                this.$.screenController.show('roll')
            },
        })

        this.screen.spawn(dna.screen.Roll, {
            name: 'roll',
            icolor: 2,
            text: $.todo,
            activate(action) {
                log('#' + action)
                this.$.screenController.show('menu')
            },
        })

        this.screen.spawn(dna.hud.Menu, {
            name: 'menu',
            showBackground: false,
            x:   env.cfg.width  * .5,
            y:   env.cfg.height * .5,
            w:   env.cfg.width  * .75,
            items: [
                // simple items
                {
                    title: 'new game',
                    onSelect: function(menu) {
                        console.dir(menu)
                        trap('newGame')
                        menu.$.screenController.show('port')
                    },
                },
                'options',
                { section: true, title: 'LINK'},
                // option item
                {
                    option: true,
                    title: 'linked',
                    options: ['1', '2', '3', '4'],
                    sync: function() {
                        console.dir(this)
                        log('switching layout to: #' + this.options[this.current])
                    },
                },
            ],
        })

        this.port = this.screen.spawn(dna.space.Camera)

        this.screenController.hideAll()
        this.screenController.show('roll')
    }

    onAttached(e) {
        e.$   = this
        e.ctx = this.ctx
    }

    draw() {
        // fill the framebuffer with background color
        this.ctx.fillStyle = this.pal.toRGBA(0)
        this.ctx.fillRect(0, 0, this.fw, this.fh)
        // clear the pixelbuffer
        this.pctx.clearRect(0, 0, this.fw, this.fh)
        this.pdata = this.pctx.getImageData(0, 0, this.fw, this.fh)
        // draw to the framebuffer & pixelbuffer
        super.draw()

        // TODO post-drawing vfx like transitions etc...
        // ...

        // render the framebuffer and the pixelbuffer on top of it
        // TODO introduce alpha value to place with the gameboy screen fade in/out effects
        const w = this.fw * env.tune.scale // TODO get the scaling from the layout controller
        const h = this.fh * env.tune.scale
        const x = (ctx.width  - w) * .5
        const y = (ctx.height - h) * .5
        blocky()
        image(this.framebuffer, x, y, w, h)

        let py = 16
        for (let px = 0; px < 160; px ++) {
            const sh = (py * 160 + px) * 4
            this.pdata.data[sh]   = 255
            this.pdata.data[sh+1] = 255
            this.pdata.data[sh+2] = 255
            this.pdata.data[sh+3] = 255
        }

        this.pctx.putImageData(this.pdata, 0, 0)
        image(this.pixelbuffer, x, y, w, h)
    }
}
