/**
 * Storage Module
 * Handles localStorage operations for persisting calculator state
 */

const STORAGE_KEY = 'casio_fx991es_plus_data';

/**
 * Save data to localStorage
 * @param {Object} data - Data to save
 */
function saveToStorage(data) {
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, jsonData);
        console.log('💾 Data saved to storage');
        return true;
    } catch (error) {
        console.error('❌ Failed to save to storage:', error);
        return false;
    }
}

/**
 * Load data from localStorage
 * @returns {Object|null} Saved data or null if not found
 */
function loadFromStorage() {
    try {
        const jsonData = localStorage.getItem(STORAGE_KEY);
        if (jsonData) {
            const data = JSON.parse(jsonData);
            console.log('📂 Data loaded from storage');
            return data;
        }
        return null;
    } catch (error) {
        console.error('❌ Failed to load from storage:', error);
        return null;
    }
}

/**
 * Clear all data from localStorage
 */
function clearStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('🗑️ Storage cleared');
        return true;
    } catch (error) {
        console.error('❌ Failed to clear storage:', error);
        return false;
    }
}

/**
 * Check if storage is available
 * @returns {boolean}
 */
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Save complete calculator state
 */
function saveCompleteState() {
    const state = window.calculatorState;
    
    const completeState = {
        version: '1.0.0',
        timestamp: Date.now(),
        angleUnit: state.angleUnit,
        precision: state.precision,
        mode: state.mode,
        memory: state.memory,
        lastAns: state.lastAns,
        modeData: window.modeManager ? window.modeManager.modeData : {}
    };
    
    return saveToStorage(completeState);
}

/**
 * Load complete calculator state
 */
function loadCompleteState() {
    const saved = loadFromStorage();
    
    if (!saved) return null;
    
    const state = window.calculatorState;
    
    // Restore basic state
    state.angleUnit = saved.angleUnit || 'DEG';
    state.precision = saved.precision || 10;
    state.mode = saved.mode || 'Math';
    state.memory = saved.memory || state.memory;
    state.lastAns = saved.lastAns || 0;
    
    // Restore mode data
    if (saved.modeData && window.modeManager) {
        window.modeManager.modeData = saved.modeData;
    }
    
    console.log('📂 Complete state loaded');
    return saved;
}

/**
 * Auto-save on changes
 */
function enableAutoSave() {
    // Save state when window closes
    window.addEventListener('beforeunload', () => {
        saveCompleteState();
    });
    
    // Save state periodically (every 30 seconds)
    setInterval(() => {
        saveCompleteState();
    }, 30000);
    
    console.log('💾 Auto-save enabled');
}

// Export new functions
window.saveCompleteState = saveCompleteState;
window.loadCompleteState = loadCompleteState;
window.enableAutoSave = enableAutoSave;

// Make functions globally accessible
window.saveToStorage = saveToStorage;
window.loadFromStorage = loadFromStorage;
window.clearStorage = clearStorage;
window.isStorageAvailable = isStorageAvailable;
