function grid(src) {
    const layout = []
    layout.space = 0
    layout.shell = 0

    let y = 0
    src.split('\n').forEach(l => {
        l = l.trim()
        if (l.length === 0 || l.startsWith('#')) return

        if (l.startsWith('>')) {
            l = l.substring(1)
            const parts = l.split(':')
            const key = parts[0].trim()
            let val = parts[1] || true
            if (isString(val)) {
                val = val.trim()
                const ival = parseInt(val)
                if (!isNaN(ival)) val = ival
            }
            layout[key] = val

        } else {
            const row = []
            for (let x = 0; x < l.length; x++) {
                const c = l.charAt(x).toLowerCase()
                if (c === 'x') {
                    // external shell
                    row[x] = 1 
                    layout.space ++
                    layout.shell ++
                } else if (c === '*') {
                    // internal hull
                    row[x] = 2 
                    layout.space ++
                } else {
                    // the cell is outside of the hull
                    row[x] = 0
                }
            }
            layout[y++] = row
        }
    })

    return layout
}
