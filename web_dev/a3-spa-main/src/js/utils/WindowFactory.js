import { WindowEventHandler } from './WindowEventHandler'
import { WindowManager } from './WindowManager'
import { config } from './config'

/**
 * A factory class for creating and managing application windows.
 */
export class WindowFactory {
  #windowManager
  #desktopUI

  /**
   * Creates an instance of WindowFactory.
   * @param {HTMLElement} desktopUI - The desktop UI container where windows will be appended.
   */
  constructor (desktopUI) {
    this.#windowManager = new WindowManager()
    this.#desktopUI = desktopUI
  }

  /**
   * Creates a new application window, positions it, and makes it draggable.
   * The new window will be focused and added to the desktop UI.
   * @param {Function} WindowClass - The class of the window to instantiate.
   * @param {...any} args - Additional arguments for the window constructor.
   */
  createWindow (WindowClass, ...args) {
    const position = this.#windowManager.calculateNewWindowPosition()

    const windowElement = new WindowClass(...args)

    windowElement.setPosition(position.x, position.y)

    // Apply drag and drop functionality
    const allApps = config.apps
    const windowHandler = new WindowEventHandler(windowElement, this.#windowManager, allApps)
    windowElement.windowHandler = windowHandler
    // Set up new window on top and focus it when it starts
    windowHandler.setFocusAndUpdateZIndex()
    this.#desktopUI.appendChild(windowElement)
    windowElement.shadowRoot.querySelector('.system-window').focus()
  }
}
