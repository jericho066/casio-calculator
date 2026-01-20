/**
 * Input Controller
 * Handles all keyboard input, shift/alpha state, and input processing
 */

function initInputController() {
    console.log('🎮 Input Controller initialized');
    
    // Add keyboard event listeners for physical keyboard support
    document.addEventListener('keydown', handlePhysicalKeyboard);
    
    // Initialize shift/alpha visual state
    updateShiftAlphaVisuals();
}

/**
 * Main key press handler - called from domRenderer
 */
function handleKeyPress(keyId) {
    const state = window.calculatorState;
    const key = getKeyById(keyId);
    
    if (!key) {
        console.error('Key not found:', keyId);
        return;
    }
    
    console.log('📘 Key pressed:', keyId, '| Type:', key.type, '| Action:', key.action);
    
    // Route to appropriate handler based on key type
    switch (key.type) {
        case 'control':
            handleControlKey(key);
            break;
        case 'mode':
            handleModeKey(key);
            break;
        case 'modifier':
            handleModifierKey(key);
            break;
        case 'operator':
            handleOperatorKey(key);
            break;
        case 'function':
            handleFunctionKey(key);
            break;
        case 'special':
            handleSpecialKey(key);
            break;
        case 'input':
            handleInputKey(key);
            break;
        default:
            console.warn('Unknown key type:', key.type);
    }
    
    // Update display after each key press
    window.updateDisplay();
}

/**
 * Handle control keys (SHIFT, ALPHA, AC, DEL, ON, =)
 */
function handleControlKey(key) {
    const state = window.calculatorState;
    
    switch (key.action) {
        case 'toggle_shift':
            state.shift = !state.shift;
            if (state.shift) state.alpha = false;
            updateShiftAlphaVisuals();
            playKeySound('shift');
            break;
            
        case 'toggle_alpha':
            state.alpha = !state.alpha;
            if (state.alpha) state.shift = false;
            updateShiftAlphaVisuals();
            playKeySound('alpha');
            break;
            
        case 'clear':
            if (state.shift) {
                // SHIFT + AC = OFF (just clear for now)
                handleOff();
            } else {
                window.clearAll();
            }
            playKeySound('clear');
            break;
            
        case 'delete':
            if (state.shift) {
                // SHIFT + DEL = INS (insert mode - not implemented yet)
                console.log('INS not yet implemented');
            } else {
                window.deleteLastChar();
            }
            playKeySound('delete');
            break;
            
        case 'equals':
            handleEquals();
            playKeySound('equals');
            break;
            
        case 'on':
            handleOn();
            break;
            
        case 'dpad':
            handleDirectionalPad(key);  // ✅ Fixed typo
            break;
            
        default:
            console.warn('Unknown control action:', key.action);
    }
}

/**
 * Handle mode switching keys
 */
function handleModeKey(key) {
    const state = window.calculatorState;
    
    if (state.shift) {
        // SHIFT + MODE = SETUP
        openSetupMenu();
        state.shift = false;
    } else {
        openModeMenu();
    }
    
    updateShiftAlphaVisuals();
}

/**
 * Handle modifier keys (hyp)
 */
function handleModifierKey(key) {
    const state = window.calculatorState;
    
    if (key.action === 'hyp') {
        // Toggle hyperbolic mode (stored in state for next trig function)
        state.hypMode = !state.hypMode;
        console.log('Hyperbolic mode:', state.hypMode);
        // Visual feedback could be added here
    }
}

/**
 * Handle special operation keys (x², x³, x⁻¹, √, etc.)
 */
