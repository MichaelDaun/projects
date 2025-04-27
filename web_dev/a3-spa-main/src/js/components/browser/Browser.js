import { SystemWindow } from '../SystemWindow'

/**
 * Represents a basic browser application for navigating web pages.
 * The browser supports URL navigation, back/forward navigation through history,
 * and refreshing the current page. It uses an iframe for displaying content
 * and includes a simple URL bar for user interaction.
 */
export class Browser extends SystemWindow {
  constructor () {
    super('Browser')

    this.currentUrl = null
    this.browserHistory = []
    this.currentIndex = -1
    this.iframe = null
    this.urlInput = null

    const content = this.shadowRoot.querySelector('.system-window-content')

    content.innerHTML = `
      <style>
      .system-window-content {
      justify-content: space-between !important;
      padding: 2px !important;}
      </style>
      <div class="browser">
        <div class="url-bar">
          <button class="go-back-button">←</button>
          <button class="go-forward-button">→</button>
          <button class="refresh-button">⟳</button>
          <input type="text" class="url-input" placeholder="Enter URL (e.g., https://example.com)">
          <button class="go-button">Go</button>
        </div>
        <iframe class="iframe" src=""></iframe>
      </div>
  `
    this.setupUrlListener()
    this.setupRefreshListener()
    this.setupForwardAndBackwardListeners()
    this.setMinimumWidthAndHeight(430, 630)
  }

  /**
   * Navigates to the given URL, updating the browser history and the displayed page.
   * If the user navigates while not at the end of the history stack,
   * all forward entries are discarded.
   * @param {string} url - The URL to navigate to.
   */
  navigateToUrl = (url) => {
    // if currentIndex is less than last element discard all elements in array in front of us
    if (this.currentIndex < this.browserHistory.length - 1) {
      this.browserHistory = this.browserHistory.slice(0, this.currentIndex + 1)
    }

    this.browserHistory.push(url)
    this.currentIndex++
    this.currentUrl = url

    this.iframe.src = url
    this.urlInput.value = url
  }

  /**
   * Navigates back in the browser history, updating the displayed page and the URL input.
   */
  navigateBack = () => {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.currentUrl = this.browserHistory[this.currentIndex]
      this.iframe.src = this.currentUrl
      this.urlInput.value = this.currentUrl
    }
  }

  /**
   * Navigates forward in the browser history, updating the displayed page and the URL input.
   */
  navigateForward = () => {
    if (this.currentIndex < this.browserHistory.length - 1) {
      this.currentIndex++
      this.currentUrl = this.browserHistory[this.currentIndex]
      this.iframe.src = this.currentUrl
      this.urlInput.value = this.currentUrl
    }
  }

  /**
   * Sets up the URL input and Go button.
   * Adds listeners for handling user-entered URLs and loading pages.
   */
  setupUrlListener () {
    this.urlInput = this.shadowRoot.querySelector('.url-input')
    const goButton = this.shadowRoot.querySelector('.go-button')
    this.iframe = this.shadowRoot.querySelector('.iframe')

    goButton.addEventListener('click', () => {
      let url = this.urlInput.value
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      this.navigateToUrl(url)
    })

    this.urlInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        goButton.click()
      }
    })
  }

  /**
   * Sets up the Refresh button listener.
   * Reloads the current page in the iframe when the button is clicked.
   */
  setupRefreshListener () {
    const refreshButton = this.shadowRoot.querySelector('.refresh-button')
    refreshButton.addEventListener('click', () => {
      if (this.currentUrl) {
        this.iframe.src = this.currentUrl
      }
    })
  }

  /**
   * Sets up listeners for the Forward and Back buttons.
   * Navigates through the browser history when the respective button is clicked.
   */
  setupForwardAndBackwardListeners () {
    const forwardButton = this.shadowRoot.querySelector('.go-forward-button')
    const backButton = this.shadowRoot.querySelector('.go-back-button')

    forwardButton.addEventListener('click', this.navigateForward)
    backButton.addEventListener('click', this.navigateBack)
  }
}

customElements.define('browser-window', Browser)
