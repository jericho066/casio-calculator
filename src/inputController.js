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
    
    console.log('🔘 Key pressed:', keyId, '| Type:', key.type, '| Action:', key.action);
    
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
            handleDirectionalPad();
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
 * Handle operator keys (+, -, ×, ÷, ^)
 */
function handleOperatorKey(key) {
    const state = window.calculatorState;
    let operator = getActiveLabel(key);
    
    // Append operator to input buffer
    state.inputBuffer += operator;
    
    // Clear shift/alpha after use
    state.shift = false;
    state.alpha = false;

    // Update display tree for natural rendering
    state.displayTree = state.inputBuffer;

    updateShiftAlphaVisuals();

}

/**
 * Handle function keys (sin, cos, log, sqrt, etc.)
 */
function handleFunctionKey(key) {
    const state = window.calculatorState;

    // Special handling for Ans
    if (key.action === 'ans') {
        state.inputBuffer += state.lastAns.toString();
        state.shift = false;
        state.alpha = false;
        updateShiftAlphaVisuals();
        return;
    }


    let func = getActiveLabel(key);
    
    // Add function with opening parenthesis
    if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', '√'].includes(func)) {
        state.inputBuffer += func + '(';
    } else {
        state.inputBuffer += func;
    }
    
    // Clear shift/alpha after use
    state.shift = false;
    state.alpha = false;

    // Update display tree for natural rendering
    state.displayTree = state.inputBuffer;

    updateShiftAlphaVisuals();
}


/**
 * Handle input keys (numbers, operators, parentheses)
 */
function handleInputKey(key) {
    const state = window.calculatorState;
    let input = getActiveLabel(key);
    
    // Special handling for certain inputs
    if (input === '•') {
        input = '.'; // Convert bullet to decimal point
    }
    
    // Append to input buffer
    state.inputBuffer += input;
    
    // Clear shift/alpha after use
    state.shift = false;
    state.alpha = false;

    // Update display tree for natural rendering
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
        
        // Clear input for next calculation
        state.inputBuffer = '';
        
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
    console.log('📋 Opening MODE menu (to be implemented in Phase 6)');
    // Will show: COMP, STAT, TABLE, EQN, MATRIX, VECTOR, etc.
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
function handleDirectionalPad() {
    console.log('🎮 D-pad pressed (cursor movement to be implemented)');
}

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
 * Physical keyboard support
 */
function handlePhysicalKeyboard(event) {
    const state = window.calculatorState;
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
        '(': 'lparen',
        ')': 'rparen'
    };
    
    const mappedKey = keyMap[key];
    if (mappedKey) {
        event.preventDefault();
        handleKeyPress(mappedKey);
        
        // Visual feedback
        const button = document.querySelector(`[data-key="${mappedKey}"]`);
        if (button) {
            button.classList.add('key-pressed');
            setTimeout(() => button.classList.remove('key-pressed'), 100);
        }
    }
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
window.initInputController = initInputController;
window.handleKeyPress = handleKeyPress;