/**
 * Handles input events for the Memory game.
 */
export class MemoryInputHandler {
  #systemWindow
  #systemWindowContent
  #startCallback
  #updateGameModeCallback
  #resetGame

  /**
   * Creates an instance of MemoryInputHandler.
   * @param {HTMLElement} systemWindow - The root system window element.
   * @param {Function} startCallback - Callback to start the game.
   * @param {Function} updateGameModeCallback - Callback to update the game mode.
   * @param {Function} resetGame - Callback to reset the game.
   */
  constructor (systemWindow, startCallback, updateGameModeCallback, resetGame) {
    this.#systemWindow = systemWindow
    this.#systemWindowContent = systemWindow.querySelector('.system-window-content')
    this.#startCallback = startCallback
    this.#updateGameModeCallback = updateGameModeCallback
    this.#resetGame = resetGame
  }

  initializeListeners () {
    this.startButtonListener()
    this.gridButtonListeners()
  }

  /**
   * Sets up the start button listener to trigger the start callback.
   */
  startButtonListener () {
    const startButton = this.#systemWindowContent.querySelector('.play-button')
    startButton.addEventListener('click', this.#startCallback)
  }

  /**
   * Sets up listeners for grid navigation and selection.
   * Enables arrow key navigation and click handling for grid options.
   */
  gridButtonListeners () {
    const gridButtons = Array.from(this.#systemWindowContent.querySelectorAll('.grid-option'))
    const playButton = this.#systemWindowContent.querySelector('.play-button')

    // Focus the first grid button initially
    gridButtons[0].focus()

    this.handleGridKeydown = (event) => {
      // Only handle key events if window is focused
      if (this.#systemWindow.getAttribute('data-focused') !== 'true') {
        return
      }

      const currentElement = this.#systemWindowContent.querySelector(':focus')
      const currentIndex = gridButtons.indexOf(currentElement)
      let nextIndex = -1

      switch (event.key) {
        case 'ArrowLeft':
          nextIndex = currentIndex - 1
          break
        case 'ArrowRight':
          nextIndex = currentIndex + 1
          break
        case 'ArrowDown':
          playButton.focus()
          return
        case 'ArrowUp':
          if (currentElement === playButton) {
            gridButtons[1].focus()
            nextIndex = 1
            return
          }
          break
        case 'Enter':
        case ' ':
          if (currentElement === playButton) {
            event.preventDefault()
            this.#startCallback()
          } else {
            const mode = gridButtons[currentIndex].getAttribute('data-mode')
            this.#updateGameModeCallback(mode)
            this.#startCallback()
          }
          return
      }

      gridButtons[nextIndex]?.focus()
    }

    this.#systemWindowContent.addEventListener('keydown', this.handleGridKeydown)

    this.handleGridClick = (event) => {
      const button = event.target.closest('.grid-option')
      const mode = button.getAttribute('data-mode')
      this.#updateGameModeCallback(mode)
    }

    gridButtons.forEach((button) => {
      button.addEventListener('click', this.handleGridClick)
    })
  }

  /**
   * Removes listeners for grid navigation and selection.
   */
  removeGridMenuListeners () {
    const gridButtons = this.#systemWindowContent.querySelectorAll('.grid-option')
    gridButtons.forEach((button) => {
      button.removeEventListener('click', this.handleGridClick)
    })
    this.#systemWindowContent.removeEventListener('keydown', this.handleGridKeydown)
  }

  /**
   * Sets up listeners for card selection in the game grid.
   * @param {Function} onCardSelectedCallback - Callback triggered when a card is selected.
   */
  cardSelectionListener (onCardSelectedCallback) {
    this.handleCardClick = (event) => {
      onCardSelectedCallback(event.target.closest('.memory-card'))
    }

    const memoryGrid = this.#systemWindowContent.querySelector('.memory-grid')
    memoryGrid.addEventListener('click', this.handleCardClick)

    this.handleCardKeyDown = (event) => {
      // Only handle key events if window is focused
      if (this.#systemWindow.getAttribute('data-focused') !== 'true') {
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        const focusedCard = this.#systemWindowContent.querySelector(':focus')
        if (focusedCard && focusedCard.classList.contains('memory-card')) {
          onCardSelectedCallback(focusedCard)
        }
      }
    }

    this.#systemWindowContent.addEventListener('keydown', this.handleCardKeyDown)
  }

  /**
   * Enables arrow key navigation within the game grid.
   * @param {number} columns - Number of columns in the grid.
   */
  arrowNavigationListener (columns) {
    const memoryGrid = this.#systemWindowContent.querySelector('.memory-grid')
    const cards = Array.from(memoryGrid.querySelectorAll('.memory-card'))
    const totalCards = cards.length

    // Focus the first card by default
    cards[0].focus()

    this.handleGridArrows = (event) => {
      // Only handle key events if window is focused
      if (this.#systemWindow.getAttribute('data-focused') !== 'true') {
        return
      }

      const currentIndex = cards.findIndex(card => card === this.#systemWindowContent.querySelector(':focus'))
      let nextIndex = -1

      switch (event.key) {
        case 'ArrowUp':
          nextIndex = currentIndex - columns
          break
        case 'ArrowDown':
          nextIndex = currentIndex + columns
          break
        case 'ArrowLeft':
          nextIndex = currentIndex - 1
          break
        case 'ArrowRight':
          nextIndex = currentIndex + 1
          break
      }

      if (nextIndex >= 0 && nextIndex < totalCards) {
        cards[nextIndex].focus()
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault()
      }
    }

    this.#systemWindowContent.addEventListener('keydown', this.handleGridArrows)
  }

  /**
   * Removes listeners related to the game grid during the game.
   */
  removeGameScreenListeners () {
    const memoryGrid = this.#systemWindowContent.querySelector('.memory-grid')
    memoryGrid.removeEventListener('click', this.handleCardClick)
    this.#systemWindowContent.removeEventListener('keydown', this.handleCardKeyDown)
  }

  /**
   * Sets up the restart button listener for the game.
   */
  setupRestartButton () {
    const restartButton = this.#systemWindowContent.querySelector('.restart-button')
    restartButton.addEventListener('click', this.#resetGame)
    restartButton.focus()

    restartButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        this.#resetGame()
      }
    })
  }

  /**
   * Removes listeners related to the game over screen.
   */
  removeGameOverListeners () {
    const restartButton = this.#systemWindowContent.querySelector('.restart-button')
    if (restartButton) {
      restartButton.removeEventListener('click', this.#resetGame)
      restartButton.removeEventListener('keydown', this.#resetGame)
    }
  }
}
