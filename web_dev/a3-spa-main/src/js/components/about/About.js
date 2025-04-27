import { SystemWindow } from '../SystemWindow'

/**
 * Represents the "About" window of the Personal Web Desktop application.
 * Displays information about the application, including the author and purpose.
 */
export class About extends SystemWindow {
  constructor () {
    super('About')
    const content = this.shadowRoot.querySelector('.system-window-content')

    content.innerHTML = `
      <div class="about-container">
        <!-- Header Section -->
        <div class="about-header">
          <h2>About This Application</h2>
        </div>

        <!-- Content Section -->
        <div class="about-content">
          <h3>Author</h3>
          <p>Michael Daun</p>

          <h3>Purpose</h3>
          <p>
            This application is developed as the final assignment in the course Web Programming 1DV528 (Part 1).
            The application is a Personal Web Desktop built with JavaScript as a Single Page Application.
          </p>
      </div>`
  }

  connectedCallback () {
    // Setting min width and height for the about window
    // This is purely for visual esthetics
    this.setMinimumWidthAndHeight(470, 440)
  }
}

customElements.define('about-window', About)
