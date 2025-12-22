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

// Make functions globally accessible
window.saveToStorage = saveToStorage;
window.loadFromStorage = loadFromStorage;
window.clearStorage = clearStorage;
window.isStorageAvailable = isStorageAvailable;
