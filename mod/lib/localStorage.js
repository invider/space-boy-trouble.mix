function clearCache() {
    log('removing saved blueprints')

    if (typeof(Storage) === 'undefined') return
    try {
        window.localStorage.removeItem(env.cfg.storageKey)
    } catch(e) {
        log.err(e)
    }
}

function loadCache() {
    if (typeof(Storage) === 'undefined') return {}
    try {
        const cache = window.localStorage.getItem(env.cfg.storageKey)
        return JSON.parse(cache) || {}

    } catch (e) {
        log.err(e)
        return {}
    }
}

function saveCache(cache) {
    if (typeof(Storage) === 'undefined') return
    try {
        window.localStorage.setItem(env.cfg.storageKey, JSON.stringify(cache))

    } catch (e) {
        log.err(e)
    }
}

function saveDesign(blueprint) {
    log(`saving ${blueprint.name}...`)

    const cache = loadCache()
    if (!cache.blueprints) {
        cache.blueprints = {}
    }
    cache.blueprints[blueprint.name] = blueprint
    saveCache(cache)
}

function loadConfig() {
    const cache = loadCache()
    if (cache.config) {
        log('loaded config:')
        log.dump(cache.config)
        extend(env.opt, cache.config)
    }
}

function saveConfig() {
    const opt = extend({}, env.opt)
    const cache = loadCache()
    cache.config = opt
    saveCache(cache)
}
