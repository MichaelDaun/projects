/**
 * Represents a system window with draggable functionality and close/minimize controls.
 * This custom element uses Shadow DOM for encapsulated styles and content.
 * New system windows should inherit the base from this class.
 */
export class SystemWindow extends HTMLElement {
  constructor (title = 'Untitled', enableCloseButton = true, enableMinimizeButton = true, enableMaximizeButton = true) {
    super()
    this.attachShadow({ mode: 'open' })

    this.windowHandler = null
    this.windowMaximized = false
    this.minimizeHeightSetting = null
    this.minimizeWidthSetting = null
    this.savedPosition = { x: 0, y: 0 }

    this.terminateWindow = () => {
      this.windowHandler.removeEventListeners()
      document.removeEventListener('keydown', this.escapeKeyListenerCallback)
      this.remove()
    }

    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" type="text/css" href="css/style.css">
      <div class="system-window" tabindex="0">
        <!-- Title bar -->
        <div class="system-window-header">
          <div class="system-window-header-controls">
            <button class="system-window-header-control close">×</button>
            <button class="system-window-header-control minimize">-</button>
            <button class="system-window-header-control maximize">⤢</button>
          </div>
          <span class="system-window-header-title">${title}</span>
        </div>
        <!-- Content area -->
        <div class="system-window-content"></div>
        <div class="system-footer">
        <span class="footer-time-date">12:45 PM | 18 Dec 2024</span>
        <span class="footer-version">PWD v1.0.0</span>
        <div class="footer-resize-handle">⇲</div>
        </div>
      </div>
      
    `
    this.attachListeners(enableCloseButton, enableMaximizeButton, enableMinimizeButton)

    // Here we add a call to update the clock 10 seconds
    this.updateTimeAndDate()
    setInterval(() =>
      this.updateTimeAndDate(), 10000)
  }

  attachListeners (enableCloseButton, enableMaximizeButton, enableMinimizeButton) {
    if (enableCloseButton) {
      this.attachCloseButtonListener()
    }
    if (enableMaximizeButton) {
      this.attachMaximizeButtonListener()
    }
    if (enableMinimizeButton) {
      this.attachMinimizeButtonListener()
    }
  }

  setWindowHandler (handler) {
    this.windowHandler = handler
  }

  /**
   * Handles the Escape key to terminate the window if it is focused.
   * @param {KeyboardEvent} event - The keyboard event.
   */
  escapeKeyListenerCallback = (event) => {
    const systemWindow = this.shadowRoot.querySelector('.system-window')
    if (event.key === 'Escape' && systemWindow.getAttribute('data-focused') === 'true') {
      this.terminateWindow()
    }
  }

  /**
   * Attaches event listeners to the close button for termination actions.
   */
  attachCloseButtonListener () {
    const closeButton = this.shadowRoot.querySelector('.close')
    closeButton.addEventListener('click', this.terminateWindow)
    document.addEventListener('keydown', this.escapeKeyListenerCallback)
  }

  attachMaximizeButtonListener () {
    const maximizeButton = this.shadowRoot.querySelector('.maximize')
    maximizeButton.addEventListener('click', this.onMaximizeButton)
  }

  attachMinimizeButtonListener () {
    const minimizeButton = this.shadowRoot.querySelector('.minimize')

    minimizeButton.addEventListener('click', () => {
      this.windowHandler.addToActivityBar()
    })
  }

  onMaximizeButton = () => {
    const systemWindow = this.shadowRoot.querySelector('.system-window')

    if (!this.windowMaximized) {
      this.minimizeHeightSetting = systemWindow.offsetHeight
      this.minimizeWidthSetting = systemWindow.offsetWidth
      this.savedPosition = { x: this.offsetLeft, y: this.offsetTop }
      systemWindow.style.width = '100vw'
      systemWindow.style.height = '100vh'
      this.style.left = '0'
      this.style.top = '0'
      this.windowMaximized = true
    } else {
      systemWindow.style.width = `${this.minimizeWidthSetting}px`
      systemWindow.style.height = `${this.minimizeHeightSetting}px`
      this.style.left = `${this.savedPosition.x}px`
      this.style.top = `${this.savedPosition.y}px`
      this.windowMaximized = false
    }
  }

  /**
   * Sets the position of the window on the screen.
   * @param {number} x - The X-coordinate for the window.
   * @param {number} y - The Y-coordinate for the window.
   */
  setPosition (x, y) {
    this.style.position = 'absolute'
    this.style.left = `${x}px`
    this.style.top = `${y}px`
  }

  setMinimumWidthAndHeight (minHeight, minWidth) {
    const systemWindow = this.shadowRoot.querySelector('.system-window')
    systemWindow.style.minHeight = `${minHeight}px`
    systemWindow.style.minWidth = `${minWidth}px`
  }

  /**
   * Sets the title of the window.
   * @param {string} title - The title to display in the window header.
   */
  setTitle (title) {
    const titleElement = this.shadowRoot.querySelector('.system-window-header-title')
    if (titleElement) {
      titleElement.textContent = title
    }
  }

  updateTimeAndDate () {
    const footerTimeDate = this.shadowRoot.querySelector('.footer-time-date')
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
    footerTimeDate.textContent = `${time}\u00A0\u00A0|\u00A0\u00A0${date}`
  }
}
