/*
 * Menu Widget
 *
 * Use as a separate screen or in combination with other widgets.
 *
 * Create with *items* array or use _selectFrom(st)_ to define the items and event hooks:
 *
 * ```
 *  items: [
 *      // simple items
 *      'Simple Item',
 *      'Another Simple Item',
 *      // section item - visible, but not selectable
 *      { section: true, title: 'Section One'},
 *      // switch item
 *      ['from', 'list', 'selection'],
 *
 *      // another section
 *      { section: true, title: 'Another Section'}, 
 *      // option item
 *      {
 *          option: true,
 *          title: 'music',
 *          options: ['on', 'off', 'random'],
 *          sync: function() {
 *              console.dir(this)
 *              log('syncing music to: ' + this.options[this.current])
 *          },
 *      },
 *      // complex section
 *      { section: true, title: 'Complex Section'}, 
 *      // complex item
 *      {
 *          title: 'Complex Item',
 *          onSelect: function() {
 *              log('complex item is selected!')
 *          },
 *      },
 *      // complex hidden item
 *      {
 *          hidden: true,
 *          title: 'Hidden Item',
 *      },
 *      // complex disabled item
 *      {
 *          disabled: true,
 *          title: 'A Disabled Item',
 *      },
 *      'The Last Item',
 *
 *  ],
 * ```
 */
const ACTIVE = 1
const DISABLED = 0

const df = {
    x:       0,
    y:       0,
    w:       80,
    h:       40,
    border:  2,
    step:    10,
    gap:     2,
    padding: 1,
    IDLE:    20,

    current: 0,
}

class Menu {

    constructor(st) {
        this.syncTheme()
        extend(this, df, st)
        this.selectFrom()
    }

    // TODO get config from the current game boy
    syncTheme() {
        // need to setup manually,
        // since colors are not available on df{} creation
        this.background = env.style.color.c1
        this.color = {
            main: env.style.color.c3, 
            bcolor: env.style.color.c0, 
            scolor: env.style.color.c2,
            acolor: env.style.color.c0, 
            dcolor: env.style.color.c1,
            bacolor: env.style.color.c3, 
        }
    }

    isComplexItem(item) {
        return (isObj(item))
    }

    isSection(item) {
        return (this.isComplexItem(item) && item.section)
    }

    isOption(item) {
        return (this.isComplexItem(item) && item.option)
    }

    isSwitch(item) {
        return isArray(item)
    }

    itemTitle(item) {
        if (isString(item)) return item
        if (this.isSwitch(item)) return item.title || ''
        if (this.isOption(item) || this.isComplexItem(item)) return item.title
        return ''
    }

    show() {
        this.hidden = false
        this.state = ACTIVE
        this.lastTouch = Date.now()
        //lab.control.player.bindAll(this)
    }

    hide() {
        this.hidden = true
        this.state = DISABLED
        //lab.control.controller.unbindAll(this)
    }

    selectFrom(st) {
        extend(this, st)
        if (!this.preservePos) this.current = 0

        this.items.forEach(item => {
            if (this.isSwitch(item) || this.isOption(item)) {
                if (!item.current) item.current = 0
                if (item.load) item.load()
            }
        })

        this.slideToActiveItem()
        this.show()
    }

    slideToActiveItem() {
        const item = this.items[this.current]
        if (isObj(item) && item.section) {
            this.current ++
            if (this.current >= this.items.length) this.current = 0
            this.slideToActiveItem()
        }
    }

    next() {
        if (this.hidden) return
        this.current ++
        if (this.current >= this.items.length) this.current = 0

        const item = this.items[this.current]
        if (this.isSection() || item.disabled || item.hidden) {
            this.next()
        } else {
            // landed
            if (this.onMove) this.onMove(item, this.current)
            //sfx.play('select', env.mixer.level.select)
        }
        
    }

    prev() {
        if (this.hidden) return
        this.current --
        if (this.current < 0) this.current = this.items.length - 1

        const item = this.items[this.current]
        if (this.isSection() || item.disabled || item.hidden) {
            this.prev()
        } else {
            // landed
            if (this.onMove) this.onMove(item, this.current)
            //sfx.play('select', env.mixer.level.select)
        }
    }

