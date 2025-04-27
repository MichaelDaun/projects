import { SystemWindow } from '../SystemWindow'

/**
 * A custom window for changing the desktop background.
 * Allows users to select a background from predefined options and apply it to the desktop.
 */
export class BackgroundChanger extends SystemWindow {
  #backgrounds
  #selectedBackground
  #desktopUI

  /**
   * Creates a new instance of the BackgroundChanger app.
   * @param {Array<{name: string, url: string}>} backgrounds - Array of background options with names and image URLs.
   * @param {HTMLElement} desktopUI - The desktop element where the background will be applied.
   */
  constructor (backgrounds, desktopUI) {
    super('Change Background')
    this.#backgrounds = backgrounds
    this.#selectedBackground = null
    this.#desktopUI = desktopUI

    // Define unique content
    const content = this.shadowRoot.querySelector('.system-window-content')
    content.innerHTML = `
      <div class="pre-view-background"></div>
      <button class="system-button" id="apply-background">Apply Background</button>
    `

    this.generatePreviewButtons()
    this.setupApplyButton()
  }

  /**
   * Generates preview buttons for each available background.
   * Buttons are displayed in rows, with a new row created after every two buttons.
   */
  generatePreviewButtons () {
    const previewContainer = this.shadowRoot.querySelector('.pre-view-background')
    let currentRow = this.createRow(previewContainer)

    this.#backgrounds.forEach((background, index) => {
      if (index !== 0 && index % 2 === 0) {
        currentRow = this.createRow(previewContainer)
      }
      const button = document.createElement('button')
      button.classList.add('icon-button')
      button.style.backgroundImage = `url('${background.url}')`
      button.setAttribute('title', background.name)

      button.addEventListener('click', () => {
        this.#selectedBackground = background.url
        console.log(`Selected: ${background.name}`)
      })

      currentRow.appendChild(button)
    })
  }

  /**
   * Creates a new row container for preview buttons.
   * @param {HTMLElement} previewContainer - The container where rows are appended.
   * @returns {HTMLElement} - The newly created row element.
   */
  createRow (previewContainer) {
    const row = document.createElement('div')
    row.classList.add('pre-view-row')
    previewContainer.appendChild(row)
    return row
  }

  /**
   * Sets up the Apply Background button.
   * When clicked, it applies the selected background to the desktop.
   */
  setupApplyButton () {
    const applyButton = this.shadowRoot.querySelector('#apply-background')
    applyButton.addEventListener('click', () => {
      if (this.#selectedBackground) {
        console.log(`Applying background: ${this.#selectedBackground}`)
        this.#desktopUI.style.backgroundImage = `url('${this.#selectedBackground}')`
        this.#desktopUI.style.backgroundSize = 'cover'
        this.#desktopUI.style.backgroundPosition = 'center'
        this.#desktopUI.style.backgroundRepeat = 'no-repeat'
      } else {
        console.log('No background selected!')
      }
    })
  }
}

customElements.define('background-changer', BackgroundChanger)
