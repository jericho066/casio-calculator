/**
 * Comprehensive Test Suite
 * Tests all calculator functionality
 */

class TestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            errors: []
        };
    }
    
    /**
     * Add a test
     */
    test(name, fn) {
        this.tests.push({ name, fn });
    }
    
    /**
     * Run all tests
     */
    async runAll() {
        console.log('🧪 Running test suite...\n');
        this.results = { passed: 0, failed: 0, errors: [] };
        
        for (const test of this.tests) {
            try {
                await test.fn();
                this.results.passed++;
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.results.failed++;
                this.results.errors.push({ test: test.name, error: error.message });
                console.error(`❌ ${test.name}: ${error.message}`);
            }
        }
        
        console.log('\n📊 Test Results:');
        console.log(`Passed: ${this.results.passed}`);
        console.log(`Failed: ${this.results.failed}`);
        console.log(`Total: ${this.tests.length}`);
        
        if (this.results.failed > 0) {
            console.log('\n❌ Failed tests:');
            this.results.errors.forEach(e => {
                console.log(`  - ${e.test}: ${e.error}`);
            });
        }
        
        return this.results;
    }
    
    /**
     * Assert helper
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }
    
    /**
     * Assert equal helper
     */
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }
    
    /**
     * Assert close (for floating point)
     */
    assertClose(actual, expected, tolerance = 1e-6, message) {
        if (Math.abs(actual - expected) > tolerance) {
            throw new Error(message || `Expected ${expected}, got ${actual} (tolerance: ${tolerance})`);
        }
    }
}

// Create test runner instance
const testRunner = new TestRunner();

// ===========================
// Basic Arithmetic Tests
// ===========================
testRunner.test('Addition: 2+3 = 5', () => {
    const result = evaluateExpression('2+3');
    testRunner.assertEqual(result, 5);
});

testRunner.test('Subtraction: 10-3 = 7', () => {
    const result = evaluateExpression('10-3');
    testRunner.assertEqual(result, 7);
});

testRunner.test('Multiplication: 4×5 = 20', () => {
    const result = evaluateExpression('4*5');
    testRunner.assertEqual(result, 20);
});

testRunner.test('Division: 20÷4 = 5', () => {
    const result = evaluateExpression('20/4');
    testRunner.assertEqual(result, 5);
});

testRunner.test('Order of operations: 2+3×4 = 14', () => {
    const result = evaluateExpression('2+3*4');
    testRunner.assertEqual(result, 14);
});

testRunner.test('Parentheses: (2+3)×4 = 20', () => {
    const result = evaluateExpression('(2+3)*4');
    testRunner.assertEqual(result, 20);
});

// ===========================
// Power and Root Tests
// ===========================
testRunner.test('Power: 2^3 = 8', () => {
    const result = evaluateExpression('2^3');
    testRunner.assertEqual(result, 8);
});

testRunner.test('Square root: √16 = 4', () => {
    const result = evaluateExpression('sqrt(16)');
    testRunner.assertEqual(result, 4);
});

testRunner.test('Square root: √2 ≈ 1.414', () => {
    const result = evaluateExpression('sqrt(2)');
    testRunner.assertClose(result, 1.41421356, 1e-6);
});

// ===========================
// Trigonometry Tests (DEG)
// ===========================
testRunner.test('sin(30°) = 0.5', () => {
    window.calculatorState.angleUnit = 'DEG';
    const result = evaluateExpression('sin(30)');
    testRunner.assertClose(result, 0.5, 1e-6);
});

testRunner.test('cos(60°) = 0.5', () => {
    window.calculatorState.angleUnit = 'DEG';
    const result = evaluateExpression('cos(60)');
    testRunner.assertClose(result, 0.5, 1e-6);
});

testRunner.test('tan(45°) = 1', () => {
    window.calculatorState.angleUnit = 'DEG';
    const result = evaluateExpression('tan(45)');
    testRunner.assertClose(result, 1, 1e-6);
});

// ===========================
// Logarithm Tests
// ===========================
testRunner.test('log(100) = 2', () => {
    const result = evaluateExpression('log(100)');
    testRunner.assertClose(result, 2, 1e-6);
});

testRunner.test('ln(e) = 1', () => {
    const result = evaluateExpression('ln(e)');
    testRunner.assertClose(result, 1, 1e-6);
});

// ===========================
// Constants Tests
// ===========================
testRunner.test('π ≈ 3.14159', () => {
    const result = evaluateExpression('π');
    testRunner.assertClose(result, Math.PI, 1e-6);
});

testRunner.test('e ≈ 2.71828', () => {
    const result = evaluateExpression('e');
    testRunner.assertClose(result, Math.E, 1e-6);
});

// ===========================
// Factorial Tests
// ===========================
testRunner.test('5! = 120', () => {
    const result = MathUtils.factorial(5);
    testRunner.assertEqual(result, 120);
});