    left() {
        if (this.hidden) return
        const item = this.currentItem()
        if (this.isSwitch(item)) {
            item.current --
            if (item.current < 0) item.current = item.length - 1
            if (this.onSwitch) this.onSwitch(item, this.current)
            if (item.sync) item.sync()
            //sfx.play('apply', env.mixer.level.switch)
        } else if (this.isOption(item)) {
            item.current --
            if (item.current < 0) item.current = item.options.length - 1
            if (this.onSwitch) this.onSwitch(item, this.current)
            if (item.sync) item.sync()
            //sfx.play('apply', env.mixer.level.switch)
        }
        if (this.onMove) this.onMove(item, this.current)
    }

    right() {
        if (this.hidden) return
        const item = this.currentItem()
        if (this.isSwitch(item)) {
            item.current ++
            if (item.current >= item.length) item.current = 0
            if (this.onSwitch) this.onSwitch(item, this.current)
            if (item.sync) item.sync()
            //sfx.play('apply', env.mixer.level.switch)
        } else if (this.isOption(item)) {
            item.current ++
            if (item.current >= item.options.length) item.current = 0
            if (this.onSwitch) this.onSwitch(item, this.current)
            if (item.sync) item.sync()
            //sfx.play('apply', env.mixer.level.switch)
        }
        if (this.onMove) this.onMove(item, this.current)
    }

    select() {
        const item = this.currentItem()
        if (this.isSwitch(item) || this.isOption(item)) {
            this.right()
        } else {
            if (item.onSelect) {
                item.onSelect(this)
            } else if (this.onSelect) {
                this.onSelect(item, this.current)
                //sfx.play('use', env.mixer.level.apply)
            }
        }
    }

    back() {
        if (this.onBack) {
            this.onBack( this.currentItem() )
        }
        //sfx.play('noisy', env.mixer.level.apply)
    }

    activate(action) {
        this.lastTouch = Date.now()
        switch(action) {
            case 1: this.prev(); break;
            case 2: this.left(); break;
            case 3: this.next(); break;
            case 4: this.right(); break;
            case 5: this.select(); break;
            case 6: this.back(); break;
        }
    }

    focusOn(name) {
        const i = this.items.indexOf(name)
        if (i >= 0) this.current = i
    }

    draw() {
        if (!this.items) return
        const ctx = this.ctx
        const N = this.items.length
        const border = this.border
        const centerX = floor(this.x)
        const centerY = floor(this.y)
        const originX = floor(this.x - this.w * .5)
        const w = this.w
        const h = this.h = N * this.step + 2*border - this.gap
        const originY = floor(centerY - h * .5)

        let by = originY + border

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = env.style.font

        if (this.showBackground) {
            ctx.fillStyle = this.background
            ctx.fillRect(originX, originY, w, h)
        }

        for (let i = 0; i < N; i++) {
            let hidden = false
            let active = true
            let disabled = false
            let item = this.items[i]
            let title = item
            if (this.isSwitch(item)) {
                // selection item
                hidden = !!item.hidden
                disabled = !!item.disabled
                title = '< ' + item[item.current] + ' >'
            } else if (this.isSection(item)) {
                active = false
                title = item.title
            } else if (this.isOption(item)) {
                title = item.title + ': ' + item.options[item.current]
            } else if (this.isComplexItem(item)) {
                hidden = !!item.hidden
                disabled = !!item.disabled
                title = item.title
            }

            if (!hidden) {
                // select the frame style
                if (i === this.current) ctx.fillStyle = this.color.bacolor
                else ctx.fillStyle = this.color.bcolor
                // item frame
                ctx.fillRect(originX+border, by, w-2*border, this.step-this.gap - this.padding)

                // select the text style
                if (!active) ctx.fillStyle = this.color.scolor
                else if (disabled) ctx.fillStyle = this.color.dcolor
                else if (i === this.current) ctx.fillStyle = this.color.acolor
                else ctx.fillStyle = this.color.main
                // item text
                ctx.fillText(title, centerX, floor(by + (this.step - this.gap) * .5))

                by += this.step
            }
        }
    }

    currentItem() {
        return this.items[this.current]
    }

    selectedValue(i) {
        const item = this.items[i]
        if (isString(item)) return item
        else if (isArray(item)) {
            return item[item.current]
        }
    }

    evo(dt) {
        if (this.state === DISABLED) return

        const idle = (Date.now() - this.lastTouch)/1000
        if (this.onIdle && idle >= this.IDLE) {
            this.onIdle()
            this.lastTouch = Date.now()
        }
    }

}