function handleSpecialKey(key) {
    const state = window.calculatorState;

    // Exit history browsing mode when user starts typing
    if (window.historyManager && window.historyManager.isBrowsing()) {
        window.historyManager.exitBrowsing();
    }
    
    let textToInsert = '';
    
    switch (key.action) {
        case 'square':
            applyUnaryOperation('^2', 'x²');
            state.shift = false;
            state.alpha = false;
            updateShiftAlphaVisuals();
            return;
            
        case 'cube':
            if (state.shift) {
                handleBaseConversion('DEC');
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            } else {
                applyUnaryOperation('^3', 'x³');
                state.shift = false;
                state.alpha = false;
                updateShiftAlphaVisuals();
                return;
            }
            
        case 'reciprocal':
            if (state.shift) {
                textToInsert = '∜(';
            } else if (state.alpha) {
                handleBaseConversion('HEX');
                state.shift = false;
                state.alpha = false;
                updateShiftAlphaVisuals();
                return;
            } else {
                applyUnaryOperation('^(-1)', 'x⁻¹');
                state.shift = false;
                state.alpha = false;
                updateShiftAlphaVisuals();
                return;
            }
            break;
            
        case 'sqrt':
            if (state.shift) {
                textToInsert = '√(';
            } else {
                textToInsert = 'sqrt(';
            }
            break;
            
        case 'power':
            if (state.alpha) {
                handleBaseConversion('OCT');
                state.shift = false;
                state.alpha = false;
                updateShiftAlphaVisuals();
                return;
            } else {
                textToInsert = '^(';
            }
            break;
            
        case 'fraction':
            if (state.shift) {
                textToInsert = '∛(';
            } else {
                textToInsert = '(';
            }
            break;
            
        case 'calc':
            if (state.shift) {
                handleSolve();
            } else {
                handleCalc();
            }
            state.shift = false;
            state.alpha = false;
            updateShiftAlphaVisuals();
            return;
            
        case 'negative':
            if (state.shift) {
                textToInsert = '∠';
            } else if (state.alpha) {
                textToInsert = 'A';
            } else {
                textToInsert = '(-';
            }
            break;
            
        case 'sd':
            if (state.shift) {
                textToInsert = '÷';
            } else if (state.alpha) {
                textToInsert = 'Y';
            } else {
                console.log('Sexagesimal conversion');
                state.shift = false;
                state.alpha = false;
                updateShiftAlphaVisuals();
                return;
            }
            break;
            
        default:
            console.warn('Unknown special action:', key.action);
            state.shift = false;
            state.alpha = false;
            updateShiftAlphaVisuals();
            return;
    }
    
    // Insert text at cursor position
    if (textToInsert) {
        state.inputBuffer = window.cursorManager.insertAt(textToInsert, state.inputBuffer);
        state.cursorPosition = window.cursorManager.getPosition();
    }
    
    state.shift = false;
    state.alpha = false;
    updateShiftAlphaVisuals();
}

/**
 * Apply unary operation to last number or Ans
 */
function applyUnaryOperation(operation, displaySymbol) {
    const state = window.calculatorState;
    
    if (!state.inputBuffer || state.inputBuffer.trim() === '') {
        if (state.lastAns !== null && state.lastAns !== undefined) {
            state.inputBuffer = window.cursorManager.insertAt(`Ans${operation}`, state.inputBuffer);
        } else {
            state.inputBuffer = window.cursorManager.insertAt(`${operation}`, state.inputBuffer);
        }
    } else {
        const lastChar = state.inputBuffer[state.inputBuffer.length - 1];
        
        if (/[0-9\)]/.test(lastChar)) {
            state.inputBuffer = window.cursorManager.insertAt(operation, state.inputBuffer);
        } else {
            state.inputBuffer = window.cursorManager.insertAt(`(${operation}`, state.inputBuffer);
        }
    }
    
    state.cursorPosition = window.cursorManager.getPosition();
}

/**
 * Handle base conversion display
 */
function handleBaseConversion(base) {
    console.log(`Switching to ${base} base`);
    window.modeManager.switchMode('BASE', base);
}

/**
 * Handle CALC function
 */
function handleCalc() {
    console.log('CALC function - for use with STAT/TABLE modes');
}

/**
 * Handle SOLVE function
 */
function handleSolve() {
    console.log('SOLVE function - equation solver');
}


/**
 * Handle operator keys (+, -, ×, ÷, ^)
 */
