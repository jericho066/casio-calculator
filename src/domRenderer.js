/**
 * DOM Renderer
 * Generates the visual keyboard from KEYMAP
 */

function renderKeyboard() {
    const keyboard = document.getElementById('keyboard');
    if (!keyboard) {
        console.error('Keyboard container not found');
        return;
    }
    
    // Clear existing content
    keyboard.innerHTML = '';
    
    // Render each row
    KEYMAP.forEach((row, rowIndex) => {
        row.forEach(key => {
            const button = createKeyButton(key);
            keyboard.appendChild(button);
        });
    });
    
    console.log('✅ Keyboard rendered with', keyboard.children.length, 'keys');
}

function createKeyButton(keyData) {
    const button = document.createElement('button');
    button.className = `key ${keyData.cssClass}`;
    button.dataset.key = keyData.id;
    button.dataset.action = keyData.action;
    button.dataset.type = keyData.type;

    // Add ARIA attributes
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', getKeyAriaLabel(keyData));
    button.setAttribute('tabindex', '0');
    
    // Create label structure
    const labelContainer = document.createElement('div');
    labelContainer.className = 'key-label-container';
    
    // Add shift label (top-left, yellow)
    if (keyData.shift) {
        const shiftLabel = document.createElement('span');
        shiftLabel.className = 'key-label-shift';
        shiftLabel.textContent = keyData.shift;
        labelContainer.appendChild(shiftLabel);
    }
    
    // Add alpha label (top-right, pink/red)
    if (keyData.alpha) {
        const alphaLabel = document.createElement('span');
        alphaLabel.className = 'key-label-alpha';
        alphaLabel.textContent = keyData.alpha;
        labelContainer.appendChild(alphaLabel);
    }
    
    // Add primary label (center)
    const primaryLabel = document.createElement('span');
    primaryLabel.className = 'key-label';
    primaryLabel.textContent = keyData.primary;
    labelContainer.appendChild(primaryLabel);
    
    button.appendChild(labelContainer);
    
    // Add click event listener
    button.addEventListener('click', () => handleKeyClick(keyData.id));
    
    // Add touch feedback
    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(2px)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = '';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
    
    return button;
}

function handleKeyClick(keyId) {
    // Delegate to the input controller
    if (typeof window.handleKeyPress === 'function') {
        window.handleKeyPress(keyId);
    } else {
        console.error('handleKeyPress not found');
    }
}


/**
 * Get accessible label for key
 */
function getKeyAriaLabel(keyData) {
    const state = window.calculatorState;
    let label = keyData.primary;
    
    if (state.shift && keyData.shift) {
        label = keyData.shift;
    } else if (state.alpha && keyData.alpha) {
        label = keyData.alpha;
    }
    
    // Add descriptive labels
    const descriptions = {
        'shift': 'Shift key',
        'alpha': 'Alpha key',
        'clear': 'All clear',
        'delete': 'Delete',
        'equals': 'Equals',
        'plus': 'Plus',
        'minus': 'Minus',
        'multiply': 'Multiply',
        'divide': 'Divide'
    };
    
    return descriptions[keyData.action] || label;
}

window.getKeyAriaLabel = getKeyAriaLabel;


// Export functions
window.renderKeyboard = renderKeyboard;
window.handleKeyClick = handleKeyClick;
