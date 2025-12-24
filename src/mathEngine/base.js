/**
 * Base Conversion Module
 * Supports BIN (binary), OCT (octal), DEC (decimal), HEX (hexadecimal)
 * and bitwise operations
 */

class BaseConverter {
    constructor() {
        this.currentBase = 'DEC';  // DEC, BIN, OCT, HEX
        this.wordSize = 32;  // 8, 16, 32, or 64 bits
    }
    
    /**
     * Set current base
     */
    setBase(base) {
        const validBases = ['BIN', 'OCT', 'DEC', 'HEX'];
        if (!validBases.includes(base)) {
            throw new Error('Invalid base. Must be BIN, OCT, DEC, or HEX');
        }
        this.currentBase = base;
    }
    
    /**
     * Set word size for bitwise operations
     */
    setWordSize(size) {
        const validSizes = [8, 16, 32, 64];
        if (!validSizes.includes(size)) {
            throw new Error('Invalid word size. Must be 8, 16, 32, or 64');
        }
        this.wordSize = size;
    }
    
    /**
     * Convert from any base to decimal
     */
    toDecimal(value, fromBase = null) {
        const base = fromBase || this.currentBase;
        
        // If already a number, return it
        if (typeof value === 'number') {
            return Math.floor(value);
        }
        
        // Convert string to decimal
        const str = String(value).toUpperCase().replace(/\s/g, '');
        
        switch (base) {
            case 'BIN':
                if (!/^[01]+$/.test(str)) {
                    throw new Error('Invalid binary number');
                }
                return parseInt(str, 2);
                
            case 'OCT':
                if (!/^[0-7]+$/.test(str)) {
                    throw new Error('Invalid octal number');
                }
                return parseInt(str, 8);
                
            case 'DEC':
                if (!/^-?\d+$/.test(str)) {
                    throw new Error('Invalid decimal number');
                }
                return parseInt(str, 10);
                
            case 'HEX':
                if (!/^[0-9A-F]+$/.test(str)) {
                    throw new Error('Invalid hexadecimal number');
                }
                return parseInt(str, 16);
                
            default:
                throw new Error('Invalid base');
        }
    }
    
    /**
     * Convert from decimal to any base
     */
    fromDecimal(value, toBase = null) {
        const base = toBase || this.currentBase;
        const num = Math.floor(value);
        
        switch (base) {
            case 'BIN':
                return num.toString(2);
                
            case 'OCT':
                return num.toString(8);
                
            case 'DEC':
                return num.toString(10);
                
            case 'HEX':
                return num.toString(16).toUpperCase();
                
            default:
                throw new Error('Invalid base');
        }
    }
    
    /**
     * Convert between any two bases
     */
    convert(value, fromBase, toBase) {
        const decimal = this.toDecimal(value, fromBase);
        return this.fromDecimal(decimal, toBase);
    }
    
    /**
     * Apply two's complement for negative numbers
     */
    toTwosComplement(value) {
        if (value >= 0) return value;
        
        const maxVal = Math.pow(2, this.wordSize);
        return maxVal + value;
    }
    
    /**
     * Convert from two's complement to signed integer
     */
    fromTwosComplement(value) {
        const maxVal = Math.pow(2, this.wordSize);
        const signBit = Math.pow(2, this.wordSize - 1);
        
        if (value >= signBit) {
            return value - maxVal;
        }
        return value;
    }
    
    /**
     * Bitwise AND
     */
    and(a, b) {
        const decA = this.toDecimal(a);
        const decB = this.toDecimal(b);
        return decA & decB;
    }
    
    /**
     * Bitwise OR
     */
    or(a, b) {
        const decA = this.toDecimal(a);
        const decB = this.toDecimal(b);
        return decA | decB;
    }
    
    /**
     * Bitwise XOR
     */
    xor(a, b) {
        const decA = this.toDecimal(a);
        const decB = this.toDecimal(b);
        return decA ^ decB;
    }
    
    /**
     * Bitwise NOT (one's complement)
     */
    not(a) {
        const decA = this.toDecimal(a);
        const mask = Math.pow(2, this.wordSize) - 1;
        return (~decA) & mask;
    }
    
    /**
     * Bitwise NAND
     */
    nand(a, b) {
        return this.not(this.and(a, b));
    }
    
    /**
     * Bitwise NOR
     */
    nor(a, b) {
        return this.not(this.or(a, b));
    }
    
    /**
     * Bitwise XNOR
     */
    xnor(a, b) {
        return this.not(this.xor(a, b));
    }
    
    /**
     * Left shift (<<)
     */
    shiftLeft(value, positions) {
        const dec = this.toDecimal(value);
        const mask = Math.pow(2, this.wordSize) - 1;
        return (dec << positions) & mask;
    }
    
    /**
     * Right shift (>>)
     */
    shiftRight(value, positions) {
        const dec = this.toDecimal(value);
        return dec >> positions;
    }
    
    /**
     * Unsigned right shift (>>>)
     */
    shiftRightUnsigned(value, positions) {
        const dec = this.toDecimal(value);
        return dec >>> positions;
    }
    
