function init() {
    this.state = 4
    this.alpha = 1
}

function itransit(fn, delay) {
    delay = delay || 0
    setTimeout(() => {
        lab.vfx.transit({
            fadeIn: env.style.fadeIn,
            keep: env.style.keep,
            onFadeOut: fn,
            fadeOut: env.style.fadeOut,
        })
    }, delay)
}

function transit(st) {
    this.onFadeIn = st.onFadeIn || null
    this.fadeIn = st.fadeIn || 0
    this.onKeep = st.onKeep || null
    this.keep = st.keep || 0
    this.onFadeOut = st.onFadeOut || null
    this.fadeOut = st.fadeOut || 0
    this.onComplete = st.onComplete || null
    this.background = st.background || env.style.color.c0

    this.state = 1
    this.tspeed = (1 - this.alpha)/st.fadeIn
    if (this.onFadeIn) this.onFadeIn()
}

function evo(dt) {
    switch(this.state) {
        case 1:
            this.fadeIn -= dt
            this.alpha = min(this.alpha + this.tspeed*dt, 1)
            if (this.fadeIn < 0) {
                this.state = 2
                this.alpha = 1
                if (this.onKeep) this.onKeep()
            }
            break

        case 2:
            this.keep -= dt
            if (this.keep < 0) {
                this.state = 3
                this.tspeed = 1/this.fadeOut
                if (this.onFadeOut) this.onFadeOut()
            }
            break

        case 3:
            this.fadeOut -= dt
            this.alpha = max(this.alpha - this.tspeed*dt, 0)
            if (this.fadeOut < 0) {
                this.state = 4
                if (this.onComplete) this.onComplete()
            }
            break
    }
}


// rendering preprocessing
function preVFX() {
}

// rendering postprocessing
function postVFX() {
    if (!this.background || this.state > 3) return
    if (this.alpha > 0) {
        save()
        alpha(this.alpha)
        background(this.background)
        restore()
    }
}
