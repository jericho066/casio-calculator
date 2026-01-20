/**
 * Calculation History Manager
 * Stores and manages calculation history for replay
 */

class HistoryManager {
    constructor() {
        this.history = [];           // Array of calculation entries
        this.maxHistory = 50;        // Maximum number of entries to keep
        this.currentIndex = -1;      // Current position in history (-1 = not browsing)
        this.tempBuffer = '';        // Temporary storage for current input when browsing
    }
    
    /**
     * Add calculation to history
     */
    add(expression, result) {
        const entry = {
            expression: expression,
            result: result,
            timestamp: Date.now()
        };
        
        // Add to history
        this.history.push(entry);
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift(); // Remove oldest
        }
        
        // Reset browsing position
        this.currentIndex = -1;
        this.tempBuffer = '';
        
        console.log(`📝 History: Added "${expression}" = ${result}`);
    }
    
    /**
     * Navigate backward in history (Up arrow)
     */
    backward(currentInput) {
        if (this.history.length === 0) {
            return null;
        }
        
        // First time browsing - save current input
        if (this.currentIndex === -1) {
            this.tempBuffer = currentInput;
            this.currentIndex = this.history.length - 1;
        } else if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            // Already at oldest entry
            return null;
        }
        
        return this.history[this.currentIndex];
    }
    
    /**
     * Navigate forward in history (Down arrow)
     */
    forward() {
        if (this.currentIndex === -1) {
            // Not browsing history
            return null;
        }
        
        this.currentIndex++;
        
        if (this.currentIndex >= this.history.length) {
            // Return to current input
            this.currentIndex = -1;
            return { expression: this.tempBuffer, result: null, isCurrent: true };
        }
        
        return this.history[this.currentIndex];
    }
    
    /**
     * Get current history entry
     */
    getCurrent() {
        if (this.currentIndex === -1) {
            return null;
        }
        return this.history[this.currentIndex];
    }
    
    /**
     * Exit history browsing mode
     */
    exitBrowsing() {
        this.currentIndex = -1;
        this.tempBuffer = '';
    }
    
    /**
     * Check if currently browsing history
     */
    isBrowsing() {
        return this.currentIndex !== -1;
    }
    
    /**
     * Get all history entries
     */
    getAll() {
        return [...this.history];
    }
    
    /**
     * Clear all history
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.tempBuffer = '';
        console.log('🗑️ History cleared');
    }
    
    /**
     * Get last N entries
     */
    getLast(n) {
        return this.history.slice(-n);
    }
    
    /**
     * Get history length
     */
    length() {
        return this.history.length;
    }
    
    /**
     * Save history to localStorage
     */
    save() {
        try {
            localStorage.setItem('calculator_history', JSON.stringify(this.history));
            return true;
        } catch (error) {
            console.error('Failed to save history:', error);
            return false;
        }
    }
    
    /**
     * Load history from localStorage
     */
    load() {
        try {
            const saved = localStorage.getItem('calculator_history');
            if (saved) {
                this.history = JSON.parse(saved);
                console.log(`📂 Loaded ${this.history.length} history entries`);
                return true;
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
        return false;
    }
    
    /**
     * Display history in console
     */
    display() {
        console.log('📜 Calculation History:');
        if (this.history.length === 0) {
            console.log('  (empty)');
            return;
        }
        
        this.history.forEach((entry, index) => {
            console.log(`  ${index + 1}. ${entry.expression} = ${entry.result}`);
        });
    }
}

// Create global instance
const historyManager = new HistoryManager();

// Export
window.HistoryManager = HistoryManager;
window.historyManager = historyManager;