function handleOperatorKey(key) {
    const state = window.calculatorState;

    // Exit history browsing mode when user starts typing
    if (window.historyManager && window.historyManager.isBrowsing()) {
        window.historyManager.exitBrowsing();
    }
    
    let textToInsert = '';
    
    // Check for SHIFT functions on operator keys
    if (state.shift) {
        switch (key.id) {
            case 'multiply':
                textToInsert = 'nPr(';
                break;
            case 'div2':
                textToInsert = 'nCr(';
                break;
            case 'plus':
                textToInsert = 'Pol(';
                break;
            case 'minus':
                textToInsert = 'Rec(';
                break;
            default:
                textToInsert = getActiveLabel(key);
        }
    } else {
        textToInsert = getActiveLabel(key);
    }
    
    // Insert at cursor position
    state.inputBuffer = window.cursorManager.insertAt(textToInsert, state.inputBuffer);
    state.cursorPosition = window.cursorManager.getPosition();
    
    state.shift = false;
    state.alpha = false;
    state.displayTree = state.inputBuffer;
    updateShiftAlphaVisuals();
}

/**
 * Handle function keys (sin, cos, log, sqrt, etc.)
 */
function handleFunctionKey(key) {
    const state = window.calculatorState;

    // Exit history browsing mode when user starts typing
    if (window.historyManager && window.historyManager.isBrowsing()) {
        window.historyManager.exitBrowsing();
    }

    // Special handling for memory operations
    if (key.action === 'mplus') {
        handleMemoryPlus();
        return;
    }
    
    if (key.action === 'rcl') {
        if (state.shift) {
            handleStore();
        } else {
            handleRecall();
        }
        return;
    }

    let textToInsert = '';

    // Special handling for Ans
    if (key.action === 'ans') {
        if (state.shift) {
            console.log('DRG angle conversion');
            window.modeManager.toggleAngleUnit();
            state.shift = false;
            state.alpha = false;
            updateShiftAlphaVisuals();
            return;
        } else if (state.alpha) {
            textToInsert = 'e';
        } else {
            textToInsert = 'Ans';
        }
        
        state.inputBuffer = window.cursorManager.insertAt(textToInsert, state.inputBuffer);
        state.cursorPosition = window.cursorManager.getPosition();
        state.shift = false;
        state.alpha = false;
        updateShiftAlphaVisuals();
        return;
    }

    // Special handling for ENG and x10^x
    if (key.action === 'eng') {
        if (state.shift) {
            textToInsert = '←';
        } else {
            console.log('ENG notation toggle');
            state.shift = false;
            state.alpha = false;
            updateShiftAlphaVisuals();
            return;
        }
        
        state.inputBuffer = window.cursorManager.insertAt(textToInsert, state.inputBuffer);
        state.cursorPosition = window.cursorManager.getPosition();
        state.shift = false;
        state.alpha = false;
        updateShiftAlphaVisuals();
        return;
    }

    if (key.action === 'exp10') {
        if (state.shift) {
            const random = Math.random();
            textToInsert = random.toString();
        } else if (state.alpha) {
            textToInsert = 'π';
        } else {
            textToInsert = '×10^(';
        }
        
        state.inputBuffer = window.cursorManager.insertAt(textToInsert, state.inputBuffer);
        state.cursorPosition = window.cursorManager.getPosition();
        state.shift = false;
        state.alpha = false;
        updateShiftAlphaVisuals();
        return;
    }

    let func = getActiveLabel(key);
    
    // Handle hyperbolic mode for trig functions
    if (state.hypMode && ['sin', 'cos', 'tan'].includes(func)) {
        func = func + 'h';
        state.hypMode = false;
    }
    
    // Add function with opening parenthesis
    if (['sin', 'cos', 'tan', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'sinh', 'cosh', 'tanh', 'log', 'ln', 'sqrt', '√', '∛', '∜', 'Abs'].includes(func)) {
        textToInsert = func + '(';
    } else if (func === '10ˣ') {
        textToInsert = '10^(';
    } else if (func === 'eˣ') {
        textToInsert = 'e^(';
    } else {
        textToInsert = func;
    }
    
    state.inputBuffer = window.cursorManager.insertAt(textToInsert, state.inputBuffer);
    state.cursorPosition = window.cursorManager.getPosition();
    
    state.shift = false;
    state.alpha = false;
    state.displayTree = state.inputBuffer;
    updateShiftAlphaVisuals();
}


