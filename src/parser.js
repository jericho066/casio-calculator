/**
 * Expression Parser
 * Tokenizes expressions and converts infix notation to RPN using Shunting Yard algorithm
 */

/**
 * Token types
 */
const TokenType = {
    NUMBER: 'NUMBER',
    OPERATOR: 'OPERATOR',
    FUNCTION: 'FUNCTION',
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    COMMA: 'COMMA',
    CONSTANT: 'CONSTANT',
    VARIABLE: 'VARIABLE'
};

/**
 * Operator precedence and associativity
 */
const OPERATORS = {
    '+': { precedence: 1, associativity: 'left', args: 2 },
    '−': { precedence: 1, associativity: 'left', args: 2 },
    '-': { precedence: 1, associativity: 'left', args: 2 },
    '×': { precedence: 2, associativity: 'left', args: 2 },
    '*': { precedence: 2, associativity: 'left', args: 2 },
    '÷': { precedence: 2, associativity: 'left', args: 2 },
    '/': { precedence: 2, associativity: 'left', args: 2 },
    '^': { precedence: 3, associativity: 'right', args: 2 },
    'xʸ': { precedence: 3, associativity: 'right', args: 2 },
    '%': { precedence: 2, associativity: 'left', args: 2 }
};

/**
 * Functions and their argument counts
 */
const FUNCTIONS = {
    'sin': { args: 1, type: 'trig' },
    'cos': { args: 1, type: 'trig' },
    'tan': { args: 1, type: 'trig' },
    'sin⁻¹': { args: 1, type: 'trig', inverse: true },
    'cos⁻¹': { args: 1, type: 'trig', inverse: true },
    'tan⁻¹': { args: 1, type: 'trig', inverse: true },
    'asin': { args: 1, type: 'trig', inverse: true },
    'acos': { args: 1, type: 'trig', inverse: true },
    'atan': { args: 1, type: 'trig', inverse: true },
    'sinh': { args: 1, type: 'hyp' },
    'cosh': { args: 1, type: 'hyp' },
    'tanh': { args: 1, type: 'hyp' },
    'log': { args: 1 },
    'ln': { args: 1 },
    '√': { args: 1 },
    'sqrt': { args: 1 },
    '∛': { args: 1 },
    '∜': { args: 1 },
    'abs': { args: 1 },
    'Abs': { args: 1 }
};

/**
 * Constants
 */
const CONSTANTS = {
    'π': Math.PI,
    'pi': Math.PI,
    'e': Math.E,
    'E': Math.E
};

/**
 * Tokenize an expression string into tokens
 */
function tokenize(expression) {
    const tokens = [];
    let i = 0;
    
    // Remove whitespace
    expression = expression.replace(/\s+/g, '');
    
    while (i < expression.length) {
        const char = expression[i];
        
        // Numbers (including decimals and scientific notation)
        if (char >= '0' && char <= '9' || char === '.') {
            let num = '';
            while (i < expression.length && (
                (expression[i] >= '0' && expression[i] <= '9') ||
                expression[i] === '.'
            )) {
                num += expression[i];
                i++;
            }
            tokens.push({ type: TokenType.NUMBER, value: parseFloat(num) });
            continue;
        }
        
        // Functions (multi-character)
        let foundFunction = false;
        for (let funcName in FUNCTIONS) {
            if (expression.substr(i, funcName.length) === funcName) {
                tokens.push({ type: TokenType.FUNCTION, value: funcName });
                i += funcName.length;
                foundFunction = true;
                break;
            }
        }
        if (foundFunction) continue;
        
        // Constants
        let foundConstant = false;
        for (let constName in CONSTANTS) {
            if (expression.substr(i, constName.length) === constName) {
                tokens.push({ type: TokenType.CONSTANT, value: constName });
                i += constName.length;
                foundConstant = true;
                break;
            }
        }
        if (foundConstant) continue;
        
        // Operators
        if (OPERATORS[char]) {
            // Check for unary minus
            if ((char === '-' || char === '−') && 
                (i === 0 || tokens.length === 0 || 
                 tokens[tokens.length - 1].type === TokenType.OPERATOR ||
                 tokens[tokens.length - 1].type === TokenType.LPAREN)) {
                // Unary minus - treat as -1 *
                tokens.push({ type: TokenType.NUMBER, value: -1 });
                tokens.push({ type: TokenType.OPERATOR, value: '×' });
            } else {
                tokens.push({ type: TokenType.OPERATOR, value: char });
            }
            i++;
            continue;
        }
        
        // Parentheses
        if (char === '(') {
            tokens.push({ type: TokenType.LPAREN, value: char });
            i++;
            continue;
        }
        if (char === ')') {
            tokens.push({ type: TokenType.RPAREN, value: char });
            i++;
            continue;
        }
        
        // Comma (for multi-argument functions)
        if (char === ',') {
            tokens.push({ type: TokenType.COMMA, value: char });
            i++;
            continue;
        }
        
        // Variables (single letters)
        if (char >= 'A' && char <= 'Z' || char >= 'a' && char <= 'z') {
            tokens.push({ type: TokenType.VARIABLE, value: char });
            i++;
            continue;
        }
        
        // Unknown character - skip
        console.warn('Unknown character:', char);
        i++;
    }
    
    return tokens;
}

