# Casio fx-991ES PLUS Calculator

A faithful browser-based replica of the Casio fx-991ES PLUS scientific calculator, built with vanilla JavaScript, HTML, and CSS.

![Calculator Preview](screenshot.png)

## 🎯 Features

### Core Functionality
- ✅ **Full keyboard layout** - All 40+ buttons implemented
- ✅ **Natural mathematical display** - Fractions, roots, exponents rendered naturally
- ✅ **Shift/Alpha layers** - Multiple functions per key
- ✅ **Real-time calculation** - Instant evaluation
- ✅ **Physical keyboard support** - Type expressions directly

### Mathematical Operations

#### Basic Operations
- Arithmetic: +, −, ×, ÷
- Powers: x², x³, xʸ
- Roots: √, ∛, ∜
- Factorial: n!
- Parentheses and order of operations

#### Advanced Functions
- **Trigonometry**: sin, cos, tan, sinh, cosh, tanh (+ inverses)
- **Logarithms**: log, ln, 10ˣ, eˣ
- **Calculus**: Numerical integration (adaptive Simpson's rule)
- **Equation Solver**: Brent's method, Newton-Raphson, Secant, Bisection
- **Combinatorics**: Permutations (nPr), Combinations (nCr)

#### Specialized Modes

**STAT Mode**
- 1-VAR statistics (mean, median, std dev, quartiles)
- 2-VAR statistics (linear regression, correlation)
- Sum calculations (Σx, Σx²)

**MATRIX Mode**
- Matrix operations (add, multiply, transpose)
- Determinant calculation
- Matrix inverse
- System solving (Ax = b)
- RREF (Row-Reduced Echelon Form)

**COMPLEX Mode**
- Complex number arithmetic
- Rectangular ↔ Polar conversion
- Complex functions

**BASE Mode**
- Binary, Octal, Decimal, Hexadecimal conversion
- Bitwise operations (AND, OR, XOR, NOT)
- Bit manipulation

### Calculator Features
- **Memory Registers**: M, A-F, X, Y with STO/RCL
- **Ans Function**: Recall last answer
- **Angle Units**: DEG, RAD, GRAD
- **Auto-save**: Settings persist across sessions
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/casio-calculator.git
cd casio-calculator
```

2. Open `index.html` in a modern web browser

No build process or dependencies required!

### Project Structure

```
casio-calculator/
├── index.html              # Main HTML file
├── styles.css              # Complete styling
├── src/
│   ├── app.js             # Application bootstrap
│   ├── keymap.js          # Button mapping
│   ├── domRenderer.js     # Keyboard renderer
│   ├── inputController.js # Input handling
│   ├── displayRenderer.js # Natural display
│   ├── parser.js          # Expression tokenizer
│   ├── evaluator.js       # RPN evaluator
│   ├── storage.js         # localStorage handler
│   ├── modes.js           # Mode management
│   ├── memory.js          # Memory operations
│   ├── tests.js           # Test suite
│   └── mathEngine/
│       ├── utils.js       # Factorial, nPr, nCr
│       ├── complex.js     # Complex numbers
│       ├── integration.js # Numerical integration
│       ├── solver.js      # Equation solving
│       ├── matrix.js      # Matrix operations
│       ├── stats.js       # Statistics
│       └── base.js        # Base conversions
└── README.md
```

## 📖 Usage

### Basic Calculations
```
3+4×2    → 11
(3+4)×2  → 14
2^8      → 256
√16      → 4
```

### Trigonometry
```
sin(30)  → 0.5  (in DEG mode)
cos(π)   → -1   (in RAD mode)
```

### Advanced Features

**Integration**
```javascript
integrate(x => x*x, 0, 1)  // ∫₀¹ x² dx = 0.333...
```

**Equation Solving**
```javascript
solve('x*x-4', 'x', 2)  // Solve x²-4=0, near x=2 → 2
```

**Statistics**
```javascript
let stats = new Statistics();
stats.setData([2, 4, 6, 8, 10]);
stats.mean()  // → 6
```

**Matrices**
```javascript
let A = Matrix.from([[1, 2], [3, 4]]);
A.determinant()  // → -2
A.inverse()      // → [[-2, 1], [1.5, -0.5]]
```

### Keyboard Shortcuts
- `0-9` - Numbers
- `+ - * /` - Basic operations
- `Enter` - Calculate (=)
- `Escape` - Clear (AC)
- `Backspace` - Delete (DEL)
- `S` - Shift
- `A` - Alpha
- `M` - Mode menu

## 🧪 Testing

Run the comprehensive test suite:
```javascript
runTests()
```

Tests cover:
- Basic arithmetic
- Trigonometry
- Advanced functions
- Complex numbers
- Matrix operations
- Integration
- Statistics
- Base conversions
- Error handling

## 🎨 Customization

### Change Angle Unit
```javascript
modeManager.toggleAngleUnit()  // DEG → RAD → GRAD
```

### Switch Modes
```javascript
modeManager.switchMode('STAT', '1-VAR')
modeManager.switchMode('MATRIX')
modeManager.switchMode('BASE', 'HEX')
```

### Memory Operations
```javascript
memoryManager.store('M', 42)
memoryManager.recall('M')
memoryManager.add('M', 10)
```

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## ♿ Accessibility

- **ARIA Labels**: All buttons and display areas properly labeled
- **Keyboard Navigation**: Full tab navigation support
- **Screen Reader**: Compatible with NVDA, JAWS, VoiceOver
- **High Contrast**: Supports system high contrast mode
- **Reduced Motion**: Respects prefers-reduced-motion

## 📱 Mobile Support

- Responsive design
- Touch-optimized button sizes
- Prevents zoom on input
- Optimized for tablets and phones

## 🔧 Development

### Adding New Functions

1. Add to `FUNCTIONS` in `parser.js`
2. Implement in `evaluateOperation()` in `evaluator.js`
3. Add button to `keymap.js`
4. Add test to `tests.js`

### Adding New Modes

1. Define mode in `modes.js` `MODES` object
2. Implement mode-specific behavior in `ModeManager`
3. Update `inputController.js` for mode-specific keys

## 🐛 Known Issues

- Some edge cases in integration may not converge
- Very large factorials (>170) return Infinity
- Complex mode UI not fully implemented

## 🚧 Future Enhancements

- [ ] Graphing functionality
- [ ] Equation history
- [ ] Export/Import calculations
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Symbolic CAS (Computer Algebra System)

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Based on the Casio fx-991ES PLUS calculator
- Built following scientific calculator best practices
- Inspired by the engineering community

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/yourusername)

## 📮 Contact

For bugs, feature requests, or questions:
- Open an issue on GitHub
- Email: your.email@example.com

---

**Made with ❤️ and lots of ☕**
