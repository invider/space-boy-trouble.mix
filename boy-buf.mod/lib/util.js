function hideCursor() {
    document.body.style.cursor = "none"
}

function downloadJSON(json) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json))
    const link = document.createElement('a')
    link.setAttribute('href', dataStr)
    link.setAttribute('download', json.name + '.json')
    link.click()
}

function loadFile(file) {
    lab.screen.layout.control.lock()
	let input = file.target

	let reader = new FileReader()
	reader.onload = function(){
        const json = JSON.parse(reader.result)
        trap('upload', json)
	};
	reader.readAsText(input.files[0]);
}

function uploadJSON() {
    lab.control.player.stopAll()
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'text/bas')
    input.setAttribute('onchange', "$.mod['boy-buf'].lib.util.loadFile(event)")
    input.click()
}

function clearCache() {
    log('removing saved blueprints')

    if (typeof(Storage) === 'undefined') return
    try {
        window.localStorage.removeItem(env.cfg.storage)
    } catch(e) {
        log.err(e)
    }
}

function loadCache() {
    if (typeof(Storage) === 'undefined') return {}
    try {
        const cache = window.localStorage.getItem(env.cfg.storage)
        return JSON.parse(cache) || {}

    } catch (e) {
        log.err(e)
        return {}
    }
}

function saveCache(cache) {
    if (typeof(Storage) === 'undefined') return
    try {
        window.localStorage.setItem(env.cfg.storage, JSON.stringify(cache))

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