/**
 * Convert infix tokens to RPN using Shunting Yard algorithm
 */
function parseToRPN(tokens) {
    const output = [];
    const operatorStack = [];
    
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        switch (token.type) {
            case TokenType.NUMBER:
            case TokenType.CONSTANT:
            case TokenType.VARIABLE:
                output.push(token);
                break;
                
            case TokenType.FUNCTION:
                operatorStack.push(token);
                break;
                
            case TokenType.COMMA:
                // Pop operators until we find a left parenthesis
                while (operatorStack.length > 0 && 
                       operatorStack[operatorStack.length - 1].type !== TokenType.LPAREN) {
                    output.push(operatorStack.pop());
                }
                break;
                
            case TokenType.OPERATOR:
                const op1 = OPERATORS[token.value];
                while (operatorStack.length > 0) {
                    const topToken = operatorStack[operatorStack.length - 1];
                    if (topToken.type !== TokenType.OPERATOR) break;
                    
                    const op2 = OPERATORS[topToken.value];
                    if ((op1.associativity === 'left' && op1.precedence <= op2.precedence) ||
                        (op1.associativity === 'right' && op1.precedence < op2.precedence)) {
                        output.push(operatorStack.pop());
                    } else {
                        break;
                    }
                }
                operatorStack.push(token);
                break;
                
            case TokenType.LPAREN:
                operatorStack.push(token);
                break;
                
            case TokenType.RPAREN:
                // Pop operators until we find the matching left parenthesis
                while (operatorStack.length > 0 && 
                       operatorStack[operatorStack.length - 1].type !== TokenType.LPAREN) {
                    output.push(operatorStack.pop());
                }
                
                if (operatorStack.length === 0) {
                    throw new Error('Mismatched parentheses');
                }
                
                operatorStack.pop(); // Remove the left parenthesis
                
                // If there's a function on top of the stack, pop it to output
                if (operatorStack.length > 0 && 
                    operatorStack[operatorStack.length - 1].type === TokenType.FUNCTION) {
                    output.push(operatorStack.pop());
                }
                break;
        }
    }
    
    // Pop remaining operators
    while (operatorStack.length > 0) {
        const token = operatorStack.pop();
        if (token.type === TokenType.LPAREN || token.type === TokenType.RPAREN) {
            throw new Error('Mismatched parentheses');
        }
        output.push(token);
    }
    
    return output;
}

/**
 * Parse expression string to RPN
 */
function parse(expression) {
    try {
        const tokens = tokenize(expression);
        console.log('📝 Tokens:', tokens);
        
        const rpn = parseToRPN(tokens);
        console.log('🔄 RPN:', rpn);
        
        return rpn;
    } catch (error) {
        console.error('Parse error:', error);
        throw error;
    }
}

// Export functions
window.tokenize = tokenize;
window.parseToRPN = parseToRPN;
window.parse = parse;
window.TokenType = TokenType;
window.OPERATORS = OPERATORS;
window.FUNCTIONS = FUNCTIONS;
window.CONSTANTS = CONSTANTS;

