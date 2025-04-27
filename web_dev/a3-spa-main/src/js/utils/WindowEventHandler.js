import { BaseWindowHandler } from './BaseWindowHandler'
import { getAppIcon } from './HelperFunctions'

/**
 * Handles window events such as dragging, resizing, and minimizing.
 * Extends the BaseWindowHandler to add additional functionality for managing
 * interactions with system windows in the desktop environment.
 */
export class WindowEventHandler extends BaseWindowHandler {
  /**
   * Initializes the WindowEventHandler with target window, manager, and app references.
   * Sets up event listeners for dragging, resizing, and managing focus.
   * @param {HTMLElement} targetElement - The window element to be managed.
   * @param {object} windowManager - Manager for controlling window states like Z-index.
   * @param {Array<string>} allApps - List of app tag names used for managing focus.
   */
  constructor (targetElement, windowManager, allApps) {
    super(targetElement, windowManager, allApps)

    // Drag related setup
    this.isDragging = false
    this.offsetX = 0
    this.offsetY = 0
    this.header = this.targetElement.shadowRoot.querySelector('.system-window-header')
    this.footer = this.targetElement.shadowRoot.querySelector('.system-footer')
    this.header.addEventListener('mousedown', this.onDragAreaMouseDown)
    this.footer.addEventListener('mousedown', this.onDragAreaMouseDown)

    // Resize related setup
    this.isResizing = false
    this.systemWindow = this.targetElement.shadowRoot.querySelector('.system-window')
    this.footerHandle = this.targetElement.shadowRoot.querySelector('.footer-resize-handle')
    this.footerHandle.addEventListener('mousedown', this.onFooterMouseDown)

    // Common event handler for both drad and resizing
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  /**
   * Handles mouse down events for dragging the window.
   * Prevents dragging when interacting with buttons, input fields, or the resize handle.
   * @param {MouseEvent} event - The mouse down event.
   */
  onDragAreaMouseDown = (event) => {
    // Prevent dragging if user interacts with a button or input field
    if (event.target.tagName === 'BUTTON' ||
        event.target.tagName === 'INPUT' ||
        event.target.closest('.footer-resize-handle')
    ) {
      return
    }
    event.preventDefault()

    // Mark as moving, update focus and Z-index
    this.isDragging = true
    this.targetElement.dataset.moving = 'true'
    this.setFocusAndUpdateZIndex()

    // Record initial offset from top-left corner
    this.dragOffsetX = event.clientX - this.targetElement.offsetLeft
    this.dragOffsetY = event.clientY - this.targetElement.offsetTop
    this.header.style.cursor = 'grabbing'
    this.footer.style.cursor = 'grabbing'
  }

  /**
   * Handles mouse down events for resizing the window.
   * Sets up state for resizing and records the initial dimensions and cursor position.
   * @param {MouseEvent} event - The mouse down event.
   */
  onFooterMouseDown = (event) => {
    event.preventDefault()

    this.isResizing = true
    this.targetElement.dataset.resizing = 'true'

    this.setFocusAndUpdateZIndex()

    this.startWidth = this.systemWindow.offsetWidth
    this.startHeight = this.systemWindow.offsetHeight

    // Record initial mouse position
    this.startX = event.clientX
    this.startY = event.clientY
  }

  /**
   * Handles mouse move events for both dragging and resizing.
   * Updates the window position or size based on mouse movement.
   * @param {MouseEvent} event - The mouse move event.
   */
  onMouseMove = (event) => {
    event.preventDefault()

    // Dragging
    if (this.isDragging) {
      const newLeft = event.clientX - this.dragOffsetX
      const newTop = event.clientY - this.dragOffsetY
      this.targetElement.style.left = `${newLeft}px`
      this.targetElement.style.top = `${newTop}px`
    }

    // Resizing
    if (this.isResizing) {
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY

      // Calculate new dimensions and check what limit is applied
      const newWidth = this.startWidth + dx
      const newHeight = this.startHeight + dy
      const minWidth = parseInt(getComputedStyle(this.systemWindow).minWidth)
      const minHeight = parseInt(getComputedStyle(this.systemWindow).minHeight)

      // Check if new values are within bounds
      if (newWidth >= minWidth) {
        this.systemWindow.style.width = `${newWidth}px`
      }

      if (newHeight >= minHeight) {
        this.systemWindow.style.height = `${newHeight}px`
      }
    }
  }

  /**
   * Handles mouse up events to stop dragging or resizing.
   * Resets state and cursor styles.
   * @param {MouseEvent} event - The mouse up event.
   */
  onMouseUp = (event) => {
    event.preventDefault()

    // Stop dragging
    if (this.isDragging) {
      this.isDragging = false
      this.targetElement.dataset.moving = 'false'
      this.header.style.cursor = 'grab'
      this.footer.style.cursor = 'grab'
    }

    // Stop resizing
    if (this.isResizing) {
      this.isResizing = false
      this.targetElement.dataset.resizing = 'false'
    }
  }

  removeEventListeners () {
    this.header.removeEventListener('mousedown', this.onDragAreaMouseDown)
    this.footerHandle.removeEventListener('mousedown', this.onFooterMouseDown)

    // Remove shared mouse events
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    // Remove the base class (tab) listeners
    this.removeBaseListeners()
  }

  /**
   * Adds the current window to the activity bar with a minimized icon.
   * Clicking the icon restores the window to its original state.
   */
  addToActivityBar () {
    const activityBar = document.querySelector('.activity-bar')
    const button = document.createElement('button')
    const title = this.targetElement.shadowRoot.querySelector('.system-window-header-title').textContent
    button.classList.add('icon-button')
    button.classList.add('minimized-app-icon')
    button.style.backgroundImage = `url('${getAppIcon(title)}')`
    button.setAttribute('title', title)
    this.systemWindow.style.display = 'none'

    // Add eventListener to the button itself so it can be removed when pressed
    button.addEventListener('click', () => {
      button.remove()
      this.systemWindow.style.display = 'flex'
      this.setFocusAndUpdateZIndex()
    })

    activityBar.appendChild(button)
  }
}