    /**
     * Rotate left (circular shift)
     */
    rotateLeft(value, positions) {
        const dec = this.toDecimal(value);
        const mask = Math.pow(2, this.wordSize) - 1;
        positions = positions % this.wordSize;
        
        const shifted = (dec << positions) & mask;
        const wrapped = dec >>> (this.wordSize - positions);
        
        return (shifted | wrapped) & mask;
    }
    
    /**
     * Rotate right (circular shift)
     */
    rotateRight(value, positions) {
        const dec = this.toDecimal(value);
        const mask = Math.pow(2, this.wordSize) - 1;
        positions = positions % this.wordSize;
        
        const shifted = dec >>> positions;
        const wrapped = (dec << (this.wordSize - positions)) & mask;
        
        return shifted | wrapped;
    }
    
    /**
     * Count number of set bits (population count)
     */
    popCount(value) {
        let dec = this.toDecimal(value);
        let count = 0;
        
        while (dec > 0) {
            count += dec & 1;
            dec >>>= 1;
        }
        
        return count;
    }
    
    /**
     * Find position of least significant bit (rightmost set bit)
     */
    lsb(value) {
        const dec = this.toDecimal(value);
        if (dec === 0) return -1;
        
        let pos = 0;
        let temp = dec;
        
        while ((temp & 1) === 0) {
            temp >>>= 1;
            pos++;
        }
        
        return pos;
    }
    
    /**
     * Find position of most significant bit (leftmost set bit)
     */
    msb(value) {
        let dec = this.toDecimal(value);
        if (dec === 0) return -1;
        
        let pos = 0;
        
        while (dec > 1) {
            dec >>>= 1;
            pos++;
        }
        
        return pos;
    }
    
    /**
     * Check if a specific bit is set
     */
    isBitSet(value, position) {
        const dec = this.toDecimal(value);
        return ((dec >> position) & 1) === 1;
    }
    
    /**
     * Set a specific bit
     */
    setBit(value, position) {
        const dec = this.toDecimal(value);
        const mask = Math.pow(2, this.wordSize) - 1;
        return (dec | (1 << position)) & mask;
    }
    
    /**
     * Clear a specific bit
     */
    clearBit(value, position) {
        const dec = this.toDecimal(value);
        const mask = Math.pow(2, this.wordSize) - 1;
        return (dec & ~(1 << position)) & mask;
    }
    
    /**
     * Toggle a specific bit
     */
    toggleBit(value, position) {
        const dec = this.toDecimal(value);
        const mask = Math.pow(2, this.wordSize) - 1;
        return (dec ^ (1 << position)) & mask;
    }
    
    /**
     * Format number with current base
     */
    format(value) {
        const dec = this.toDecimal(value);
        return this.fromDecimal(dec);
    }
    
    /**
     * Get display string with prefix
     */
    formatWithPrefix(value) {
        const formatted = this.format(value);
        
        switch (this.currentBase) {
            case 'BIN':
                return '0b' + formatted;
            case 'OCT':
                return '0o' + formatted;
            case 'DEC':
                return formatted;
            case 'HEX':
                return '0x' + formatted;
            default:
                return formatted;
        }
    }
}

/**
 * Helper functions for base conversions
 */
const BaseHelpers = {
    /**
     * Quick conversions
     */
    binToDec: (bin) => parseInt(String(bin), 2),
    octToDec: (oct) => parseInt(String(oct), 8),
    hexToDec: (hex) => parseInt(String(hex), 16),
    
    decToBin: (dec) => Math.floor(dec).toString(2),
    decToOct: (dec) => Math.floor(dec).toString(8),
    decToHex: (dec) => Math.floor(dec).toString(16).toUpperCase(),
    
    binToHex: (bin) => parseInt(String(bin), 2).toString(16).toUpperCase(),
    hexToBin: (hex) => parseInt(String(hex), 16).toString(2),
    
    /**
     * Validate base format
     */
    isValidBinary: (str) => /^[01]+$/.test(String(str)),
    isValidOctal: (str) => /^[0-7]+$/.test(String(str)),
    isValidDecimal: (str) => /^-?\d+$/.test(String(str)),
    isValidHex: (str) => /^[0-9A-Fa-f]+$/.test(String(str)),
    
    /**
     * ASCII conversions
     */
    charToHex: (char) => char.charCodeAt(0).toString(16).toUpperCase(),
    hexToChar: (hex) => String.fromCharCode(parseInt(hex, 16)),
    
    stringToHex: (str) => {
        return Array.from(str)
            .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('').toUpperCase();
    },
    
    hexToString: (hex) => {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    },
    
    /**
     * Bitwise operations (standalone)
     */
    and: (a, b) => a & b,
    or: (a, b) => a | b,
    xor: (a, b) => a ^ b,
    not: (a, bits = 32) => (~a) & (Math.pow(2, bits) - 1),
    
    /**
     * Gray code conversion
     */
    binaryToGray: (binary) => binary ^ (binary >> 1),
    grayToBinary: (gray) => {
        let binary = gray;
        while (gray >>= 1) {
            binary ^= gray;
        }
        return binary;
    }
};

// Create global instance
const baseConverter = new BaseConverter();

// Export
window.BaseConverter = BaseConverter;
window.baseConverter = baseConverter;
window.BaseHelpers = BaseHelpers;

