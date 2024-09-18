const palette = {
    kirokaze: [
        // default
        '#332c50',
        '#46878f',
        '#94e344',
        '#e2f3e4',
    ],
    sand: [
        '#393829',
        '#7b7162',
        '#b4a56a',
        '#e6d69c',
    ],
    blue: [
        '#102533',
        '#42678e',
        '#6f9edf',
        '#cecece',
    ],
    cga0: [
        '#000000',
        '#55ff55',
        '#ff5555',
        '#ffff55',
    ],
    cga1: [
        '#000000',
        '#ff55ff',
        '#55ffff',
        '#ffffff',
    ],
    sweet: [
        '#253b46',
        '#18865f',
        '#61d162',
        '#ebe7ad',
    ],

    // jb4 for JetBoy
    jet: [
        '#260016',
        '#00bff3',
        '#ed008c',
        '#daf3ec',
    ],
    boy: [
        '#2a3d22',
        '#597842',
        '#6a9c44',
        '#a8cc45',
    ],

    // pokemon palette
    purple: [
        '#181010',
        '#84739c',
        '#f7b58c',
        '#ffefff',
    ],
    vapor: [
        '#521296',
        '#8a1fac',
        '#d4864a',
        '#ebdb5e',
    ],
    aqu4: [
        '#002b59',
        '#005f8c',
        '#00b9be',
        '#9ff4e5',
    ],
    amber: [
        '#0d0405',
        '#6e2220',
        '#d35600',
        '#fed018',
    ],
    astro: [
        '#1f084d',
        '#3d4466',
        '#24b3b3',
        '#e2e6cf',
    ],
}
palette.kirokaze.default = true

palette._ls = Object.keys(palette).map(key => {
    const pal = palette[key]
    pal.name = key
    return pal
})
