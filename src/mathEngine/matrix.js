/**
 * Matrix Operations Module
 * Supports matrix arithmetic, determinants, inverse, and linear systems
 */

class Matrix {
    constructor(rows, cols, data = null) {
        this.rows = rows;
        this.cols = cols;
        
        if (data) {
            if (Array.isArray(data)) {
                // From 2D array
                if (data.length !== rows || data[0].length !== cols) {
                    throw new Error('Data dimensions do not match matrix dimensions');
                }
                this.data = data.map(row => [...row]);
            } else {
                throw new Error('Invalid data format');
            }
        } else {
            // Initialize with zeros
            this.data = Array(rows).fill(0).map(() => Array(cols).fill(0));
        }
    }
    
    /**
     * Create identity matrix
     */
    static identity(size) {
        const m = new Matrix(size, size);
        for (let i = 0; i < size; i++) {
            m.data[i][i] = 1;
        }
        return m;
    }
    
    /**
     * Create zero matrix
     */
    static zeros(rows, cols) {
        return new Matrix(rows, cols);
    }
    
    /**
     * Create matrix filled with ones
     */
    static ones(rows, cols) {
        const m = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                m.data[i][j] = 1;
            }
        }
        return m;
    }
    
    /**
     * Create matrix from array
     */
    static from(array) {
        if (!Array.isArray(array) || !Array.isArray(array[0])) {
            throw new Error('Input must be 2D array');
        }
        return new Matrix(array.length, array[0].length, array);
    }
    
    /**
     * Get element at (i, j)
     */
    get(i, j) {
        if (i < 0 || i >= this.rows || j < 0 || j >= this.cols) {
            throw new Error('Index out of bounds');
        }
        return this.data[i][j];
    }
    
    /**
     * Set element at (i, j)
     */
    set(i, j, value) {
        if (i < 0 || i >= this.rows || j < 0 || j >= this.cols) {
            throw new Error('Index out of bounds');
        }
        this.data[i][j] = value;
    }
    
    /**
     * Clone matrix
     */
    clone() {
        return new Matrix(this.rows, this.cols, this.data);
    }
    
    /**
     * Matrix addition
     */
    add(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error('Matrix dimensions must match for addition');
        }
        
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.data[i][j] = this.data[i][j] + other.data[i][j];
            }
        }
        return result;
    }
    
    /**
     * Matrix subtraction
     */
    subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error('Matrix dimensions must match for subtraction');
        }
        
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.data[i][j] = this.data[i][j] - other.data[i][j];
            }
        }
        return result;
    }
    
    /**
     * Scalar multiplication
     */
    scale(scalar) {
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.data[i][j] = this.data[i][j] * scalar;
            }
        }
        return result;
    }
    
    /**
     * Matrix multiplication
     */
    multiply(other) {
        if (this.cols !== other.rows) {
            throw new Error('Invalid dimensions for matrix multiplication');
        }
        
        const result = new Matrix(this.rows, other.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < other.cols; j++) {
                let sum = 0;
                for (let k = 0; k < this.cols; k++) {
                    sum += this.data[i][k] * other.data[k][j];
                }
                result.data[i][j] = sum;
            }
        }
        return result;
    }
    
    /**
     * Matrix transpose
     */
    transpose() {
        const result = new Matrix(this.cols, this.rows);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.data[j][i] = this.data[i][j];
            }
        }
        return result;
    }
    
    /**
     * Calculate determinant (for square matrices only)
     */
    determinant() {
        if (this.rows !== this.cols) {
            throw new Error('Determinant only defined for square matrices');
        }
        
        return this._determinantRecursive(this.data);
    }
    
    _determinantRecursive(matrix) {
        const n = matrix.length;
        
        if (n === 1) {
            return matrix[0][0];
        }
        
        if (n === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        
        let det = 0;
        for (let j = 0; j < n; j++) {
            const subMatrix = this._getSubMatrix(matrix, 0, j);
            const sign = j % 2 === 0 ? 1 : -1;
            det += sign * matrix[0][j] * this._determinantRecursive(subMatrix);
        }
        
        return det;
    }
    
    _getSubMatrix(matrix, excludeRow, excludeCol) {
        const n = matrix.length;
        const subMatrix = [];
        
        for (let i = 0; i < n; i++) {
            if (i === excludeRow) continue;
            const row = [];
            for (let j = 0; j < n; j++) {
                if (j === excludeCol) continue;
                row.push(matrix[i][j]);
            }
            subMatrix.push(row);
        }
        
        return subMatrix;
    }
    
    /**
     * Calculate matrix inverse using Gauss-Jordan elimination
     */
    inverse() {
        if (this.rows !== this.cols) {
            throw new Error('Inverse only defined for square matrices');
        }
        
        const n = this.rows;
        const det = this.determinant();
        
        if (Math.abs(det) < 1e-10) {
            throw new Error('Matrix is singular (non-invertible)');
        }
        
        // Create augmented matrix [A | I]
        const aug = Array(n).fill(0).map((_, i) => 
            [...this.data[i], ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]
        );
        
        // Gauss-Jordan elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            // Swap rows
            [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
            
            // Scale pivot row
            const pivot = aug[i][i];
            if (Math.abs(pivot) < 1e-10) {
                throw new Error('Matrix is singular');
            }
            
            for (let j = 0; j < 2 * n; j++) {
                aug[i][j] /= pivot;
            }
            
            // Eliminate column
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = aug[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        aug[k][j] -= factor * aug[i][j];
                    }
                }
            }
        }
        
        // Extract inverse from augmented matrix
        const invData = aug.map(row => row.slice(n));
        return new Matrix(n, n, invData);
    }
    
    /**
     * Solve linear system Ax = b using Gaussian elimination
     */
    solve(b) {
        if (this.rows !== this.cols) {
            throw new Error('Matrix must be square to solve system');
        }
        
        if (!Array.isArray(b) || b.length !== this.rows) {
            throw new Error('Invalid right-hand side vector');
        }
        
        const n = this.rows;
        
        // Create augmented matrix [A | b]
        const aug = Array(n).fill(0).map((_, i) => 
            [...this.data[i], b[i]]
        );
        
        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            // Swap rows
            [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
            
            // Check for singular matrix
            if (Math.abs(aug[i][i]) < 1e-10) {
                throw new Error('Matrix is singular or system has no unique solution');
            }
            
            // Eliminate below
            for (let k = i + 1; k < n; k++) {
                const factor = aug[k][i] / aug[i][i];
                for (let j = i; j <= n; j++) {
                    aug[k][j] -= factor * aug[i][j];
                }
            }
        }
        
        // Back substitution
        const x = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = aug[i][n];
            for (let j = i + 1; j < n; j++) {
                x[i] -= aug[i][j] * x[j];
            }
            x[i] /= aug[i][i];
        }
        
        return x;
    }
    
    /**
     * Row-Reduced Echelon Form (RREF)
     */
    rref() {
        const result = this.clone();
        const rows = result.rows;
        const cols = result.cols;
        let lead = 0;
        
        for (let r = 0; r < rows; r++) {
            if (lead >= cols) break;
            
            // Find pivot
            let i = r;
            while (Math.abs(result.data[i][lead]) < 1e-10) {
                i++;
                if (i === rows) {
                    i = r;
                    lead++;
                    if (lead === cols) return result;
                }
            }
            
            // Swap rows
            [result.data[i], result.data[r]] = [result.data[r], result.data[i]];
            
            // Scale pivot row
            const pivot = result.data[r][lead];
            for (let j = 0; j < cols; j++) {
                result.data[r][j] /= pivot;
            }
            
            // Eliminate column
            for (let i = 0; i < rows; i++) {
                if (i !== r) {
                    const factor = result.data[i][lead];
                    for (let j = 0; j < cols; j++) {
                        result.data[i][j] -= factor * result.data[r][j];
                    }
                }
            }
            
            lead++;
        }
        
        return result;
    }
    
    /**
     * Matrix rank
     */
    rank() {
        const rrefMatrix = this.rref();
        let rank = 0;
        
        for (let i = 0; i < rrefMatrix.rows; i++) {
            let hasNonZero = false;
            for (let j = 0; j < rrefMatrix.cols; j++) {
                if (Math.abs(rrefMatrix.data[i][j]) > 1e-10) {
                    hasNonZero = true;
                    break;
                }
            }
            if (hasNonZero) rank++;
        }
        
        return rank;
    }
    
    /**
     * Matrix trace (sum of diagonal elements)
     */
    trace() {
        if (this.rows !== this.cols) {
            throw new Error('Trace only defined for square matrices');
        }
        
        let sum = 0;
        for (let i = 0; i < this.rows; i++) {
            sum += this.data[i][i];
        }
        return sum;
    }
    
    /**
     * Check if matrix is square
     */
    isSquare() {
        return this.rows === this.cols;
    }
    
    /**
     * Check if matrix is symmetric
     */
    isSymmetric() {
        if (!this.isSquare()) return false;
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = i + 1; j < this.cols; j++) {
                if (Math.abs(this.data[i][j] - this.data[j][i]) > 1e-10) {
                    return false;
                }
            }
        }
        return true;
    }
    
    /**
     * String representation
     */
    toString() {
        return this.data.map(row => 
            '[' + row.map(val => val.toFixed(4)).join(', ') + ']'
        ).join('\n');
    }
    
    /**
     * Convert to array
     */
    toArray() {
        return this.data.map(row => [...row]);
    }
}

// Export
window.Matrix = Matrix;