/**
 * Handle input keys (numbers, operators, parentheses)
 */
function handleInputKey(key) {
    const state = window.calculatorState;

    // Exit history browsing mode when user starts typing
    if (window.historyManager && window.historyManager.isBrowsing()) {
        window.historyManager.exitBrowsing();
    }
    
    // Check for SHIFT functions on number keys
    if (state.shift) {
        switch (key.id) {
            case 'num7':
                console.log('Constants menu');
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            case 'num8':
                console.log('Conversion menu');
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            case 'num9':
                console.log('Clear menu');
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            case 'num4':
                window.modeManager.switchMode('MATRIX');
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            case 'num5':
                window.modeManager.switchMode('VECTOR');
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            case 'num1':
                window.modeManager.switchMode('STAT');
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            case 'num2':
                window.modeManager.switchMode('COMPLEX');
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            case 'num3':
                window.modeManager.switchMode('BASE');
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            case 'num0':
                if (state.lastAns !== null && state.lastAns !== undefined) {
                    const rounded = Math.round(state.lastAns).toString();
                    state.inputBuffer = window.cursorManager.insertAt(rounded, state.inputBuffer);
                    state.cursorPosition = window.cursorManager.getPosition();
                }
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
            case 'dot':
                const random = Math.random().toString();
                state.inputBuffer = window.cursorManager.insertAt(random, state.inputBuffer);
                state.cursorPosition = window.cursorManager.getPosition();
                state.shift = false;
                updateShiftAlphaVisuals();
                return;
        }
    }
    
    let input = getActiveLabel(key);
    
    // Special handling for shift/alpha inputs
    if (state.shift) {
        switch (key.action) {
            case 'lparen':
                input = '%';
                break;
            case 'rparen':
                input = ',';
                break;
        }
    }
    
    if (state.alpha) {
        switch (key.action) {
            case 'eng':
                input = 'i';
                break;
            case 'rparen':
                input = 'X';
                break;
            case 'comma':
                input = 'B';
                break;
        }
    }
    
    // Special handling for dot
    if (input === '•' || input === '∘,,,') {
        input = '.';
    }
    
    // Insert at cursor position
    state.inputBuffer = window.cursorManager.insertAt(input, state.inputBuffer);
    state.cursorPosition = window.cursorManager.getPosition();

    state.shift = false;
    state.alpha = false;
    state.displayTree = state.inputBuffer;
    updateShiftAlphaVisuals();
}

/**
 * Get the active label based on shift/alpha state
 */
function getActiveLabel(key) {
    const state = window.calculatorState;
    
    if (state.shift && key.shift) {
        return key.shift;
    } else if (state.alpha && key.alpha) {
        return key.alpha;
    } else {
        return key.primary;
    }
}

/**
 * Update visual indicators for shift/alpha state
 */
function updateShiftAlphaVisuals() {
    const state = window.calculatorState;
    
    // Update shift key
    const shiftKey = document.querySelector('[data-key="shift"]');
    if (shiftKey) {
        if (state.shift) {
            shiftKey.classList.add('shift-active');
        } else {
            shiftKey.classList.remove('shift-active');
        }
    }
    
    // Update alpha key
    const alphaKey = document.querySelector('[data-key="alpha"]');
    if (alphaKey) {
        if (state.alpha) {
            alphaKey.classList.add('alpha-active');
        } else {
            alphaKey.classList.remove('alpha-active');
        }
    }
    
    // Update all keys to show active labels
    updateKeyLabels();
}

/**
 * Update key labels based on shift/alpha state
 */
