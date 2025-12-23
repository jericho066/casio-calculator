/**
 * Statistical Functions Module
 * Supports 1-VAR and 2-VAR statistics, regression analysis
 */

class Statistics {
    constructor() {
        this.data = [];
        this.xData = [];
        this.yData = [];
        this.mode = '1-VAR'; // '1-VAR' or '2-VAR'
    }
    
    /**
     * Clear all data
     */
    clear() {
        this.data = [];
        this.xData = [];
        this.yData = [];
    }
    
    /**
     * Add single variable data point
     */
    add(value) {
        this.data.push(value);
    }
    
    /**
     * Add paired data point (x, y)
     */
    addPair(x, y) {
        this.xData.push(x);
        this.yData.push(y);
        this.mode = '2-VAR';
    }
    
    /**
     * Set data array
     */
    setData(array) {
        this.data = [...array];
        this.mode = '1-VAR';
    }
    
    /**
     * Set paired data arrays
     */
    setPairedData(xArray, yArray) {
        if (xArray.length !== yArray.length) {
            throw new Error('X and Y arrays must have same length');
        }
        this.xData = [...xArray];
        this.yData = [...yArray];
        this.mode = '2-VAR';
    }
    
    /**
     * Number of data points
     */
    count() {
        return this.mode === '1-VAR' ? this.data.length : this.xData.length;
    }
    
