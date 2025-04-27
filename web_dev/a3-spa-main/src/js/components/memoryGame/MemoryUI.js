/**
 * Handles the UI logic for the Memory game, including rendering screens,
 * updating elements, and managing the game grid.
 */
export class MemoryUI {
  #systemWindowContent
  #backsideImage

  /**
   * Initializes the MemoryUI instance.
   * @param {HTMLElement} systemWindow - The main system window container for the Memory game.
   */
  constructor (systemWindow) {
    this.#systemWindowContent = systemWindow.querySelector('.system-window-content')
    this.#backsideImage = null
  }

  /**
   * Renders the start screen with grid size options and a play button.
   */
  startScreenUI () {
    this.#systemWindowContent.innerHTML = `
      <h2 class="memory-title">Choose Grid Size</h2>
      <div class="grid-options">
        <button class="grid-option" data-mode="2x2">2x2</button>
        <button class="grid-option" data-mode="2x4">2x4</button>
        <button class="grid-option" data-mode="4x4">4x4</button>
        <button class="grid-option" data-mode="4x6">4x6</button>
      </div>
      <button class="system-button play-button">Play</button>
    `
  }

  /**
   * Renders the main game screen, including the score and timer.
   */
  gameScreen () {
    this.#systemWindowContent.innerHTML = `
      <div class='game-info-bar'>
        <!-- Here we display Clock, Score -->
        <div class='memory-score'>Score: 0</div>
        <div class='memory-clock'>Time: 0:00</div>
        <div class='memory-attempts'>Attempts: 0</div>
      </div>
      <div class='memory-grid'>
        <!-- Memory tiles will be generated here -->
      </div>
    `
  }

  /**
   * Displays a game-over message and provides an option to restart the game.
   */
  displayGameOverMessage () {
    const memoryGrid = this.#systemWindowContent.querySelector('.memory-grid')
    this.#disableCards()

    // Create an overlay div for the message
    const overlay = document.createElement('div')
    overlay.classList.add('game-over-overlay')

    overlay.innerHTML = `
      <h2>Congratulations!</h2>
      <h2>You Won!</h2>
      <button class="system-button restart-button">Play Again</button>
    `

    // Append the overlay to the grid
    memoryGrid.appendChild(overlay)
  }

  /**
   * Disables interaction with all memory cards.
   * @private
   */
  #disableCards () {
    const cards = this.#systemWindowContent.querySelectorAll('.memory-card')
    cards.forEach(card => {
      card.style.pointerEvents = 'none'
      card.setAttribute('tabindex', '-1') // Remove from tab order
    })
  }

  /**
   * Renders the memory grid with backside cards based on the selected rows and columns.
   * @param {Array} tiles - Array of tile objects containing card data.
   * @param {object} backsideTile - Object representing the backside of the cards.
   * @param {number} rows - Number of rows in the grid.
   * @param {number} cols - Number of columns in the grid.
   */
  renderBacksideCards (tiles, backsideTile, rows, cols) {
    this.#backsideImage = backsideTile.url
    const memoryGrid = this.#systemWindowContent.querySelector('.memory-grid')

    // Clear the grid (in case of re-renders)
    memoryGrid.innerHTML = ''

    let tileIndex = 0

    // Loop through rows
    for (let row = 0; row < rows; row++) {
      const rowDiv = document.createElement('div')
      rowDiv.classList.add('memory-row') // Add a class for row styling

      // Loop through columns
      for (let col = 0; col < cols; col++) {
        if (tileIndex < tiles.length) {
          const tile = tiles[tileIndex]
          const card = document.createElement('button')
          card.classList.add('memory-card')
          card.style.backgroundImage = `url('${backsideTile.url}')` // Display backside initially
          card.setAttribute('data-id', tile.id) // Store tile ID for game logic

          // Append the card to the current row
          rowDiv.appendChild(card)

          tileIndex++
        }
      }

      // Append the row to the grid
      memoryGrid.appendChild(rowDiv)
    }
  }

  /**
   * Flips a memory card to reveal its front or backside.
   * @param {HTMLElement} card - The memory card element to flip.
   * @param {string} cardImageUrl - The URL of the front image of the card.
   */
  flipCard (card, cardImageUrl) {
    if (!card.classList.contains('flipped')) {
      card.classList.toggle('flipped')
      card.style.backgroundImage = `url('${cardImageUrl}')`
    } else {
      card.classList.toggle('flipped')
      card.style.backgroundImage = `url('${this.#backsideImage}')`
    }
  }

  /**
   * Updates the timer element with the elapsed time.
   * @param {number} secondsElapsed - The time elapsed in seconds.
   */
  updateTimer (secondsElapsed) {
    const clockElement = this.#systemWindowContent.querySelector('.memory-clock')
    const minutes = Math.floor(secondsElapsed / 60)
    const remainingSeconds = secondsElapsed % 60
    clockElement.textContent = `Time: ${minutes}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  /**
   * Updates the score element with the current score.
   * @param {number} score - The current score.
   */
  updateScore (score) {
    const scoreElement = this.#systemWindowContent.querySelector('.memory-score')
    scoreElement.textContent = `Score: ${score}`
  }

  /**
   * Updates the number of attempts made by the user.
   * @param {number} numberOfAttempts - The number of attempts.
   */
  updateNumberOfAttempts (numberOfAttempts) {
    const attemptsCounter = this.#systemWindowContent.querySelector('.memory-attempts')
    attemptsCounter.textContent = `Attempts: ${numberOfAttempts}`
  }

  playSoundEffect (effectUrl) {
    const messageSound = new Audio(effectUrl)

    messageSound.volume = 0.5
    messageSound.play().catch(error => {
      console.error('Failed to play sound:', error)
    })
  }
}
