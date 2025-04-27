import { getAppIcon } from './HelperFunctions'
import { WindowFactory } from './WindowFactory'

/**
 * A factory class for creating app icons and launching app windows.
 */
export class AppFactory {
  #iconsDiv
  #windowFactory

  /**
   * Creates an instance of AppFactory.
   * @param {HTMLElement} iconsDiv - The container element where app icons will be appended.
   * @param {WindowFactory} windowFactory - The factory used to create app windows.
   */
  constructor (iconsDiv, windowFactory) {
    this.#iconsDiv = iconsDiv
    this.#windowFactory = windowFactory
  }

  /**
   * Creates and appends an app icon to the iconsDiv container.
   * Sets up the app to launch in a new window when the icon is clicked.
   * @param {string} appName - The name of the app to display as a tooltip.
   * @param {Function} AppClass - The class of the app to instantiate.
   * @param {...any} args - Additional arguments to pass to the app constructor.
   */
  createAppIcon (appName, AppClass, ...args) {
    const button = document.createElement('button')
    button.classList.add('icon-button')
    const iconImage = getAppIcon(appName)
    button.style.backgroundImage = `url('${iconImage}')`
    button.setAttribute('title', appName)

    // Addition of debounceTimer to avoid several windows opened with one click
    let debounceTimer = null

    // Launch callback to create a window for the app
    button.addEventListener('click', () => {
      if (debounceTimer) return
      console.log(`Launching ${appName}`)
      this.#windowFactory.createWindow(AppClass, ...args) // Pass args to createWindow

      debounceTimer = setTimeout(() => {
        debounceTimer = null
      }, 100)
    })

    this.#iconsDiv.appendChild(button)
  }
}
