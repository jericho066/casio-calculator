/**
 * Mode Management System
 * Handles different calculator modes and their specific behaviors
 */

const MODES = {
    COMP: {
        name: 'COMP',
        displayName: 'Math',
        description: 'Normal computation mode',
        subModes: []
    },
    STAT: {
        name: 'STAT',
        displayName: 'STAT',
        description: 'Statistical calculations',
        subModes: ['1-VAR', '2-VAR', 'REG']
    },
    MATRIX: {
        name: 'MATRIX',
        displayName: 'MATRIX',
        description: 'Matrix operations',
        subModes: []
    },
    VECTOR: {
        name: 'VECTOR',
        displayName: 'VECTOR',
        description: 'Vector operations',
        subModes: []
    },
    COMPLEX: {
        name: 'COMPLEX',
        displayName: 'CMPLX',
        description: 'Complex number calculations',
        subModes: []
    },
    BASE: {
        name: 'BASE',
        displayName: 'BASE',
        description: 'Base-n calculations',
        subModes: ['DEC', 'HEX', 'BIN', 'OCT']
    },
    EQN: {
        name: 'EQN',
        displayName: 'EQN',
        description: 'Equation solver',
        subModes: ['LINEAR', 'QUADRATIC', 'CUBIC']
    },
    TABLE: {
        name: 'TABLE',
        displayName: 'TABLE',
        description: 'Function table generation',
        subModes: []
    }
};

class ModeManager {
    constructor() {
        this.currentMode = 'COMP';
        this.currentSubMode = null;
        this.modeData = {};
        
        // Initialize mode-specific data
        this.initializeModeData();
    }
    
    /**
     * Initialize data storage for each mode
     */
    initializeModeData() {
        this.modeData = {
            STAT: {
                stats: new Statistics(),
                type: '1-VAR',
                dataEntries: []
            },
            MATRIX: {
                matrices: {
                    A: null,
                    B: null,
                    C: null
                },
                currentMatrix: 'A'
            },
            BASE: {
                converter: new BaseConverter(),
                currentBase: 'DEC'
            },
            COMPLEX: {
                format: 'RECT'  // RECT or POLAR
            },
            EQN: {
                equationType: 'LINEAR',
                coefficients: []
            }
        };
    }
    
    /**
     * Switch to a different mode
     */
    switchMode(modeName, subMode = null) {
        if (!MODES[modeName]) {
            throw new Error(`Unknown mode: ${modeName}`);
        }
        
        const previousMode = this.currentMode;
        this.currentMode = modeName;
        this.currentSubMode = subMode;
        
        // Update calculator state
        const state = window.calculatorState;
        state.mode = MODES[modeName].displayName;
        
        // Mode-specific initialization
        this.onModeEnter(modeName, previousMode);
        
        // Update display
        window.updateDisplay();
        
        console.log(`✅ Switched to ${modeName} mode`);
    }
    
    /**
     * Handle mode entry
     */
    onModeEnter(modeName, previousMode) {
        switch (modeName) {
            case 'BASE':
                this.enterBaseMode();
                break;
            case 'STAT':
                this.enterStatMode();
                break;
            case 'MATRIX':
                this.enterMatrixMode();
                break;
            case 'COMPLEX':
                this.enterComplexMode();
                break;
            case 'COMP':
                this.enterCompMode();
                break;
        }
    }
    
    /**
     * Enter COMP (normal) mode
     */
    enterCompMode() {
        const state = window.calculatorState;
        state.inputBuffer = '';
        console.log('📐 COMP mode active');
    }
    
    /**
     * Enter BASE mode
     */
    enterBaseMode() {
        const baseData = this.modeData.BASE;
        baseData.converter.setBase(this.currentSubMode || 'DEC');
        console.log('🔢 BASE mode active:', this.currentSubMode || 'DEC');
    }
    
    /**
     * Enter STAT mode
     */
    enterStatMode() {
        const statData = this.modeData.STAT;
        statData.type = this.currentSubMode || '1-VAR';
        console.log('📊 STAT mode active:', statData.type);
        
        // Show instructions
        this.showStatInstructions();
    }
    
    /**
     * Enter MATRIX mode
     */
    enterMatrixMode() {
        console.log('📐 MATRIX mode active');
        this.showMatrixMenu();
    }
    
    /**
     * Enter COMPLEX mode
     */
    enterComplexMode() {
        console.log('🔢 COMPLEX mode active');
    }
    
