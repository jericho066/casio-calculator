/**
 * Natural Display Renderer
 * Renders mathematical expressions in natural/textbook format
 */

/**
 * Parse expression into a display tree for natural rendering
 */
function parseDisplayExpression(expression) {
    const tokens = [];
    let i = 0;
    
    while (i < expression.length) {
        const char = expression[i];
        
        // Check for multi-character tokens
        if (expression.substr(i, 3) === 'sin' || 
            expression.substr(i, 3) === 'cos' || 
            expression.substr(i, 3) === 'tan' ||
            expression.substr(i, 3) === 'log') {
            tokens.push({ type: 'function', value: expression.substr(i, 3) });
            i += 3;
            continue;
        }
        
        if (expression.substr(i, 2) === 'ln') {
            tokens.push({ type: 'function', value: 'ln' });
            i += 2;
            continue;
        }
        
        if (expression.substr(i, 4) === 'sqrt') {
            tokens.push({ type: 'sqrt', value: 'sqrt' });
            i += 4;
            continue;
        }
        
        if (expression.substr(i, 3) === 'Ans') {
            tokens.push({ type: 'text', value: 'Ans' });
            i += 3;
            continue;
        }
        
        // Check for superscript operators
        if (expression.substr(i, 2) === 'x²') {
            tokens.push({ type: 'power', base: 'x', exp: '2' });
            i += 2;
            continue;
        }
        
        if (expression.substr(i, 2) === 'x³') {
            tokens.push({ type: 'power', base: 'x', exp: '3' });
            i += 2;
            continue;
        }
        
        if (expression.substr(i, 2) === 'xʸ' || expression.substr(i, 1) === '^') {
            tokens.push({ type: 'operator', value: '^' });
            i += (expression.substr(i, 2) === 'xʸ') ? 2 : 1;
            continue;
        }
        
        if (expression.substr(i, 4) === '×10ˣ') {
            tokens.push({ type: 'exp10', value: '×10' });
            i += 4;
            continue;
        }
        
        // Single character tokens
        switch (char) {
            case '√':
                tokens.push({ type: 'sqrt', value: '√' });
                break;
            case '∛':
                tokens.push({ type: 'root', value: '∛', index: 3 });
                break;
            case '∜':
                tokens.push({ type: 'root', value: '∜', index: 4 });
                break;
            case '÷':
            case '/':
                tokens.push({ type: 'operator', value: '÷' });
                break;
            case '×':
            case '*':
                tokens.push({ type: 'operator', value: '×' });
                break;
            case '+':
            case '−':
            case '-':
            case '(':
            case ')':
            case ',':
                tokens.push({ type: char === '(' || char === ')' ? 'paren' : 'operator', value: char });
                break;
            case 'π':
                tokens.push({ type: 'constant', value: 'π' });
                break;
            case 'e':
                // Check if it's Euler's number or part of a function
                if (i > 0 && /[a-z]/i.test(expression[i-1])) {
                    tokens.push({ type: 'text', value: char });
                } else {
                    tokens.push({ type: 'constant', value: 'e' });
                }
                break;
            case '.':
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                // Collect full number
                let num = '';
                while (i < expression.length && 
                       (expression[i] >= '0' && expression[i] <= '9' || expression[i] === '.')) {
                    num += expression[i];
                    i++;
                }
                tokens.push({ type: 'number', value: num });
                i--; // Back up one since loop will increment
                break;
            default:
                // Variables or other text
                if (/[A-Z]/i.test(char)) {
                    tokens.push({ type: 'variable', value: char });
                } else {
                    tokens.push({ type: 'text', value: char });
                }
        }
        i++;
    }
    
    return tokens;
}

/**
 * Render a single token to HTML
 */
function renderToken(token) {
    const span = document.createElement('span');
    span.className = 'display-token';
    
    switch (token.type) {
        case 'number':
            span.className += ' token-number';
            span.textContent = token.value;
            break;
            
        case 'operator':
            span.className += ' token-operator';
            span.textContent = token.value;
            break;
            
        case 'function':
            span.className += ' token-function';
            span.textContent = token.value;
            break;
            
        case 'constant':
            span.className += ' token-constant';
            span.textContent = token.value;
            break;
            
        case 'variable':
            span.className += ' token-variable';
            span.textContent = token.value;
            break;
            
        case 'paren':
            span.className += ' token-paren';
            span.textContent = token.value;
            break;
            
        case 'sqrt':
            span.className += ' token-sqrt';
            span.innerHTML = '<span class="sqrt-symbol">√</span><span class="sqrt-overline"></span>';
            break;
            
        case 'root':
            span.className += ' token-root';
            span.innerHTML = `<sup class="root-index">${token.index}</sup><span class="sqrt-symbol">√</span>`;
            break;
            
        case 'power':
            span.className += ' token-power';
            span.innerHTML = `${token.base}<sup>${token.exp}</sup>`;
            break;
            
        case 'exp10':
            span.className += ' token-exp10';
            span.innerHTML = '×10<sup class="exp-placeholder">□</sup>';
            break;
            
        default:
            span.textContent = token.value;
    }
    
    return span;
}

