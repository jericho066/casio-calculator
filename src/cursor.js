/**
 * Cursor Management System
 * Handles cursor position, navigation, and display
 */

class CursorManager {
    constructor() {
        this.position = 0;  // Cursor position in input buffer
        this.visible = true;
        this.blinkInterval = null;
        this.startBlinking();
    }
    
    /**
     * Get current cursor position
     */
    getPosition() {
        return this.position;
    }
    
    /**
     * Set cursor position
     */
    setPosition(pos, maxLength) {
        this.position = Math.max(0, Math.min(pos, maxLength));
    }
    
    /**
     * Move cursor left
     */
    moveLeft() {
        if (this.position > 0) {
            this.position--;
            return true;
        }
        return false;
    }
    
    /**
     * Move cursor right
     */
    moveRight(maxLength) {
        if (this.position < maxLength) {
            this.position++;
            return true;
        }
        return false;
    }
    
    /**
     * Move to start of expression
     */
    moveToStart() {
        this.position = 0;
    }
    
    /**
     * Move to end of expression
     */
    moveToEnd(length) {
        this.position = length;
    }
    
    /**
     * Insert text at cursor position
     */
    insertAt(text, currentBuffer) {
        const before = currentBuffer.substring(0, this.position);
        const after = currentBuffer.substring(this.position);
        this.position += text.length;
        return before + text + after;
    }
    
    /**
     * Delete character at cursor position (backspace)
     */
    deleteAt(currentBuffer) {
        if (this.position === 0) return currentBuffer;
        
        const before = currentBuffer.substring(0, this.position - 1);
        const after = currentBuffer.substring(this.position);
        this.position--;
        return before + after;
    }
    
    /**
     * Delete character after cursor (DEL key)
     */
    deleteAfter(currentBuffer) {
        if (this.position >= currentBuffer.length) return currentBuffer;
        
        const before = currentBuffer.substring(0, this.position);
        const after = currentBuffer.substring(this.position + 1);
        return before + after;
    }
    
    /**
     * Start cursor blinking animation
     */
    startBlinking() {
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
        }
        
        this.visible = true;
        this.blinkInterval = setInterval(() => {
            this.visible = !this.visible;
            this.updateCursorDisplay();
        }, 500);
    }
    
    /**
     * Stop cursor blinking
     */
    stopBlinking() {
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
        this.visible = true;
    }
    
    /**
     * Update cursor display
     */
    updateCursorDisplay() {
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.style.opacity = this.visible ? '1' : '0';
        }
    }
    
    /**
     * Reset cursor to end
     */
    reset(length) {
        this.position = length;
        this.visible = true;
    }
}

// Create global instance
const cursorManager = new CursorManager();

// Export
window.CursorManager = CursorManager;
window.cursorManager = cursorManager;

