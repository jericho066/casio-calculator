/**
 * Math Engine - Utilities
 * Factorial, combinations, permutations, and other utility functions
 */

/**
 * Calculate factorial using iteration (faster for small numbers)
 * For n > 170, use Stirling's approximation or return Infinity
 */
function factorial(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error('Factorial requires non-negative integer');
    }
    
    if (n === 0 || n === 1) return 1;
    
    // For large numbers, use Stirling's approximation or limit
    if (n > 170) {
        // JavaScript can't handle factorials > 170!
        return Infinity;
    }
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    
    return result;
}

/**
 * Calculate factorial using BigInt for exact large values
 */
function factorialBigInt(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error('Factorial requires non-negative integer');
    }
    
    if (n === 0 || n === 1) return 1n;
    
    let result = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
        result *= i;
    }
    
    return result;
}

/**
 * Gamma function using Lanczos approximation
 * Extends factorial to real numbers: Γ(n) = (n-1)!
 */
function gamma(z) {
    // Lanczos approximation coefficients
    const g = 7;
    const coef = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];
    
    if (z < 0.5) {
        // Reflection formula: Γ(1-z)Γ(z) = π/sin(πz)
        return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }
    
    z -= 1;
    let x = coef[0];
    for (let i = 1; i < g + 2; i++) {
        x += coef[i] / (z + i);
    }
    
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

/**
 * Permutations: nPr = n! / (n-r)!
 * Number of ways to arrange r items from n items (order matters)
 */
function permutation(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r)) {
        throw new Error('Permutation requires integers');
    }
    
    if (n < 0 || r < 0) {
        throw new Error('Permutation requires non-negative values');
    }
    
    if (r > n) {
        return 0;
    }
    
    if (r === 0) return 1;
    
    // Calculate n!/(n-r)! more efficiently
    let result = 1;
    for (let i = n; i > n - r; i--) {
        result *= i;
    }
    
    return result;
}

/**
 * Combinations: nCr = n! / (r!(n-r)!)
 * Number of ways to choose r items from n items (order doesn't matter)
 */
function combination(n, r) {
    if (!Number.isInteger(n) || !Number.isInteger(r)) {
        throw new Error('Combination requires integers');
    }
    
    if (n < 0 || r < 0) {
        throw new Error('Combination requires non-negative values');
    }
    
    if (r > n) {
        return 0;
    }
    
    if (r === 0 || r === n) return 1;
    
    // Optimize: C(n,r) = C(n,n-r), use smaller r
    if (r > n - r) {
        r = n - r;
    }
    
    // Calculate more efficiently to avoid overflow
    let result = 1;
    for (let i = 0; i < r; i++) {
        result *= (n - i);
        result /= (i + 1);
    }
    
    return Math.round(result); // Round to handle floating point errors
}

/**
 * Greatest Common Divisor using Euclidean algorithm
 */
function gcd(a, b) {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    
    return a;
}

/**
 * Least Common Multiple
 */
function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(Math.floor(a * b)) / gcd(a, b);
}

/**
 * Random number generator (0 to 1)
 */
function random() {
    return Math.random();
}

/**
 * Random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Round to n decimal places
 */
function roundTo(value, decimals) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Check if number is prime
 */
function isPrime(n) {
    if (!Number.isInteger(n) || n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) {
        if (n % i === 0) return false;
    }
    
    return true;
}

/**
 * Prime factorization
 */
function primeFactors(n) {
    if (!Number.isInteger(n) || n < 2) {
        throw new Error('Prime factorization requires integer >= 2');
    }
    
    const factors = [];
    let divisor = 2;
    
    while (n >= 2) {
        if (n % divisor === 0) {
            factors.push(divisor);
            n = n / divisor;
        } else {
            divisor++;
        }
    }
    
    return factors;
}

/**
 * Absolute value
 */
function abs(x) {
    return Math.abs(x);
}

/**
 * Sign function
 */
function sign(x) {
    return Math.sign(x);
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Convert angle units
 */
function convertAngle(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    
    // Convert to radians first
    let radians;
    switch (fromUnit) {
        case 'DEG':
            radians = value * (Math.PI / 180);
            break;
        case 'RAD':
            radians = value;
            break;
        case 'GRAD':
            radians = value * (Math.PI / 200);
            break;
        default:
            radians = value;
    }
    
    // Convert from radians to target
    switch (toUnit) {
        case 'DEG':
            return radians * (180 / Math.PI);
        case 'RAD':
            return radians;
        case 'GRAD':
            return radians * (200 / Math.PI);
        default:
            return radians;
    }
}


// Export all functions
window.MathUtils = {
    factorial,
    factorialBigInt,
    gamma,
    permutation,
    combination,
    gcd,
    lcm,
    random,
    randomInt,
    roundTo,
    isPrime,
    primeFactors,
    abs,
    sign,
    clamp,
    lerp,
    convertAngle
};
