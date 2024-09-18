const DEFAULT = 'default'

function rgbComponents(c) {
    if (c.startsWith('#')) c = c.substring(1)
    const r = parseInt(c.substring(0, 2), 16)
    const g = parseInt(c.substring(2, 4), 16)
    const b = parseInt(c.substring(4, 6), 16)
    return [r, g, b]
}

function splitPaletteToComponents(p) {
    return Object.values(p).map((c) => rgbComponents(c))
}

function matchRGB(source, i, rgb) {
    return (
        source[i] === rgb[0]
        && source[i+1] === rgb[1]
        && source[i+2] === rgb[2]
    )
}

function setRGB(source, i, rgb) {
    source[i] = rgb[0]
    source[i+1] = rgb[1]
    source[i+2] = rgb[2]
}

function mapColors(img, sourcePalette, targetPalette) {
    const canvas = document.createElement('canvas')
    const c = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    c.drawImage(img, 0, 0)

    const idata = c.getImageData(0, 0, img.width, img.height)
    const d = idata.data

    for (let i = 0; i < d.length; i += 4) {
        sourcePalette.forEach((sRGB, j) => {
            const tRGB = targetPalette[j]
            if (matchRGB(d, i, sRGB)) {
                setRGB(d, i, tRGB)
            }
        })
    }

    c.putImageData(idata, 0, 0)
    const fixedImage = new Image()
    fixedImage.src = canvas.toDataURL()
    return fixedImage
}

function remap() {
    const original = env.style.color
    const originalRGB = splitPaletteToComponents(original)

    const theme = {}
    const titles = {}
    res.attach(theme, 'theme')
    res.attach(titles, 'titles')

    Object.entries(env.style.palette).forEach(([palName, pal]) => {
        const palRGB = splitPaletteToComponents(pal)
        theme[palName] = ( mapColors(res.pods.img, originalRGB, palRGB) )
        titles[palName] = ( mapColors(res.title, originalRGB, palRGB) )
    })
    // include original color set to available styles
    env.style.palette[DEFAULT] = original
    res.theme[DEFAULT] = res.pods.img
    res.titles[DEFAULT] = res.title

    setTheme(env.opt.theme || DEFAULT)
}

function setTheme(name) {
    const color = env.style.palette[name]
    const tiles = res.theme[name]
    const title = res.titles[name]
    if (!color || !tiles) throw `can't find theme [${name}]`

    res.title = title
    res.pods.img = tiles
    env.style.color = color
    env.style.theme = name
    env.opt.theme = name

    lab.applyAll((node) => {
        if (node.syncTheme) node.syncTheme()
    })
}