function updateKeyLabels() {
    const state = window.calculatorState;
    
    document.querySelectorAll('.key').forEach(button => {
        const keyId = button.dataset.key;
        const key = getKeyById(keyId);
        
        if (!key) return;
        
        // Add visual hint for which label is active
        if (state.shift && key.shift) {
            button.classList.add('label-shift-active');
            button.classList.remove('label-alpha-active');
        } else if (state.alpha && key.alpha) {
            button.classList.add('label-alpha-active');
            button.classList.remove('label-shift-active');
        } else {
            button.classList.remove('label-shift-active', 'label-alpha-active');
        }
    });
}

/**
 * Handle equals/evaluate
 */
function handleEquals() {
    const state = window.calculatorState;
    
    if (!state.inputBuffer) {
        console.log('Nothing to evaluate');
        return;
    }
    
    try {
        console.log('📊 Evaluating:', state.inputBuffer);
        
        // Use the proper parser and evaluator
        const result = evaluateWithState(state.inputBuffer);
        
        // Store result
        state.lastAns = result;
        state.stack.push({
            expression: state.inputBuffer,
            result: result,
            timestamp: Date.now()
        });

        // Add to history
        if (window.historyManager) {
            window.historyManager.add(state.inputBuffer, result);
            window.historyManager.save(); // Auto-save
        }
        
        // Clear input for next calculation
        state.inputBuffer = '';
        state.cursorPosition = 0;
        window.cursorManager.reset(0);
        
        console.log('✅ Result:', result);
        
    } catch (error) {
        console.error('❌ Evaluation error:', error);
        window.setError(error.message || 'Math ERROR');
    }
}

/**
 * Handle mode menu
 */
function openModeMenu() {
    console.log('📋 MODE Menu');
    
    const modes = window.modeManager.showModeMenu();
    
    // For demonstration, let's allow quick mode switching via console
    console.log('To switch mode, use: modeManager.switchMode("STAT")');
    console.log('Available modes:', modes.join(', '));
}

/**
 * Handle setup menu
 */
function openSetupMenu() {
    console.log('⚙️ Opening SETUP menu (to be implemented in Phase 6)');
    // Will show: MthIO, LineIO, Deg, Rad, Grad, Fix, Sci, Norm, etc.
}

/**
 * Handle directional pad
 */
function handleDirectionalPad(key) {
    // For now, we'll handle this with a simple approach
    // In a full implementation, this would show a menu to select which arrow
    console.log('🎮 Arrow Keys:');
    console.log('Use physical keyboard arrows or click to position cursor');
    console.log('Up/Down: Navigate history');
}

function handleArrowKey(direction) {
    const state = window.calculatorState;
    
    switch (direction) {
        case 'left':
            if (window.cursorManager.moveLeft()) {
                state.cursorPosition = window.cursorManager.getPosition();
                window.updateDisplay();
            }
            break;
            
        case 'right':
            if (window.cursorManager.moveRight(state.inputBuffer.length)) {
                state.cursorPosition = window.cursorManager.getPosition();
                window.updateDisplay();
            }
            break;
            
        case 'up':
            handleHistoryBackward();
            break;
            
        case 'down':
            handleHistoryForward();
            break;
    }
}

/**
 * Navigate backward in history (Up arrow)
 */
function handleHistoryBackward() {
    const state = window.calculatorState;
    
    if (!window.historyManager) {
        console.log('History manager not available');
        return;
    }
    
    const entry = window.historyManager.backward(state.inputBuffer);
    
    if (entry) {
        state.inputBuffer = entry.expression;
        state.cursorPosition = state.inputBuffer.length;
        window.cursorManager.reset(state.inputBuffer.length);
        window.updateDisplay();
        
        console.log('⬆️ History:', entry.expression);
    } else {
        console.log('⬆️ Already at oldest entry');
    }
}

/**
 * Navigate forward in history (Down arrow)
 */
function handleHistoryForward() {
    const state = window.calculatorState;
    
    if (!window.historyManager) {
        console.log('History manager not available');
        return;
    }
    
    const entry = window.historyManager.forward();
    
    if (entry) {
        if (entry.isCurrent) {
            // Returned to current input
            state.inputBuffer = entry.expression;
            console.log('⬇️ Back to current input');
        } else {
            state.inputBuffer = entry.expression;
            console.log('⬇️ History:', entry.expression);
        }
        
        state.cursorPosition = state.inputBuffer.length;
        window.cursorManager.reset(state.inputBuffer.length);
        window.updateDisplay();
    } else {
        console.log('⬇️ Already at newest entry');
    }
}

