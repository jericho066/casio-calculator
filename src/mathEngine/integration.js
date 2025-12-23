/**
 * Numerical Integration Module
 * Implements adaptive Simpson's rule for definite integrals
 */

/**
 * Simpson's rule for a single interval
 * ∫[a,b] f(x)dx ≈ (b-a)/6 * [f(a) + 4f((a+b)/2) + f(b)]
 */
function simpsonsRule(f, a, b) {
    const h = b - a;
    const c = (a + b) / 2;
    
    try {
        const fa = f(a);
        const fb = f(b);
        const fc = f(c);
        
        if (!isFinite(fa) || !isFinite(fb) || !isFinite(fc)) {
            throw new Error('Function returned non-finite value');
        }
        
        return (h / 6) * (fa + 4 * fc + fb);
    } catch (error) {
        throw new Error(`Integration failed: ${error.message}`);
    }
}

/**
 * Adaptive Simpson's rule (recursive)
 * Automatically adjusts step size for better accuracy
 */
function adaptiveSimpson(f, a, b, epsilon, S, fa, fb, fc, depth) {
    const c = (a + b) / 2;
    const h = b - a;
    const d = (a + c) / 2;
    const e = (c + b) / 2;
    
    try {
        const fd = f(d);
        const fe = f(e);
        
        if (!isFinite(fd) || !isFinite(fe)) {
            throw new Error('Function returned non-finite value');
        }
        
        const Sleft = (h / 12) * (fa + 4 * fd + fc);
        const Sright = (h / 12) * (fc + 4 * fe + fb);
        const S2 = Sleft + Sright;
        
        // Check if we've reached sufficient accuracy or max depth
        if (depth <= 0 || Math.abs(S2 - S) <= 15 * epsilon) {
            return S2 + (S2 - S) / 15;
        }
        
        // Recursively refine both halves
        return adaptiveSimpson(f, a, c, epsilon / 2, Sleft, fa, fc, fd, depth - 1) +
               adaptiveSimpson(f, c, b, epsilon / 2, Sright, fc, fb, fe, depth - 1);
    } catch (error) {
        throw error;
    }
}

/**
 * Main integration function
 * @param {Function|String} func - Function to integrate (or expression string)
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @param {Object} options - Integration options
 * @returns {number} - Approximate integral value
 */
function integrate(func, a, b, options = {}) {
    const {
        tolerance = 1e-8,
        maxDepth = 20,
        variable = 'x'
    } = options;
    
    // Convert string expression to function if needed
    let f;
    if (typeof func === 'string') {
        f = createFunctionFromExpression(func, variable);
    } else if (typeof func === 'function') {
        f = func;
    } else {
        throw new Error('Invalid function type');
    }
    
    // Validate bounds
    if (!isFinite(a) || !isFinite(b)) {
        throw new Error('Integration bounds must be finite');
    }
    
    if (a === b) {
        return 0;
    }
    
    // Swap bounds if needed and negate result
    if (a > b) {
        return -integrate(func, b, a, options);
    }
    
    // Check for singularities at bounds
    try {
        const fa = f(a);
        const fb = f(b);
        const fc = f((a + b) / 2);
        
        if (!isFinite(fa) || !isFinite(fb) || !isFinite(fc)) {
            throw new Error('Function has singularity at or near bounds');
        }
        
        // Calculate initial Simpson's rule estimate
        const h = b - a;
        const S = (h / 6) * (fa + 4 * fc + fb);
        
        // Apply adaptive Simpson's rule
        const result = adaptiveSimpson(f, a, b, tolerance, S, fa, fb, fc, maxDepth);
        
        return result;
        
    } catch (error) {
        throw new Error(`Integration error: ${error.message}`);
    }
}

/**
 * Create a function from an expression string
 */
function createFunctionFromExpression(expression, variable = 'x') {
    return (value) => {
        // Save original state
        const state = window.calculatorState;
        const originalMemory = { ...state.memory };
        
        // Set variable value
        state.memory[variable.toUpperCase()] = value;
        
        try {
            // Evaluate expression
            const result = evaluateWithState(expression);
            
            // Restore memory
            state.memory = originalMemory;
            
            return result;
        } catch (error) {
            // Restore memory
            state.memory = originalMemory;
            throw error;
        }
    };
}

/**
 * Trapezoidal rule (simpler, less accurate alternative)
 */
function trapezoidalRule(f, a, b, n = 100) {
    const h = (b - a) / n;
    let sum = (f(a) + f(b)) / 2;
    
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += f(x);
    }
    
    return h * sum;
}

/**
 * Romberg integration (even more accurate, but slower)
 */
function rombergIntegration(f, a, b, maxSteps = 10, tolerance = 1e-10) {
    const R = Array(maxSteps).fill(0).map(() => Array(maxSteps).fill(0));
    
    // First approximation using trapezoidal rule
    R[0][0] = (b - a) * (f(a) + f(b)) / 2;
    
    let powerOf4 = 1;
    
    for (let i = 1; i < maxSteps; i++) {
        // Refined trapezoidal approximation
        const h = (b - a) / Math.pow(2, i);
        let sum = 0;
        
        for (let k = 1; k <= Math.pow(2, i - 1); k++) {
            sum += f(a + (2 * k - 1) * h);
        }
        
        R[i][0] = R[i - 1][0] / 2 + h * sum;
        
        // Richardson extrapolation
        powerOf4 = 4;
        for (let j = 1; j <= i; j++) {
            R[i][j] = (powerOf4 * R[i][j - 1] - R[i - 1][j - 1]) / (powerOf4 - 1);
            powerOf4 *= 4;
        }
        
        // Check convergence
        if (i > 1 && Math.abs(R[i][i] - R[i - 1][i - 1]) < tolerance) {
            return R[i][i];
        }
    }
    
    return R[maxSteps - 1][maxSteps - 1];
}

/**
 * Test if a function has discontinuities in an interval
 */
function detectDiscontinuities(f, a, b, samples = 100) {
    const discontinuities = [];
    const step = (b - a) / samples;
    
    for (let i = 0; i < samples; i++) {
        const x = a + i * step;
        try {
            const y = f(x);
            if (!isFinite(y)) {
                discontinuities.push(x);
            }
        } catch (error) {
            discontinuities.push(x);
        }
    }
    
    return discontinuities;
}

/**
 * Convenience function for common integrals
 */
const IntegrationHelpers = {
    /**
     * Integrate polynomial
     */
    polynomial(coefficients, a, b) {
        // coefficients = [a0, a1, a2, ...] for a0 + a1*x + a2*x^2 + ...
        return integrate(x => {
            let sum = 0;
            for (let i = 0; i < coefficients.length; i++) {
                sum += coefficients[i] * Math.pow(x, i);
            }
            return sum;
        }, a, b);
    },
    
    /**
     * Integrate common trig functions
     */
    sin(a, b) {
        // ∫sin(x)dx = -cos(x)
        return Math.cos(a) - Math.cos(b);
    },
    
    cos(a, b) {
        // ∫cos(x)dx = sin(x)
        return Math.sin(b) - Math.sin(a);
    }
};

// Export functions
window.integrate = integrate;
window.simpsonsRule = simpsonsRule;
window.trapezoidalRule = trapezoidalRule;
window.rombergIntegration = rombergIntegration;
window.detectDiscontinuities = detectDiscontinuities;
window.IntegrationHelpers = IntegrationHelpers;

