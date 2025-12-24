/**
 * Complete Keymap for Casio fx-991ES PLUS
 * Maps every physical button to its functions
 */

const KEYMAP = [
    // Row 1: SHIFT, ALPHA, Directional Pad, MODE, SETUP, ON
    [
        { id: 'shift', primary: 'SHIFT', shift: null, alpha: null, action: 'toggle_shift', type: 'control', cssClass: 'key-shift' },
        { id: 'alpha', primary: 'ALPHA', shift: null, alpha: null, action: 'toggle_alpha', type: 'control', cssClass: 'key-alpha' },
        { id: 'dpad', primary: '⬆⬇⬅➡', shift: null, alpha: null, action: 'dpad', type: 'control', cssClass: 'key-function' },
        { id: 'mode', primary: 'MODE', shift: 'SETUP', alpha: null, action: 'mode', type: 'mode', cssClass: 'key-function' },
        { id: 'on', primary: 'ON', shift: null, alpha: null, action: 'on', type: 'control', cssClass: 'key-function' }
    ],
    
    // Row 2: CALC, fraction, x³, x⁻¹, log
    [
        { id: 'calc', primary: 'CALC', shift: 'SOLVE', alpha: null, action: 'calc', type: 'special', cssClass: 'key-dark' },
        { id: 'frac', primary: '⎕/⎕', shift: '∛', alpha: null, action: 'fraction', type: 'special', cssClass: 'key-dark' },
        { id: 'cube', primary: 'x³', shift: 'DEC', alpha: null, action: 'cube', type: 'special', cssClass: 'key-dark' },
        { id: 'reciprocal', primary: 'x⁻¹', shift: '∜', alpha: 'HEX', action: 'reciprocal', type: 'special', cssClass: 'key-dark' },
        { id: 'log', primary: 'log', shift: '10ˣ', alpha: 'BIN', action: 'log', type: 'function', cssClass: 'key-dark' }
    ],
    
    // Row 3: Division, Square Root, x², Power, ln
    [
        { id: 'divide', primary: '÷', shift: '⌇', alpha: null, action: 'divide', type: 'operator', cssClass: 'key-dark' },
        { id: 'sqrt', primary: '√', shift: '√n', alpha: null, action: 'sqrt', type: 'special', cssClass: 'key-dark' },
        { id: 'square', primary: 'x²', shift: null, alpha: null, action: 'square', type: 'special', cssClass: 'key-dark' },
        { id: 'power', primary: 'xʸ', shift: null, alpha: 'OCT', action: 'power', type: 'special', cssClass: 'key-dark' },
        { id: 'ln', primary: 'ln', shift: 'eˣ', alpha: null, action: 'ln', type: 'function', cssClass: 'key-dark' }
    ],
    
    // Row 4: (-), 0,,,, hyp, sin, cos, tan
    [
        { id: 'neg', primary: '(−)', shift: '∠', alpha: 'A', action: 'negative', type: 'special', cssClass: 'key-dark' },
        { id: 'comma', primary: '∘,,,', shift: '←', alpha: 'B', action: 'comma', type: 'input', cssClass: 'key-dark' },
        { id: 'hyp', primary: 'hyp', shift: 'Abs', alpha: 'C', action: 'hyp', type: 'modifier', cssClass: 'key-dark' },
        { id: 'sin', primary: 'sin', shift: 'sin⁻¹', alpha: 'D', action: 'sin', type: 'function', cssClass: 'key-dark' },
        { id: 'cos', primary: 'cos', shift: 'cos⁻¹', alpha: 'E', action: 'cos', type: 'function', cssClass: 'key-dark' },
        { id: 'tan', primary: 'tan', shift: 'tan⁻¹', alpha: 'F', action: 'tan', type: 'function', cssClass: 'key-dark' }
    ],
    
    // Row 5: RCL, ENG, (, ), S⇔D, M+
    [
        { id: 'rcl', primary: 'RCL', shift: 'STO', alpha: null, action: 'rcl', type: 'function', cssClass: 'key-dark' },
        { id: 'eng', primary: 'ENG', shift: '←', alpha: 'i', action: 'eng', type: 'function', cssClass: 'key-dark' },
        { id: 'lparen', primary: '(', shift: '%', alpha: null, action: 'lparen', type: 'input', cssClass: 'key-dark' },
        { id: 'rparen', primary: ')', shift: ',', alpha: 'X', action: 'rparen', type: 'input', cssClass: 'key-dark' },
        { id: 'sd', primary: 'S⇔D', shift: '÷', alpha: 'Y', action: 'sd', type: 'special', cssClass: 'key-dark' },
        { id: 'mplus', primary: 'M+', shift: 'M−', alpha: 'M', action: 'mplus', type: 'function', cssClass: 'key-dark' }
    ],
    
    // Row 6: 7, 8, 9, DEL, AC
    [
        { id: 'num7', primary: '7', shift: 'CONST', alpha: null, action: 'input_7', type: 'input', cssClass: 'key-light' },
        { id: 'num8', primary: '8', shift: 'CONV', alpha: null, action: 'input_8', type: 'input', cssClass: 'key-light' },
        { id: 'num9', primary: '9', shift: 'CLR', alpha: null, action: 'input_9', type: 'input', cssClass: 'key-light' },
        { id: 'del', primary: 'DEL', shift: 'INS', alpha: null, action: 'delete', type: 'control', cssClass: 'key-green' },
        { id: 'ac', primary: 'AC', shift: 'OFF', alpha: null, action: 'clear', type: 'control', cssClass: 'key-green' }
    ],
    
    // Row 7: 4, 5, 6, ×, ÷
    [
        { id: 'num4', primary: '4', shift: 'MATRIX', alpha: null, action: 'input_4', type: 'input', cssClass: 'key-light' },
        { id: 'num5', primary: '5', shift: 'VECTOR', alpha: null, action: 'input_5', type: 'input', cssClass: 'key-light' },
        { id: 'num6', primary: '6', shift: null, alpha: null, action: 'input_6', type: 'input', cssClass: 'key-light' },
        { id: 'multiply', primary: '×', shift: 'nPr', alpha: null, action: 'multiply', type: 'operator', cssClass: 'key-light' },
        { id: 'div2', primary: '÷', shift: 'nCr', alpha: null, action: 'divide', type: 'operator', cssClass: 'key-light' }
    ],
    
    // Row 8: 1, 2, 3, +, −
    [
        { id: 'num1', primary: '1', shift: 'STAT', alpha: null, action: 'input_1', type: 'input', cssClass: 'key-light' },
        { id: 'num2', primary: '2', shift: 'CMPLX', alpha: null, action: 'input_2', type: 'input', cssClass: 'key-light' },
        { id: 'num3', primary: '3', shift: 'BASE', alpha: null, action: 'input_3', type: 'input', cssClass: 'key-light' },
        { id: 'plus', primary: '+', shift: 'Pol', alpha: null, action: 'plus', type: 'operator', cssClass: 'key-light' },
        { id: 'minus', primary: '−', shift: 'Rec', alpha: null, action: 'minus', type: 'operator', cssClass: 'key-light' }
    ],
    
    // Row 9: 0, ., ×10ˣ, Ans, =
    [
        { id: 'num0', primary: '0', shift: 'Rnd', alpha: null, action: 'input_0', type: 'input', cssClass: 'key-light' },
        { id: 'dot', primary: '•', shift: 'Ran#', alpha: null, action: 'dot', type: 'input', cssClass: 'key-light' },
        { id: 'exp', primary: '×10ˣ', shift: 'Ran#', alpha: 'π', action: 'exp10', type: 'function', cssClass: 'key-light' },
        { id: 'ans', primary: 'Ans', shift: 'DRG▶', alpha: 'e', action: 'ans', type: 'function', cssClass: 'key-light' },
        { id: 'equals', primary: '=', shift: '%', alpha: null, action: 'equals', type: 'control', cssClass: 'key-light' }
    ]
];

// Helper function to get key by id
function getKeyById(id) {
    for (let row of KEYMAP) {
        for (let key of row) {
            if (key.id === id) return key;
        }
    }
    return null;
}

// Export for global access
window.KEYMAP = KEYMAP;
window.getKeyById = getKeyById;