    /**
     * Sum of values
     */
    sum(dataset = null) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        return arr.reduce((acc, val) => acc + val, 0);
    }
    
    /**
     * Mean (average)
     */
    mean(dataset = null) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        if (arr.length === 0) return 0;
        return this.sum(arr) / arr.length;
    }
    
    /**
     * Median
     */
    median(dataset = null) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        if (arr.length === 0) return 0;
        
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            return sorted[mid];
        }
    }
    
    /**
     * Mode (most frequent value)
     */
    mode(dataset = null) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        if (arr.length === 0) return null;
        
        const freq = {};
        let maxFreq = 0;
        let modes = [];
        
        for (const val of arr) {
            freq[val] = (freq[val] || 0) + 1;
            if (freq[val] > maxFreq) {
                maxFreq = freq[val];
                modes = [val];
            } else if (freq[val] === maxFreq && !modes.includes(val)) {
                modes.push(val);
            }
        }
        
        return modes.length === arr.length ? null : modes[0];
    }
    
    /**
     * Variance (population)
     */
    variance(dataset = null, sample = false) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        if (arr.length === 0) return 0;
        
        const avg = this.mean(arr);
        const squaredDiffs = arr.map(x => Math.pow(x - avg, 2));
        const divisor = sample ? arr.length - 1 : arr.length;
        
        return squaredDiffs.reduce((acc, val) => acc + val, 0) / divisor;
    }
    
    /**
     * Standard deviation (population)
     */
    stdDev(dataset = null, sample = false) {
        return Math.sqrt(this.variance(dataset, sample));
    }
    
    /**
     * Sample standard deviation
     */
    sampleStdDev(dataset = null) {
        return this.stdDev(dataset, true);
    }
    
    /**
     * Minimum value
     */
    min(dataset = null) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        if (arr.length === 0) return null;
        return Math.min(...arr);
    }
    
    /**
     * Maximum value
     */
    max(dataset = null) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        if (arr.length === 0) return null;
        return Math.max(...arr);
    }
    
    /**
     * Range (max - min)
     */
    range(dataset = null) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        if (arr.length === 0) return 0;
        return this.max(arr) - this.min(arr);
    }
    
    /**
     * Sum of squares
     */
    sumOfSquares(dataset = null) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        return arr.reduce((acc, val) => acc + val * val, 0);
    }
    
    /**
     * Quartiles (Q1, Q2/median, Q3)
     */
    quartiles(dataset = null) {
        const arr = dataset || (this.mode === '1-VAR' ? this.data : this.xData);
        if (arr.length === 0) return { Q1: 0, Q2: 0, Q3: 0 };
        
        const sorted = [...arr].sort((a, b) => a - b);
        const n = sorted.length;
        
        const Q2 = this.median(sorted);
        
        const lowerHalf = sorted.slice(0, Math.floor(n / 2));
        const upperHalf = sorted.slice(Math.ceil(n / 2));
        
        const Q1 = this.median(lowerHalf);
        const Q3 = this.median(upperHalf);
        
        return { Q1, Q2, Q3 };
    }
    
    /**
     * Linear regression (y = ax + b)
     * Returns { slope: a, intercept: b, r: correlation, r2: r-squared }
     */
    linearRegression() {
        if (this.mode !== '2-VAR') {
            throw new Error('Linear regression requires 2-VAR data');
        }
        
        const n = this.xData.length;
        if (n < 2) {
            throw new Error('Need at least 2 data points for regression');
        }
        
        const sumX = this.sum(this.xData);
        const sumY = this.sum(this.yData);
        const sumXY = this.xData.reduce((acc, x, i) => acc + x * this.yData[i], 0);
        const sumX2 = this.sumOfSquares(this.xData);
        const sumY2 = this.sumOfSquares(this.yData);
        
        // Calculate slope (a) and intercept (b)
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Calculate correlation coefficient (r)
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        const r = numerator / denominator;
        const r2 = r * r;
        
        return {
            slope,
            intercept,
            r,
            r2,
            equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`
        };
    }
    
    /**
     * Predict y value for given x using linear regression
     */
    predict(x) {
        const reg = this.linearRegression();
        return reg.slope * x + reg.intercept;
    }
    
    /**
     * Covariance
     */
    covariance() {
        if (this.mode !== '2-VAR') {
            throw new Error('Covariance requires 2-VAR data');
        }
        
        const n = this.xData.length;
        if (n === 0) return 0;
        
        const meanX = this.mean(this.xData);
        const meanY = this.mean(this.yData);
        
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += (this.xData[i] - meanX) * (this.yData[i] - meanY);
        }
        
        return sum / n;
    }
    
    /**
     * Correlation coefficient (Pearson's r)
     */
    correlation() {
        if (this.mode !== '2-VAR') {
            throw new Error('Correlation requires 2-VAR data');
        }
        
        const cov = this.covariance();
        const stdX = this.stdDev(this.xData);
        const stdY = this.stdDev(this.yData);
        
        if (stdX === 0 || stdY === 0) return 0;
        
        return cov / (stdX * stdY);
    }
    
    /**
     * Get summary statistics (1-VAR)
     */
    summary1Var() {
        if (this.data.length === 0) {
            return { error: 'No data' };
        }
        
        const q = this.quartiles();
        
        return {
            n: this.count(),
            sum: this.sum(),
            mean: this.mean(),
            median: this.median(),
            mode: this.mode(),
            stdDev: this.stdDev(),
            sampleStdDev: this.sampleStdDev(),
            variance: this.variance(),
            min: this.min(),
            max: this.max(),
            range: this.range(),
            Q1: q.Q1,
            Q2: q.Q2,
            Q3: q.Q3
        };
    }
    
    /**
     * Get summary statistics (2-VAR)
     */
    summary2Var() {
        if (this.xData.length === 0) {
            return { error: 'No data' };
        }
        
        const reg = this.linearRegression();
        
        return {
            n: this.count(),
            xMean: this.mean(this.xData),
            yMean: this.mean(this.yData),
            xStdDev: this.stdDev(this.xData),
            yStdDev: this.stdDev(this.yData),
            correlation: this.correlation(),
            ...reg
        };
    }
}

// Standalone statistical functions
const StatsHelpers = {
    /**
     * Calculate factorial (reuse from utils)
     */
    factorial: (n) => window.MathUtils.factorial(n),
    
    /**
     * Binomial coefficient C(n, k)
     */
    binomial: (n, k) => window.MathUtils.combination(n, k),
    
    /**
     * Z-score
     */
    zScore: (x, mean, stdDev) => (x - mean) / stdDev,
    
    /**
     * Normal distribution PDF
     */
    normalPDF: (x, mean = 0, stdDev = 1) => {
        const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
        const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
        return coefficient * Math.exp(exponent);
    },
    
    /**
     * Standard normal CDF approximation
     */
    normalCDF: (x) => {
        // Abramowitz and Stegun approximation
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - prob : prob;
    }
};


// Export
window.Statistics = Statistics;
window.StatsHelpers = StatsHelpers;

