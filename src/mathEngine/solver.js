/**
 * Numerical Equation Solver
 * Implements various root-finding algorithms
 */

/**
 * Bisection method (most robust, guaranteed convergence)
 * Finds root of f(x) = 0 in interval [a, b]
 */
function bisection(f, a, b, options = {}) {
    const {
        tolerance = 1e-8,
        maxIterations = 100
    } = options;
    
    let fa = f(a);
    let fb = f(b);
    
    // Check if bounds contain a root
    if (fa * fb > 0) {
        throw new Error('Function must have different signs at bounds');
    }
    
    // Check if one bound is already a root
    if (Math.abs(fa) < tolerance) return a;
    if (Math.abs(fb) < tolerance) return b;
    
    let iterations = 0;
    
    while (iterations < maxIterations) {
        const c = (a + b) / 2;
        const fc = f(c);
        
        if (Math.abs(fc) < tolerance || Math.abs(b - a) < tolerance) {
            return c;
        }
        
        if (fa * fc < 0) {
            b = c;
            fb = fc;
        } else {
            a = c;
            fa = fc;
        }
        
        iterations++;
    }
    
    return (a + b) / 2;
}

/**
 * Newton-Raphson method (faster, requires derivative)
 * x_{n+1} = x_n - f(x_n)/f'(x_n)
 */
function newton(f, x0, options = {}) {
    const {
        tolerance = 1e-8,
        maxIterations = 100,
        derivative = null,
        h = 1e-7  // Step size for numerical derivative
    } = options;
    
    // Numerical derivative if not provided
    const df = derivative || ((x) => (f(x + h) - f(x - h)) / (2 * h));
    
    let x = x0;
    let iterations = 0;
    
    while (iterations < maxIterations) {
        const fx = f(x);
        
        if (Math.abs(fx) < tolerance) {
            return x;
        }
        
        const dfx = df(x);
        
        if (Math.abs(dfx) < 1e-12) {
            throw new Error('Derivative too small, Newton method failed');
        }
        
        const xNew = x - fx / dfx;
        
        if (Math.abs(xNew - x) < tolerance) {
            return xNew;
        }
        
        x = xNew;
        iterations++;
    }
    
    throw new Error('Newton method did not converge');
}

/**
 * Secant method (like Newton but doesn't need derivative)
 * x_{n+1} = x_n - f(x_n) * (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))
 */
function secant(f, x0, x1, options = {}) {
    const {
        tolerance = 1e-8,
        maxIterations = 100
    } = options;
    
    let iterations = 0;
    
    while (iterations < maxIterations) {
        const fx0 = f(x0);
        const fx1 = f(x1);
        
        if (Math.abs(fx1) < tolerance) {
            return x1;
        }
        
        if (Math.abs(fx1 - fx0) < 1e-12) {
            throw new Error('Division by zero in secant method');
        }
        
        const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
        
        if (Math.abs(x2 - x1) < tolerance) {
            return x2;
        }
        
        x0 = x1;
        x1 = x2;
        iterations++;
    }
    
    throw new Error('Secant method did not converge');
}

/**
 * Brent's method (combination of bisection, secant, and inverse quadratic)
 * Most robust general-purpose root finder
 */
