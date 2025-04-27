/**
 * Class responsible for initializing the main desktop view and its associated functionality
 */

export class Desktop extends HTMLElement {
  #backgroundImages
  constructor (backgroundImages) {
    super()
    this.#backgroundImages = backgroundImages
    this.innerHTML = `
          <div class="desktop">
        <div class="content">
          <!-- Main application content goes here -->
        </div>
        
        <!-- App Bars Container -->
        <div class="bars-container">
          <div class="app-bar">
            <div class="icons">
              <!-- App icons -->
            </div>
          </div>
          
          <div class="activity-bar"></div>
        </div>
      </div>`
  }

  setBackgroundImage () {
    const desktop = this.querySelector('.desktop')
    const randomIndex = Math.floor(Math.random() * this.#backgroundImages.length)
    console.log(`Background applied: ${this.#backgroundImages[randomIndex].url}`)
    desktop.style.backgroundImage = `url('${this.#backgroundImages[randomIndex].url}')`
    desktop.style.backgroundSize = 'cover'
    desktop.style.backgroundPosition = 'center'
    desktop.style.backgroundRepeat = 'no-repeat'
  }
}

customElements.define('desktop-ui', Desktop)