/**
 * Render expression with natural formatting
 */
function renderNaturalDisplay(expression) {
    if (!expression) return '';
    
    try {
        const tokens = parseDisplayExpression(expression);
        const container = document.createElement('div');
        container.className = 'natural-expression';
        
        tokens.forEach(token => {
            const element = renderToken(token);
            container.appendChild(element);
        });
        
        return container;
    } catch (error) {
        console.error('Display rendering error:', error);
        // Fallback to plain text
        const container = document.createElement('div');
        container.textContent = expression;
        return container;
    }
}

/**
 * Render fraction in natural format
 */
function renderFraction(numerator, denominator) {
    const frac = document.createElement('div');
    frac.className = 'frac';
    
    const num = document.createElement('div');
    num.className = 'frac-num';
    num.textContent = numerator;
    
    const den = document.createElement('div');
    den.className = 'frac-den';
    den.textContent = denominator;
    
    frac.appendChild(num);
    frac.appendChild(den);
    
    return frac;
}

/**
 * Render square root with overline
 */
function renderSquareRoot(content) {
    const sqrt = document.createElement('span');
    sqrt.className = 'sqrt-container';
    
    const symbol = document.createElement('span');
    symbol.className = 'sqrt-symbol';
    symbol.textContent = '√';
    
    const overline = document.createElement('span');
    overline.className = 'sqrt-overline';
    
    const radicand = document.createElement('span');
    radicand.className = 'sqrt-content';
    radicand.textContent = content;
    
    sqrt.appendChild(symbol);
    sqrt.appendChild(overline);
    sqrt.appendChild(radicand);
    
    return sqrt;
}

/**
 * Render superscript (for powers)
 */
function renderSuperscript(base, exponent) {
    const container = document.createElement('span');
    container.className = 'power-container';
    
    const baseSpan = document.createElement('span');
    baseSpan.className = 'power-base';
    baseSpan.textContent = base;
    
    const expSpan = document.createElement('sup');
    expSpan.className = 'power-exp';
    expSpan.textContent = exponent;
    
    container.appendChild(baseSpan);
    container.appendChild(expSpan);
    
    return container;
}

/**
 * Update the display with natural rendering
 */
function updateNaturalDisplay() {
    const state = window.calculatorState;
    const inputEl = document.getElementById('display-input');
    const resultEl = document.getElementById('display-result');
    
    if (!inputEl || !resultEl) return;
    
    // Render input
    if (state.error) {
        inputEl.textContent = state.error;
        inputEl.style.color = '#ff0000';
    } else if (state.inputBuffer) {
        inputEl.innerHTML = '';
        const rendered = renderNaturalDisplay(state.inputBuffer);
        inputEl.appendChild(rendered);
        inputEl.style.color = '#000';
    } else {
        inputEl.textContent = '';
        inputEl.style.color = '#000';
    }
    
    // Render result
    if (state.lastAns !== null && state.lastAns !== undefined) {
        resultEl.textContent = formatNumber(state.lastAns);
    } else {
        resultEl.textContent = '';
    }
}

/**
 * Format number for display
 */
function formatNumber(num) {
    if (typeof num !== 'number') return String(num);
    
    // Handle special cases
    if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
    if (isNaN(num)) return 'Math ERROR';
    
    const state = window.calculatorState;
    const precision = state.precision || 10;
    
    // Handle very small numbers (scientific notation)
    if (Math.abs(num) < 1e-10 && num !== 0) {
        return num.toExponential(precision - 1);
    }
    
    // Handle very large numbers
    if (Math.abs(num) > 1e10) {
        return num.toExponential(precision - 1);
    }
    
    // Format with precision
    const str = num.toPrecision(precision);
    const parsed = parseFloat(str);
    
    // Remove trailing zeros
    return parsed.toString();
}

// Export functions
window.renderNaturalDisplay = renderNaturalDisplay;
window.updateNaturalDisplay = updateNaturalDisplay;
window.renderFraction = renderFraction;
window.renderSquareRoot = renderSquareRoot;
window.renderSuperscript = renderSuperscript;
