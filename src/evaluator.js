/**
 * Expression Evaluator
 * Evaluates RPN (Reverse Polish Notation) expressions
 */

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Convert gradians to radians
 */
function gradiansToRadians(gradians) {
    return gradians * (Math.PI / 200);
}

/**
 * Apply angle unit conversion for trig functions
 */
function applyAngleUnit(value, angleUnit) {
    switch (angleUnit) {
        case 'DEG':
            return toRadians(value);
        case 'RAD':
            return value;
        case 'GRAD':
            return gradiansToRadians(value);
        default:
            return value;
    }
}

/**
 * Apply inverse angle unit conversion
 */
function applyInverseAngleUnit(value, angleUnit) {
    switch (angleUnit) {
        case 'DEG':
            return toDegrees(value);
        case 'RAD':
            return value;
        case 'GRAD':
            return value * (200 / Math.PI);
        default:
            return value;
    }
}

/**
 * Evaluate a single operator or function
 */
function evaluateOperation(operator, args, angleUnit = 'DEG') {
    switch (operator) {
        // Arithmetic operators
        case '+':
            return args[0] + args[1];
        case '−':
        case '-':
            return args[0] - args[1];
        case '×':
        case '*':
            return args[0] * args[1];
        case '÷':
        case '/':
            if (args[1] === 0) throw new Error('Division by zero');
            return args[0] / args[1];
        case '^':
        case 'xʸ':
            return Math.pow(args[0], args[1]);
        case '%':
            return args[0] % args[1];
            
        // Trigonometric functions (normal)
        case 'sin':
            return Math.sin(applyAngleUnit(args[0], angleUnit));
        case 'cos':
            return Math.cos(applyAngleUnit(args[0], angleUnit));
        case 'tan':
            return Math.tan(applyAngleUnit(args[0], angleUnit));
            
        // Inverse trigonometric functions
        case 'sin⁻¹':
        case 'asin':
            return applyInverseAngleUnit(Math.asin(args[0]), angleUnit);
        case 'cos⁻¹':
        case 'acos':
            return applyInverseAngleUnit(Math.acos(args[0]), angleUnit);
        case 'tan⁻¹':
        case 'atan':
            return applyInverseAngleUnit(Math.atan(args[0]), angleUnit);
            
        // Hyperbolic functions
        case 'sinh':
            return Math.sinh(args[0]);
        case 'cosh':
            return Math.cosh(args[0]);
        case 'tanh':
            return Math.tanh(args[0]);
            
        // Logarithmic functions
        case 'log':
            if (args[0] <= 0) throw new Error('Invalid domain for log');
            return Math.log10(args[0]);
        case 'ln':
            if (args[0] <= 0) throw new Error('Invalid domain for ln');
            return Math.log(args[0]);
            
        // Root functions
        case '√':
        case 'sqrt':
            if (args[0] < 0) throw new Error('Invalid domain for sqrt');
            return Math.sqrt(args[0]);
        case '∛':
            return Math.cbrt(args[0]);
        case '∜':
            return Math.pow(args[0], 1/4);
            
        // Other functions
        case 'abs':
        case 'Abs':
            return Math.abs(args[0]);

        // Combinatorics
        case '!':
            if (!Number.isInteger(args[0]) || args[0] < 0) {
                throw new Error('Factorial requires non-negative integer');
            }
            return MathUtils.factorial(args[0]);
        
        case 'nPr':
            return MathUtils.permutation(args[0], args[1]);
        
        case 'nCr':
            return MathUtils.combination(args[0], args[1]);
            
        default:
            throw new Error(`Unknown operator: ${operator}`);
    }
}

/**
 * Evaluate RPN tokens
 */
function evaluate(rpnTokens, context = {}) {
    const stack = [];
    const angleUnit = context.angleUnit || window.calculatorState?.angleUnit || 'DEG';
    const memory = context.memory || window.calculatorState?.memory || {};
    
    for (let i = 0; i < rpnTokens.length; i++) {
        const token = rpnTokens[i];
        
        switch (token.type) {
            case TokenType.NUMBER:
                stack.push(token.value);
                break;
                
            case TokenType.CONSTANT:
                if (CONSTANTS[token.value] !== undefined) {
                    stack.push(CONSTANTS[token.value]);
                } else {
                    throw new Error(`Unknown constant: ${token.value}`);
                }
                break;
                
            case TokenType.VARIABLE:
                // Look up variable in memory
                const varValue = memory[token.value];
                if (varValue !== null && varValue !== undefined) {
                    stack.push(varValue);
                } else {
                    throw new Error(`Undefined variable: ${token.value}`);
                }
                break;
                
            case TokenType.OPERATOR:
                if (stack.length < 2) {
                    throw new Error('Insufficient operands for operator');
                }
                const b = stack.pop();
                const a = stack.pop();
                const result = evaluateOperation(token.value, [a, b], angleUnit);
                stack.push(result);
                break;
                
            case TokenType.FUNCTION:
                const funcInfo = FUNCTIONS[token.value];
                if (!funcInfo) {
                    throw new Error(`Unknown function: ${token.value}`);
                }
                
                if (stack.length < funcInfo.args) {
                    throw new Error(`Insufficient arguments for function ${token.value}`);
                }
                
                const args = [];
                for (let j = 0; j < funcInfo.args; j++) {
                    args.unshift(stack.pop());
                }
                
                const funcResult = evaluateOperation(token.value, args, angleUnit);
                stack.push(funcResult);
                break;
                
            default:
                throw new Error(`Unknown token type: ${token.type}`);
        }
    }
    
    if (stack.length !== 1) {
        throw new Error('Invalid expression: stack has ' + stack.length + ' items');
    }
    
    return stack[0];
}

/**
 * Evaluate an expression string (main entry point)
 */
function evaluateExpression(expression, context = {}) {
    try {
        console.log('📊 Evaluating expression:', expression);
        
        // Parse to RPN
        const rpn = parse(expression);
        
        // Evaluate RPN
        const result = evaluate(rpn, context);
        
        console.log('✅ Result:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Evaluation error:', error.message);
        throw error;
    }
}

/**
 * Helper: Evaluate with current calculator state
 */
function evaluateWithState(expression) {
    const state = window.calculatorState;
    return evaluateExpression(expression, {
        angleUnit: state.angleUnit,
        memory: state.memory
    });
}

// Export functions
window.evaluate = evaluate;
window.evaluateExpression = evaluateExpression;
window.evaluateWithState = evaluateWithState;
window.evaluateOperation = evaluateOperation;