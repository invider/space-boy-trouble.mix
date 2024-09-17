const X = 'x'
const SHELL = 'shell'
const FREE = 'free'

class Blueprint {

    constructor(st) {
        augment(this, st)
        if (!this.layout) this.layout = dna.spec.layout.nova
        if (this.grid) this.cloneGrid()
        else this.fillGrid()
        if (!this.name) this.name = this.layout.name
        if (!this.cost) this.cost = this.layout.cost
        if (!this.layoutCost) this.layoutCost = this.layout.cost
        if (!this.hits) this.hits = 0
        if (!this.space) this.space = this.layout.space
        this.dirty = false
    }

    fillGrid() {
        const h = this.layout.length
        const w = this.layout[0].length
        const grid = []

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const type = this.layout[y][x]

                let cell = X
                if (type === 1) cell = SHELL
                else if (type === 2) cell = FREE
                grid[y*w + x] = cell
            }
        }
        this.w = w
        this.h = h
        this.grid = grid
    }

    cloneGrid() {
        const grid = this.grid.slice()
        this.grid = grid
    }

    estimateCost(priceFun) {
        if (priceFun) {
            // calculate and buffer the cost
            this.cost = this.layoutCost
            for (let y = 0; y < this.h; y++) {
                for (let x = 0; x < this.w; x++) {
                    this.cost += priceFun( this.podAt(x, y) )
                }
            }
        }
        return this.cost
    }

    estimateHits(hitsFun) {
        if (hitsFun) {
            // calculate and buffer the hits
            this.hits = 0
            for (let y = 0; y < this.h; y++) {
                for (let x = 0; x < this.w; x++) {
                    this.hits += hitsFun( this.podAt(x, y) )
                }
            }
        }
        return this.hits
    }

    freeSpace() {
        let free = 0
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                if (this.podAt(x, y) === 'free') free ++
            }
        }
        return free
    }

    randomFreeCell() {
        if (this.freeSpace() === 0) return
        let i = RND(this.grid.length - 1)
        let icell = -1
        while (i < this.grid.length && icell < 0) {
            if (this.grid[i] === FREE) icell = i
            i++
        }
        if (icell < 0) {
            i = 0
            while (i < this.grid.length && icell < 0) {
                if (this.grid[i] === FREE) icell = i
                i++
            }
        }
        if (icell >= 0) {
            return {
                x: icell % this.w,
                y: floor(icell / this.w),
            }
        }
    }

    freeAxisCell() {
        const x = floor(this.w/2)
        for (let y = this.h - 1; y >= 0; y--) {
            if (this.podAt(x, y) === FREE) return { x, y }
        }
    }

    getSpace() {
        return this.space
    }

    cellType(x, y) {
        if (!this.layout[y]) return 0
        return this.layout[y][x] || 0
    }

    cellAt(x, y) {
        const type = this.cellType(x, y)
        switch (type) {
            case 1: return SHELL;
            case 2: return FREE;
        }
        return X
    }

    podAt(x, y) {
        return (this.grid[y * this.w + x] || 'x')
    }

    placePod(x, y, pod, price) {
        if (x < 0 || x >= this.w) return
        if (y < 0 || y >= this.h) return
        const i = y * this.w + x
        if (this.grid[i] !== FREE) throw `![${pod}] placement failed`
            + ` - cell at ${x}:${y} is already occupied`
        this.grid[i] = pod
        this.cost += price
        this.dirty = true
    }

    removePod(x, y, priceFun) {
        if (x < 0 || x >= this.w) return
        if (y < 0 || y >= this.h) return
        const pod = (this.grid[y * this.w + x] || X)
        if (pod === X || pod === FREE || pod === SHELL) return

        const type = this.cellType(x, y)
        if (type === 0) return

        let cell = FREE
        if (type === 1) cell = SHELL

        const podName = this.grid[y * this.w + x]
        this.grid[y * this.w + x] = cell
        this.cost -= priceFun(podName)

        return pod
    }

    dump() {
        return {
            name: this.name,
            w: this.w,
            h: this.h,
            cost: this.cost,
            layout: this.layout,
            layoutCost: this.layoutCost,
            space: this.space,
            hits: this.hits,
            grid: this.grid,
        }
    }

    download() {
        lib.util.downloadJSON( this.dump() )
    }

    save() {
        lib.util.saveDesign( this.dump() )
    }
}
