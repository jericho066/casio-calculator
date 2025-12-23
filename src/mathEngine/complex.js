/**
 * Complex Number Operations
 * Supports rectangular (a+bi) and polar (r∠θ) forms
 */

class Complex {
    constructor(real = 0, imag = 0) {
        this.real = real;
        this.imag = imag;
    }
    
    /**
     * Create from polar coordinates (r, θ)
     */
    static fromPolar(r, theta) {
        return new Complex(
            r * Math.cos(theta),
            r * Math.sin(theta)
        );
    }
    
    /**
     * Get magnitude (absolute value, modulus)
     */
    magnitude() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }
    
    /**
     * Get argument (angle, phase) in radians
     */
    argument() {
        return Math.atan2(this.imag, this.real);
    }
    
    /**
     * Convert to polar form
     */
    toPolar() {
        return {
            r: this.magnitude(),
            theta: this.argument()
        };
    }
    
    /**
     * Complex conjugate (a + bi → a - bi)
     */
    conjugate() {
        return new Complex(this.real, -this.imag);
    }
    
    /**
     * Addition
     */
    add(other) {
        if (typeof other === 'number') {
            return new Complex(this.real + other, this.imag);
        }
        return new Complex(this.real + other.real, this.imag + other.imag);
    }
    
    /**
     * Subtraction
     */
    subtract(other) {
        if (typeof other === 'number') {
            return new Complex(this.real - other, this.imag);
        }
        return new Complex(this.real - other.real, this.imag - other.imag);
    }
    
    /**
     * Multiplication
     */
    multiply(other) {
        if (typeof other === 'number') {
            return new Complex(this.real * other, this.imag * other);
        }
        // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }
    
    /**
     * Division
     */
    divide(other) {
        if (typeof other === 'number') {
            if (other === 0) throw new Error('Division by zero');
            return new Complex(this.real / other, this.imag / other);
        }
        
        const denominator = other.real * other.real + other.imag * other.imag;
        if (denominator === 0) throw new Error('Division by zero');
        
        // (a+bi)/(c+di) = [(a+bi)(c-di)] / (c²+d²)
        return new Complex(
            (this.real * other.real + this.imag * other.imag) / denominator,
            (this.imag * other.real - this.real * other.imag) / denominator
        );
    }
    
    /**
     * Power (complex exponentiation)
     */
    pow(n) {
        if (typeof n === 'number' && Number.isInteger(n)) {
            // For integer powers, use repeated multiplication
            if (n === 0) return new Complex(1, 0);
            if (n < 0) return new Complex(1, 0).divide(this.pow(-n));
            
            let result = new Complex(1, 0);
            for (let i = 0; i < n; i++) {
                result = result.multiply(this);
            }
            return result;
        }
        
        // For non-integer powers, use polar form
        // z^n = r^n * e^(iθn) = r^n(cos(θn) + i*sin(θn))
        const polar = this.toPolar();
        const newR = Math.pow(polar.r, n);
        const newTheta = polar.theta * n;
        
        return Complex.fromPolar(newR, newTheta);
    }
    
    /**
     * Square root
     */
    sqrt() {
        const r = this.magnitude();
        const theta = this.argument();
        
        return Complex.fromPolar(Math.sqrt(r), theta / 2);
    }
    
    /**
     * Natural logarithm
     */
    log() {
        return new Complex(
            Math.log(this.magnitude()),
            this.argument()
        );
    }
    
    /**
     * Exponential (e^z)
     */
    exp() {
        const expReal = Math.exp(this.real);
        return new Complex(
            expReal * Math.cos(this.imag),
            expReal * Math.sin(this.imag)
        );
    }
    
    /**
     * Sine
     */
    sin() {
        // sin(a+bi) = sin(a)cosh(b) + i*cos(a)sinh(b)
        return new Complex(
            Math.sin(this.real) * Math.cosh(this.imag),
            Math.cos(this.real) * Math.sinh(this.imag)
        );
    }
    
    /**
     * Cosine
     */
    cos() {
        // cos(a+bi) = cos(a)cosh(b) - i*sin(a)sinh(b)
        return new Complex(
            Math.cos(this.real) * Math.cosh(this.imag),
            -Math.sin(this.real) * Math.sinh(this.imag)
        );
    }
    
    /**
     * Tangent
     */
    tan() {
        return this.sin().divide(this.cos());
    }
    
    /**
     * Check if purely real
     */
    isReal() {
        return Math.abs(this.imag) < 1e-10;
    }
    
    /**
     * Check if purely imaginary
     */
    isImaginary() {
        return Math.abs(this.real) < 1e-10 && Math.abs(this.imag) >= 1e-10;
    }
    
    /**
     * Check equality
     */
    equals(other, tolerance = 1e-10) {
        return Math.abs(this.real - other.real) < tolerance &&
               Math.abs(this.imag - other.imag) < tolerance;
    }
    
    /**
     * String representation
     */
    toString() {
        if (this.isReal()) {
            return this.real.toString();
        }
        
        if (Math.abs(this.real) < 1e-10) {
            return `${this.imag}i`;
        }
        
        const sign = this.imag >= 0 ? '+' : '';
        return `${this.real}${sign}${this.imag}i`;
    }
    
    /**
     * Clone
     */
    clone() {
        return new Complex(this.real, this.imag);
    }
}

/**
 * Helper functions for complex operations
 */
const ComplexMath = {
    /**
     * Create complex number from string
     */
    parse(str) {
        // Handle formats: "3+4i", "3-4i", "5", "2i"
        str = str.replace(/\s/g, '');
        
        // Pure real
        if (!str.includes('i')) {
            return new Complex(parseFloat(str), 0);
        }
        
        // Pure imaginary
        if (str === 'i') {
            return new Complex(0, 1);
        }
        if (str === '-i') {
            return new Complex(0, -1);
        }
        if (!str.includes('+') && !str.includes('-', 1)) {
            return new Complex(0, parseFloat(str.replace('i', '')));
        }
        
        // Complex
        const match = str.match(/^([+-]?\d*\.?\d+)([+-]\d*\.?\d*)i$/);
        if (match) {
            return new Complex(parseFloat(match[1]), parseFloat(match[2]));
        }
        
        throw new Error('Invalid complex number format');
    },
    
    /**
     * Rectangular to Polar conversion
     */
    rectToPolar(real, imag) {
        const r = Math.sqrt(real * real + imag * imag);
        const theta = Math.atan2(imag, real);
        return { r, theta };
    },
    
    /**
     * Polar to Rectangular conversion
     */
    polarToRect(r, theta) {
        return {
            real: r * Math.cos(theta),
            imag: r * Math.sin(theta)
        };
    }
};

// Export
window.Complex = Complex;
window.ComplexMath = ComplexMath;
