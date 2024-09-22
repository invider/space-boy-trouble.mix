const MAX_CONTROLLERS           = 8
const KEYBOARD_CONTROLLERS_BASE = 5

// control actions
const UP     = 1
const LEFT   = 2
const DOWN   = 3
const RIGHT  = 4
const A      = 5
const B      = 6
const X      = 7
const Y      = 8
const MENU   = 13
const SELECT = 14

// globally fixed keys with no remap
const fixed = {
    enter:          'Enter',
    escape:         'Escape',
    backspace:      'Backspace',
    startCheating:  'Backslash',
    pause:          'KeyP',

    //releaseAll:     'End',
    menu:           'Escape',
    zoomIn:         'Equal',
    zoomOut:        'Minus',
    autoZoom:       'Digit0',
    speedUp:        'BracketRight',
    slowDown:       'BracketLeft',
    speedNormal:    'Quote',
    rewind:         'Comma',
}

const actions = [
    'NONE',
    'UP',
    'LEFT',
    'DOWN',
    'RIGHT',
    'A',
    'B',
    'X',
    'Y',
    'MENU',
    'SELECT',
]
const keyboard = [
    [ 'KeyW', 'KeyA', 'KeyS', 'KeyD',
       'Comma', 'Period', 'KeyM', 'Slash',
        'KeyQ', 'KeyE'
    ],
    [ 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
        'KeyX', 'KeyZ', 'KeyC', 'ShiftLeft',
        'Delete', 'End',
    ],
    [ 'KeyK', 'KeyH', 'KeyJ', 'KeyL',
        'KeyN', 'KeyB', 'KeyG', 'KeyV',
        'KeyU', 'KeyI',
    ],
]

const keyMap = {}

const padMap = [
    [12, 14, 13, 15, 0, 1, 2, 3, 8],
    [12, 14, 13, 15, 0, 1, 2, 3, 8],
    [12, 14, 13, 15, 0, 1, 2, 3, 8],
    [12, 14, 13, 15, 0, 1, 2, 3, 8],
]

// cheating combos
const combos = {
    test:  [UP, UP, DOWN, DOWN],
    debug: [UP, DOWN, UP, DOWN, A],
}

function indexKeys() {
    for (let p = 0; p < keyboard.length; p++) {
        const keyActions = keyboard[p]
        for (let a = 0; a < keyActions.length; a++) {
            const key = keyActions[a]
            keyMap[key] = {
                action: a + 1,
                controller: p + KEYBOARD_CONTROLLERS_BASE,
            }
        }
    }
}

function action(i) {
    return actions[i] || ''
}

function pinActions() {
    actions.forEach( (action, i) => {
        _[action] = i
    })
}

function init() {
    indexKeys()
    pinActions()
}
