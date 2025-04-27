/**
 * Handles base functionalities for system windows, including focus management
 * and updating the z-index for window stacking.
 * Provides a common foundation for window event handling.
 */
export class BaseWindowHandler {
  /**
   * Initializes a new instance of the BaseWindowHandler class.
   * @param {HTMLElement} targetElement - The window element being managed.
   * @param {object} windowManager - The manager handling z-index and other window properties.
   * @param {Array<string>} allApps - A list of selectors for all app windows.
   */
  constructor (targetElement, windowManager, allApps) {
    this.targetElement = targetElement
    this.windowManager = windowManager
    this.allApps = allApps

    document.addEventListener('keydown', this.onTabWindowFocus)
  }

  /**
   * Sets focus on the current window and updates its DOM attributes.
   * Ensures only one window is marked as focused at a time.
   */
  setFocus () {
    const allAppTags = this.allApps.join(',')

    // For each window set in the DOM set data-focused to false
    const allWindows = document.querySelectorAll(allAppTags)
    allWindows.forEach(window => {
      const content = window.shadowRoot?.querySelector('.system-window')
      if (content) {
        content.setAttribute('data-focused', 'false')
      }
    })

    // For this particular window, set data-focused true
    const activeContent = this.targetElement.shadowRoot.querySelector('.system-window')
    if (activeContent) {
      activeContent.setAttribute('data-focused', 'true')
    }
  }

  /**
   * Sets focus on the current window and updates its z-index for proper stacking.
   * Ensures the window appears on top of others in the interface.
   */
  setFocusAndUpdateZIndex () {
    this.targetElement.style.zIndex = this.windowManager.zIndexCounter
    this.setFocus()
  }

  /**
   * Event listener for the Tab key to manage window focus changes.
   * If the Tab key is pressed and the current element is active, it updates the focus and z-index.
   * @param {KeyboardEvent} event - The keyboard event object.
   */
  onTabWindowFocus = (event) => {
    if (event.key === 'Tab') {
      if (document.activeElement === this.targetElement) {
        this.setFocusAndUpdateZIndex()
      }
    }
  }

  /**
   * Removes the base event listeners for the window.
   * Specifically detaches the Tab key listener for focus changes.
   */
  removeBaseListeners () {
    document.removeEventListener('keydown', this.onTabWindowFocus)
  }
}
