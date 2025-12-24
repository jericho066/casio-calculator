/**
 * Memory Management System
 * Handles calculator memory registers (M, A-F, X, Y)
 */

class MemoryManager {
    constructor() {
        this.memories = {
            M: 0,      // Main memory
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            F: 0,
            X: 0,
            Y: 0,
            Ans: 0     // Last answer
        };
        
        this.memoryIndicators = new Set();  // Active memories
    }
    
    /**
     * Store value in memory
     */
    store(register, value) {
        register = register.toUpperCase();
        
        if (!this.memories.hasOwnProperty(register)) {
            throw new Error(`Invalid memory register: ${register}`);
        }
        
        this.memories[register] = value;
        this.memoryIndicators.add(register);
        
        console.log(`💾 Stored ${value} in ${register}`);
        this.updateMemoryIndicator();
        
        // Save to calculator state
        const state = window.calculatorState;
        state.memory[register] = value;
        window.saveSettings();
    }
    
    /**
     * Recall value from memory
     */
    recall(register) {
        register = register.toUpperCase();
        
        if (!this.memories.hasOwnProperty(register)) {
            throw new Error(`Invalid memory register: ${register}`);
        }
        
        console.log(`📂 Recalled ${this.memories[register]} from ${register}`);
        return this.memories[register];
    }
    
    /**
     * Add to memory (M+)
     */
    add(register, value) {
        register = register.toUpperCase();
        
        if (!this.memories.hasOwnProperty(register)) {
            throw new Error(`Invalid memory register: ${register}`);
        }
        
        this.memories[register] += value;
        this.memoryIndicators.add(register);
        
        console.log(`➕ Added ${value} to ${register}, new value: ${this.memories[register]}`);
        this.updateMemoryIndicator();
        
        // Update calculator state
        const state = window.calculatorState;
        state.memory[register] = this.memories[register];
        window.saveSettings();
    }
    
    /**
     * Subtract from memory (M-)
     */
    subtract(register, value) {
        this.add(register, -value);
        console.log(`➖ Subtracted ${value} from ${register}`);
    }
    
    /**
     * Clear specific memory
     */
    clear(register) {
        register = register.toUpperCase();
        
        if (!this.memories.hasOwnProperty(register)) {
            throw new Error(`Invalid memory register: ${register}`);
        }
        
        this.memories[register] = 0;
        this.memoryIndicators.delete(register);
        
        console.log(`🗑️ Cleared ${register}`);
        this.updateMemoryIndicator();
        
        // Update calculator state
        const state = window.calculatorState;
        state.memory[register] = 0;
        window.saveSettings();
    }
    
    /**
     * Clear all memories
     */
    clearAll() {
        for (let key in this.memories) {
            if (key !== 'Ans') {  // Don't clear Ans
                this.memories[key] = 0;
            }
        }
        
        this.memoryIndicators.clear();
        console.log('🗑️ All memories cleared');
        this.updateMemoryIndicator();
        
        // Update calculator state
        const state = window.calculatorState;
        for (let key in this.memories) {
            if (key !== 'Ans') {
                state.memory[key] = 0;
            }
        }
        window.saveSettings();
    }
    
    /**
     * Store last answer
     */
    storeAnswer(value) {
        this.memories.Ans = value;
        
        const state = window.calculatorState;
        state.lastAns = value;
        
        console.log(`💾 Ans = ${value}`);
    }
    
    /**
     * Recall last answer
     */
    recallAnswer() {
        return this.memories.Ans;
    }
    
    /**
     * Get all memory values
     */
    getAll() {
        return { ...this.memories };
    }
    
    /**
     * Check if memory has value
     */
    hasValue(register) {
        register = register.toUpperCase();
        return Math.abs(this.memories[register]) > 1e-10;
    }
    
    /**
     * Get active memories
     */
    getActiveMemories() {
        return Array.from(this.memoryIndicators);
    }
    
    /**
     * Update memory indicator in display
     */
    updateMemoryIndicator() {
        const indicatorEl = document.getElementById('indicator-m');
        if (!indicatorEl) return;
        
        const activeMemories = this.getActiveMemories();
        
        if (activeMemories.length > 0) {
            indicatorEl.textContent = 'M';
            indicatorEl.style.visibility = 'visible';
        } else {
            indicatorEl.style.visibility = 'hidden';
        }
    }
    
    /**
     * Load memories from storage
     */
    loadFromState(state) {
        if (state.memory) {
            for (let key in state.memory) {
                if (this.memories.hasOwnProperty(key)) {
                    this.memories[key] = state.memory[key] || 0;
                    
                    if (Math.abs(this.memories[key]) > 1e-10) {
                        this.memoryIndicators.add(key);
                    }
                }
            }
        }
        
        if (state.lastAns !== undefined) {
            this.memories.Ans = state.lastAns;
        }
        
        this.updateMemoryIndicator();
    }
    
    /**
     * Interactive memory operations
     */
    promptStore() {
        console.log('💾 STO: Enter register (A-F, M, X, Y)');
        // In full implementation, this would show an input overlay
    }
    
    promptRecall() {
        console.log('📂 RCL: Enter register (A-F, M, X, Y)');
        // In full implementation, this would show an input overlay
    }
    
    /**
     * Display memory contents
     */
    displayMemories() {
        console.log('📋 Memory Contents:');
        for (let key in this.memories) {
            if (this.hasValue(key)) {
                console.log(`  ${key}: ${this.memories[key]}`);
            }
        }
    }
}

// Create global instance
const memoryManager = new MemoryManager();

// Export
window.MemoryManager = MemoryManager;
window.memoryManager = memoryManager;