    /**
     * Show mode selection menu
     */
    showModeMenu() {
        const modeNames = Object.keys(MODES);
        const menuItems = modeNames.map((key, index) => {
            const mode = MODES[key];
            return `${index + 1}: ${mode.displayName}`;
        });
        
        console.log('📋 MODE Menu:');
        console.log(menuItems.join('\n'));
        
        // For now, just log. In a full implementation, this would show a UI overlay
        return modeNames;
    }
    
    /**
     * Show setup menu
     */
    showSetupMenu() {
        const state = window.calculatorState;
        
        console.log('⚙️ SETUP Menu:');
        console.log('1: MthIO / LineIO');
        console.log('2: Deg / Rad / Grad - Current:', state.angleUnit);
        console.log('3: Fix / Sci / Norm - Current: Norm');
        console.log('4: Disp');
        
        // For now, just log. In a full implementation, this would show a UI overlay
    }
    
    /**
     * Show STAT data entry instructions
     */
    showStatInstructions() {
        console.log('📊 STAT Data Entry:');
        console.log('Enter data points and press = to add');
        console.log('Use AC to calculate statistics');
    }
    
    /**
     * Show MATRIX menu
     */
    showMatrixMenu() {
        console.log('📐 MATRIX Menu:');
        console.log('1: Matrix A');
        console.log('2: Matrix B');
        console.log('3: Matrix C');
        console.log('4: Matrix operations');
    }
    
    /**
     * Get current mode info
     */
    getCurrentMode() {
        return {
            mode: this.currentMode,
            subMode: this.currentSubMode,
            data: this.modeData[this.currentMode] || null,
            info: MODES[this.currentMode]
        };
    }
    
    /**
     * Check if in a specific mode
     */
    isMode(modeName) {
        return this.currentMode === modeName;
    }
    
    /**
     * Toggle angle unit (DEG/RAD/GRAD)
     */
    toggleAngleUnit() {
        const state = window.calculatorState;
        const units = ['DEG', 'RAD', 'GRAD'];
        const currentIndex = units.indexOf(state.angleUnit);
        const nextIndex = (currentIndex + 1) % units.length;
        state.angleUnit = units[nextIndex];
        
        console.log('📐 Angle unit:', state.angleUnit);
        window.updateDisplay();
        window.saveSettings();
    }
    
    /**
     * Handle STAT data entry
     */
    addStatData(value) {
        const statData = this.modeData.STAT;
        statData.dataEntries.push(value);
        
        if (statData.type === '1-VAR') {
            statData.stats.add(value);
        }
        
        console.log('📊 Data added:', value);
        console.log('Total entries:', statData.dataEntries.length);
    }
    
    /**
     * Calculate STAT results
     */
    calculateStats() {
        const statData = this.modeData.STAT;
        
        if (statData.dataEntries.length === 0) {
            window.setError('No Data');
            return null;
        }
        
        if (statData.type === '1-VAR') {
            return statData.stats.summary1Var();
        } else if (statData.type === '2-VAR') {
            return statData.stats.summary2Var();
        }
    }
    
    /**
     * Clear STAT data
     */
    clearStatData() {
        const statData = this.modeData.STAT;
        statData.stats.clear();
        statData.dataEntries = [];
        console.log('🗑️ STAT data cleared');
    }
    
    /**
     * Set matrix dimensions and initialize
     */
    setMatrixDimensions(matrixName, rows, cols) {
        const matrixData = this.modeData.MATRIX;
        matrixData.matrices[matrixName] = new Matrix(rows, cols);
        console.log(`📐 Matrix ${matrixName} initialized: ${rows}×${cols}`);
    }
    
    /**
     * Set matrix element
     */
    setMatrixElement(matrixName, row, col, value) {
        const matrixData = this.modeData.MATRIX;
        const matrix = matrixData.matrices[matrixName];
        
        if (!matrix) {
            throw new Error(`Matrix ${matrixName} not initialized`);
        }
        
        matrix.set(row, col, value);
    }
    
    /**
     * Get matrix
     */
    getMatrix(matrixName) {
        return this.modeData.MATRIX.matrices[matrixName];
    }
    
    /**
     * Convert BASE number
     */
    convertBase(value, fromBase, toBase) {
        const converter = this.modeData.BASE.converter;
        return converter.convert(value, fromBase, toBase);
    }
}

// Create global instance
const modeManager = new ModeManager();

// Export
window.ModeManager = ModeManager;
window.modeManager = modeManager;
window.MODES = MODES;

