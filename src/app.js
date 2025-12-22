/**
 * Casio fx-991ES PLUS Calculator
 * Main Application Bootstrap
 * 
 * This file initializes the calculator application and coordinates
 * all modules together.
 */

// ===========================
// Global Application State
// ===========================
const state = {
    mode: 'Math',              // 'Math', 'STAT', 'MATRIX', 'BASE', 'COMPLEX', 'EQN'
    angleUnit: 'DEG',          // 'DEG' | 'RAD' | 'GRAD'
    shift: false,              // shift key active
    alpha: false,              // alpha key active
    hypMode: false,
    inputBuffer: '',           // raw input string
    displayTree: null,         // parsed AST for natural display
    stack: [],                 // calculation history
    memory: {                  // memory registers
        M: 0,
        A: null, B: null, C: null,
        D: null, E: null, F: null,
        X: null, Y: null
    },
    matrices: {                // matrix storage
        A: null,
        B: null,
        C: null
    },
    lastAns: 0,               // last answer
    precision: 10,            // display precision
    error: null               // current error message
};

// ===========================
// Application Initialization
// ===========================
function initCalculator() {
    console.log('🧮 Initializing Casio fx-991ES PLUS Calculator...');
    
    // Load saved settings from localStorage
    loadSettings();
    
    // Render the keyboard
    if (typeof renderKeyboard === 'function') {
        renderKeyboard();
        console.log('✅ Keyboard rendered');
    } else {
        console.error('❌ renderKeyboard function not found');
    }
    
    // Initialize input controller
    if (typeof initInputController === 'function') {
        initInputController();
        console.log('✅ Input controller initialized');
    } else {
        console.error('❌ initInputController function not found');
    }
    
    // Update display
    updateDisplay();
    
    console.log('✅ Calculator initialized successfully!');
    console.log('State:', state);
}

// ===========================
// Settings Management
// ===========================
function loadSettings() {
    const saved = loadFromStorage();
    if (saved) {
        state.angleUnit = saved.angleUnit || 'DEG';
        state.precision = saved.precision || 10;
        state.memory = saved.memory || state.memory;
        state.lastAns = saved.lastAns || 0;
        console.log('⚙️ Settings loaded from storage');
    }
}

function saveSettings() {
    saveToStorage({
        angleUnit: state.angleUnit,
        precision: state.precision,
        memory: state.memory,
        lastAns: state.lastAns
    });
}

// ===========================
// Display Update Functions
// ===========================
function updateDisplay() {
    // Use natural display renderer if available
    if (typeof updateNaturalDisplay === 'function') {
        updateNaturalDisplay();
    } else {
        // Fallback to simple display
        const inputEl = document.getElementById('display-input');
        const resultEl = document.getElementById('display-result');
        
        if (!inputEl || !resultEl) {
            console.error('Display elements not found');
            return;
        }
        
        // Update input display
        if (state.error) {
            inputEl.textContent = state.error;
            inputEl.style.color = '#ff0000';
        } else {
            inputEl.textContent = state.inputBuffer || '';
            inputEl.style.color = '#000';
        }
        
        // Update result display
        if (state.lastAns !== null && state.lastAns !== undefined) {
            resultEl.textContent = formatNumber(state.lastAns);
        } else {
            resultEl.textContent = '';
        }
    }
    
    // Update mode indicator
    const modeEl = document.getElementById('indicator-mode');
    if (modeEl) {
        modeEl.textContent = state.mode + (state.angleUnit !== 'DEG' ? ' ' + state.angleUnit : '');
    }
}

function formatNumber(num) {
    if (typeof num !== 'number') return String(num);
    
    // Handle special cases
    if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
    if (isNaN(num)) return 'Math ERROR';
    
    // Format with precision
    const str = num.toPrecision(state.precision);
    
    // Remove trailing zeros after decimal point
    return parseFloat(str).toString();
}

// ===========================
// Error Handling
// ===========================
function setError(message) {
    state.error = message;
    updateDisplay();
    
    // Clear error after 2 seconds
    setTimeout(() => {
        state.error = null;
        updateDisplay();
    }, 2000);
}

function clearError() {
    state.error = null;
}

// ===========================
// Utility Functions
// ===========================
function clearAll() {
    state.inputBuffer = '';
    state.displayTree = null;
    state.error = null;
    state.shift = false;
    state.alpha = false;
    updateDisplay();
    updateShiftAlphaIndicators();
}

function deleteLastChar() {
    if (state.inputBuffer.length > 0) {
        state.inputBuffer = state.inputBuffer.slice(0, -1);
        updateDisplay();
    }
}

function updateShiftAlphaIndicators() {
    // Update visual indicators for shift/alpha state
    const shiftKey = document.querySelector('[data-key="shift"]');
    const alphaKey = document.querySelector('[data-key="alpha"]');
    
    if (shiftKey) {
        if (state.shift) {
            shiftKey.classList.add('shift-active');
        } else {
            shiftKey.classList.remove('shift-active');
        }
    }
    
    if (alphaKey) {
        if (state.alpha) {
            alphaKey.classList.add('alpha-active');
        } else {
            alphaKey.classList.remove('alpha-active');
        }
    }
}

// ===========================
// Start the Application
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initCalculator();
});

// Make state and functions globally accessible
window.calculatorState = state;
window.updateDisplay = updateDisplay;
window.setError = setError;
window.clearError = clearError;
window.clearAll = clearAll;
window.deleteLastChar = deleteLastChar;
window.saveSettings = saveSettings;
window.updateShiftAlphaIndicators = updateShiftAlphaIndicators;