function brent(f, a, b, options = {}) {
    const {
        tolerance = 1e-8,
        maxIterations = 100
    } = options;
    
    let fa = f(a);
    let fb = f(b);
    
    if (fa * fb > 0) {
        throw new Error('Function must have different signs at bounds');
    }
    
    if (Math.abs(fa) < Math.abs(fb)) {
        [a, b] = [b, a];
        [fa, fb] = [fb, fa];
    }
    
    let c = a;
    let fc = fa;
    let d = b - a;
    let e = d;
    
    for (let iter = 0; iter < maxIterations; iter++) {
        if (Math.abs(fb) < tolerance) {
            return b;
        }
        
        if (fa * fb > 0) {
            c = a;
            fc = fa;
            d = e = b - a;
        }
        
        if (Math.abs(fc) < Math.abs(fb)) {
            a = b;
            b = c;
            c = a;
            fa = fb;
            fb = fc;
            fc = fa;
        }
        
        const tol1 = 2 * tolerance * Math.abs(b) + tolerance / 2;
        const xm = (c - b) / 2;
        
        if (Math.abs(xm) <= tol1 || fb === 0) {
            return b;
        }
        
        if (Math.abs(e) >= tol1 && Math.abs(fa) > Math.abs(fb)) {
            // Try inverse quadratic interpolation
            const s = fb / fa;
            let p, q;
            
            if (a === c) {
                p = 2 * xm * s;
                q = 1 - s;
            } else {
                const q1 = fa / fc;
                const q2 = fb / fc;
                p = s * (2 * xm * q1 * (q1 - q2) - (b - a) * (q2 - 1));
                q = (q1 - 1) * (q2 - 1) * (s - 1);
            }
            
            if (p > 0) {
                q = -q;
            } else {
                p = -p;
            }
            
            const s_val = e;
            e = d;
            
            if (2 * p < 3 * xm * q - Math.abs(tol1 * q) && 
                p < Math.abs(0.5 * s_val * q)) {
                d = p / q;
            } else {
                d = xm;
                e = d;
            }
        } else {
            d = xm;
            e = d;
        }
        
        a = b;
        fa = fb;
        
        if (Math.abs(d) > tol1) {
            b += d;
        } else {
            b += xm > 0 ? tol1 : -tol1;
        }
        
        fb = f(b);
    }
    
    throw new Error('Brent method did not converge');
}

/**
 * Solve equation from expression string
 */
function solve(expression, variable = 'x', initialGuess = 0, options = {}) {
    const {
        method = 'brent',
        bounds = null,
        tolerance = 1e-8,
        maxIterations = 100
    } = options;
    
    // Create function from expression
    const f = (value) => {
        const state = window.calculatorState;
        const originalMemory = { ...state.memory };
        
        state.memory[variable.toUpperCase()] = value;
        
        try {
            const result = evaluateWithState(expression);
            state.memory = originalMemory;
            return result;
        } catch (error) {
            state.memory = originalMemory;
            throw error;
        }
    };
    
    // Choose solving method
    try {
        switch (method) {
            case 'bisection':
                if (!bounds || bounds.length !== 2) {
                    throw new Error('Bisection requires bounds [a, b]');
                }
                return bisection(f, bounds[0], bounds[1], { tolerance, maxIterations });
                
            case 'newton':
                return newton(f, initialGuess, { tolerance, maxIterations });
                
            case 'secant':
                const x1 = bounds && bounds.length >= 2 ? bounds[1] : initialGuess + 1;
                return secant(f, initialGuess, x1, { tolerance, maxIterations });
                
            case 'brent':
            default:
                // Auto-determine bounds if not provided
                let [a, b] = bounds || [initialGuess - 10, initialGuess + 10];
                
                // Try to find bounds with opposite signs
                let fa = f(a);
                let fb = f(b);
                
                if (fa * fb > 0) {
                    // Try expanding search
                    let found = false;
                    for (let i = 1; i <= 10; i++) {
                        const range = i * 10;
                        a = initialGuess - range;
                        b = initialGuess + range;
                        fa = f(a);
                        fb = f(b);
                        if (fa * fb <= 0) {
                            found = true;
                            break;
                        }
                    }
                    
                    if (!found) {
                        // Fall back to Newton method
                        return newton(f, initialGuess, { tolerance, maxIterations });
                    }
                }
                
                return brent(f, a, b, { tolerance, maxIterations });
        }
    } catch (error) {
        throw new Error(`Solver error: ${error.message}`);
    }
}

/**
 * Find all roots in an interval (experimental)
 */
function findAllRoots(f, a, b, options = {}) {
    const {
        divisions = 20,
        tolerance = 1e-8
    } = options;
    
    const roots = [];
    const step = (b - a) / divisions;
    
    for (let i = 0; i < divisions; i++) {
        const x1 = a + i * step;
        const x2 = a + (i + 1) * step;
        
        try {
            const root = brent(f, x1, x2, { tolerance });
            
            // Check if this root is new (not close to existing roots)
            const isNew = roots.every(r => Math.abs(r - root) > tolerance * 10);
            
            if (isNew) {
                roots.push(root);
            }
        } catch (error) {
            // No root in this interval, continue
        }
    }
    
    return roots;
}

// Export functions
window.bisection = bisection;
window.newton = newton;
window.secant = secant;
window.brent = brent;
window.solve = solve;
window.findAllRoots = findAllRoots;