// Export
window.handleHistoryBackward = handleHistoryBackward;
window.handleHistoryForward = handleHistoryForward;
window.handleArrowKey = handleArrowKey;


/**
 * Handle ON button
 */
function handleOn() {
    console.log('⚡ Calculator ON');
    // Calculator is always on in browser version
}

/**
 * Handle OFF
 */
function handleOff() {
    console.log('💤 Calculator OFF (clearing state)');
    window.clearAll();
}


/**
 * Physical keyboard support with navigation
 */
function handlePhysicalKeyboard(event) {
    const key = event.key;
    
    // Map physical keys to calculator keys
    const keyMap = {
        '0': 'num0', '1': 'num1', '2': 'num2', '3': 'num3', '4': 'num4',
        '5': 'num5', '6': 'num6', '7': 'num7', '8': 'num8', '9': 'num9',
        '.': 'dot',
        '+': 'plus',
        '-': 'minus',
        '*': 'multiply',
        '/': 'divide',
        'Enter': 'equals',
        'Escape': 'ac',
        'Backspace': 'del',
        'Delete': 'del',
        '(': 'lparen',
        ')': 'rparen',
        's': 'shift',
        'a': 'alpha',
        'm': 'mode'
    };
    
    // Handle arrow keys separately
    if (key.startsWith('Arrow')) {
        event.preventDefault();
        const direction = key.replace('Arrow', '').toLowerCase();
        handleArrowKey(direction);
        return;
    }
    
    const mappedKey = keyMap[key];
    if (mappedKey) {
        event.preventDefault();
        handleKeyPress(mappedKey);
        
        // Visual feedback
        const button = document.querySelector(`[data-key="${mappedKey}"]`);
        if (button) {
            button.classList.add('key-pressed');
            button.focus();
            setTimeout(() => {
                button.classList.remove('key-pressed');
                button.blur();
            }, 150);
        }
    }
    
    // Handle Tab for focus navigation (don't prevent default)
    if (key === 'Tab') {
        // Allow natural tab navigation
        return;
    }
}

// Add keyboard navigation for button focus
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (event) => {
        const focused = document.activeElement;
        
        if (focused && focused.classList.contains('key')) {
            // Allow Enter/Space to activate focused button
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                focused.click();
            }
        }
    });
});

/**
 * Handle memory operations
 */
function handleMemoryPlus() {
    const state = window.calculatorState;
    
    if (state.lastAns !== null && state.lastAns !== undefined) {
        window.memoryManager.add('M', state.lastAns);
    } else if (state.inputBuffer) {
        try {
            const value = evaluateWithState(state.inputBuffer);
            window.memoryManager.add('M', value);
        } catch (error) {
            window.setError('Math ERROR');
        }
    }
}

function handleMemoryMinus() {
    const state = window.calculatorState;
    
    if (state.lastAns !== null && state.lastAns !== undefined) {
        window.memoryManager.subtract('M', state.lastAns);
    } else if (state.inputBuffer) {
        try {
            const value = evaluateWithState(state.inputBuffer);
            window.memoryManager.subtract('M', value);
        } catch (error) {
            window.setError('Math ERROR');
        }
    }
}

function handleStore() {
    console.log('💾 STO function - Enter register');
    window.memoryManager.promptStore();
}

function handleRecall() {
    console.log('📂 RCL function - Enter register');
    window.memoryManager.promptRecall();
}

/**
 * Play key sound (optional - placeholder)
 */
function playKeySound(type) {
    // Could add actual sound effects here
    // For now, just log
    // console.log('🔊', type);
}

// Export functions
window.handleMemoryPlus = handleMemoryPlus;
window.handleMemoryMinus = handleMemoryMinus;
window.handleStore = handleStore;
window.handleRecall = handleRecall;
window.initInputController = initInputController;
window.handleKeyPress = handleKeyPress;