testRunner.test('0! = 1', () => {
    const result = MathUtils.factorial(0);
    testRunner.assertEqual(result, 1);
});

// ===========================
// Permutation and Combination Tests
// ===========================
testRunner.test('P(5,2) = 20', () => {
    const result = MathUtils.permutation(5, 2);
    testRunner.assertEqual(result, 20);
});

testRunner.test('C(5,2) = 10', () => {
    const result = MathUtils.combination(5, 2);
    testRunner.assertEqual(result, 10);
});

// ===========================
// Complex Number Tests
// ===========================
testRunner.test('Complex addition: (3+4i) + (1+2i) = 4+6i', () => {
    const c1 = new Complex(3, 4);
    const c2 = new Complex(1, 2);
    const result = c1.add(c2);
    testRunner.assertEqual(result.real, 4);
    testRunner.assertEqual(result.imag, 6);
});

testRunner.test('Complex magnitude: |3+4i| = 5', () => {
    const c = new Complex(3, 4);
    const mag = c.magnitude();
    testRunner.assertEqual(mag, 5);
});

// ===========================
// Matrix Tests
// ===========================
testRunner.test('Matrix determinant: det([[1,2],[3,4]]) = -2', () => {
    const m = Matrix.from([[1, 2], [3, 4]]);
    const det = m.determinant();
    testRunner.assertEqual(det, -2);
});

testRunner.test('Matrix multiplication', () => {
    const a = Matrix.from([[1, 2], [3, 4]]);
    const b = Matrix.from([[2, 0], [1, 2]]);
    const result = a.multiply(b);
    testRunner.assertEqual(result.get(0, 0), 4);
    testRunner.assertEqual(result.get(0, 1), 4);
    testRunner.assertEqual(result.get(1, 0), 10);
    testRunner.assertEqual(result.get(1, 1), 8);
});

// ===========================
// Integration Tests
// ===========================
testRunner.test('Integration: ∫₀¹ x² dx = 1/3', () => {
    const result = integrate(x => x * x, 0, 1);
    testRunner.assertClose(result, 1/3, 1e-6);
});

testRunner.test('Integration: ∫₀^(π/2) cos(x) dx = 1', () => {
    const result = integrate(x => Math.cos(x), 0, Math.PI / 2);
    testRunner.assertClose(result, 1, 1e-6);
});

// ===========================
// Solver Tests
// ===========================
testRunner.test('Solve x² - 4 = 0, near x=2', () => {
    const result = solve('x*x-4', 'x', 2);
    testRunner.assertClose(result, 2, 1e-6);
});

// ===========================
// Statistics Tests
// ===========================
testRunner.test('Mean of [2,4,6,8] = 5', () => {
    const stats = new Statistics();
    stats.setData([2, 4, 6, 8]);
    testRunner.assertEqual(stats.mean(), 5);
});

testRunner.test('Median of [1,2,3,4,5] = 3', () => {
    const stats = new Statistics();
    stats.setData([1, 2, 3, 4, 5]);
    testRunner.assertEqual(stats.median(), 3);
});

// ===========================
// Base Conversion Tests
// ===========================
testRunner.test('Binary to Decimal: 1010₂ = 10', () => {
    const result = BaseHelpers.binToDec('1010');
    testRunner.assertEqual(result, 10);
});

testRunner.test('Hex to Decimal: FF₁₆ = 255', () => {
    const result = BaseHelpers.hexToDec('FF');
    testRunner.assertEqual(result, 255);
});

testRunner.test('Bitwise AND: 12 & 10 = 8', () => {
    const result = BaseHelpers.and(12, 10);
    testRunner.assertEqual(result, 8);
});

// ===========================
// Memory Tests
// ===========================
testRunner.test('Memory store and recall', () => {
    memoryManager.store('M', 42);
    const result = memoryManager.recall('M');
    testRunner.assertEqual(result, 42);
});

testRunner.test('Memory add', () => {
    memoryManager.clear('M');
    memoryManager.store('M', 10);
    memoryManager.add('M', 5);
    const result = memoryManager.recall('M');
    testRunner.assertEqual(result, 15);
});

// ===========================
// Error Handling Tests
// ===========================
testRunner.test('Division by zero throws error', () => {
    try {
        evaluateExpression('10/0');
        throw new Error('Should have thrown error');
    } catch (error) {
        testRunner.assert(error.message.includes('Division by zero'));
    }
});

testRunner.test('Invalid sqrt domain throws error', () => {
    try {
        evaluateExpression('sqrt(-1)');
        throw new Error('Should have thrown error');
    } catch (error) {
        testRunner.assert(error.message.includes('Invalid domain'));
    }
});

// Export test runner
window.testRunner = testRunner;
window.runTests = () => testRunner.runAll();

console.log('🧪 Test suite loaded. Run tests with: runTests()');
