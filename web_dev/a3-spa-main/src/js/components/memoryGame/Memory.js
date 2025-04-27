import { SystemWindow } from '../SystemWindow'
import { MemoryUI } from './MemoryUI'
import { MemoryInputHandler } from './MemoryInputHandler'
import { getRandomNumbers, shuffleArray } from '../../utils/HelperFunctions'
import { MemoryTimer } from './MemoryTimer'

/**
 * Controller class for the Memory game application.
 * Manages game state, user interactions, and UI updates.
 */
export class Memory extends SystemWindow {
  #memoryIcons
  #backsideTile
  #memoryUI
  #memoryInputHandler
  #chosenGameMode
  #gameOver
  #currentCardSet
  #currentScore
  #firstCard
  #secondCard
  #memoryTimer
  #awaitCardTransition
  #numberOfAttempts
  #soundEffects

  /**
   * Initializes the Memory game with provided icons.
   * @param {Array<object>} memoryIcons - Array of memory card icons with IDs and URLs.
   * @param {Array<object>} soundEffects - Array of destination to sound effects used in the game.
   */
  constructor (memoryIcons, soundEffects) {
    super('Memory')
    // Initialize game state and UI components
    this.#gameOver = false
    this.#currentCardSet = []
    this.#firstCard = null
    this.#secondCard = null
    this.#currentScore = 0
    this.#numberOfAttempts = 0
    this.#awaitCardTransition = false
    this.#soundEffects = soundEffects
    this.#memoryIcons = memoryIcons.slice()
    this.#chosenGameMode = null
    // Begin to initiate memoryTiles array with the backside image
    // Note shift erases first index from array and returns it
    this.#backsideTile = this.#memoryIcons.shift()

    const systemWindow = this.shadowRoot.querySelector('.system-window')
    this.#memoryUI = new MemoryUI(systemWindow)
    this.#memoryInputHandler = new MemoryInputHandler(systemWindow, this.startCallBack, this.updateGameModeCallBack, this.resetGame)
    this.#memoryTimer = new MemoryTimer()

    // Initialize the start screen
    this.#memoryUI.startScreenUI()
    this.#memoryInputHandler.initializeListeners()
  }

  /**
   * Displays the menu screen for the Memory game.
   */
  menuScreen () {
    this.#memoryInputHandler.removeGameOverListeners()
    this.#memoryUI.startScreenUI()
    this.setScreenDimensions()
    this.#memoryInputHandler.initializeListeners()
  }

  /**
   * Starts the game based on the chosen game mode.
   */
  startGame () {
    if (this.#chosenGameMode) {
      console.log(`User has chosen ${this.#chosenGameMode[0]} x ${this.#chosenGameMode[1]}`)
      console.log('New Game Starts!')
      this.#memoryInputHandler.removeGridMenuListeners()
      this.#memoryUI.gameScreen()
      this.setScreenDimensions()
      this.#memoryTimer.startClock((secondsElapsed) => {
        this.#memoryUI.updateTimer(secondsElapsed)
      })
      const rows = this.#chosenGameMode[0]
      const columns = this.#chosenGameMode[1]
      this.#memoryUI.renderBacksideCards(this.prepareTiles(), this.#backsideTile, rows, columns)
      // Adds small delay to not trigger card flip in game screen
      this.#memoryTimer.delayAction(0.1, () => {
        this.#memoryInputHandler.cardSelectionListener(this.onCardSelected)
        this.#memoryInputHandler.arrowNavigationListener(columns)
      })
    }
  }

  setScreenDimensions () {
    const dimensionsMap = {
      4: { width: 535, height: 500 },
      8: { width: 620, height: 620 },
      16: { width: 750, height: 750 },
      24: { width: 900, height: 900 }
    }

    if (!this.#chosenGameMode) {
      this.setMinimumWidthAndHeight(470, 445)
      return
    }

    const key = this.#chosenGameMode[0] * this.#chosenGameMode[1]
    const dimensions = dimensionsMap[key]
    this.setMinimumWidthAndHeight(dimensions.height, dimensions.width)
  }

  /**
   * Checks if the game is over and handles end-of-game logic.
   */
  checkGameOver () {
    if (this.#currentCardSet.length === 0) {
      console.log('Game Over! All Cards Matched.')
      this.#gameOver = true
      // Display game over screen and initiate listener for restart
      this.#memoryInputHandler.removeGameScreenListeners()
      this.#memoryTimer.stopClock()
      // This small delay makes the enter press not trigger the restart button in the next screen
      this.#memoryTimer.delayAction(0.1, () => {
        this.#memoryUI.displayGameOverMessage()
        this.#memoryInputHandler.setupRestartButton()
        this.#memoryUI.playSoundEffect(this.#soundEffects.gameOverVictory)
      })
    }
  }

  /**
   * Resets the game state and navigates back to the menu screen.
   */
  resetGame = () => {
    this.#gameOver = false
    this.#currentCardSet = []
    this.#currentScore = 0
    this.#numberOfAttempts = 0
    this.#firstCard = null
    this.#secondCard = null
    this.#chosenGameMode = null
    this.#awaitCardTransition = false
    this.#memoryInputHandler.removeGameOverListeners()
    this.menuScreen()
  }

  resetFirstAndSecondCard () {
    this.#firstCard = null
    this.#secondCard = null
    return true
  }

  startCallBack = () => {
    this.startGame()
  }

  /**
   * Handles card selection logic when a card is clicked.
   * @param {HTMLElement} card - The selected card element.
   */
  onCardSelected = (card) => {
    if (!this.checkIfSelectionValid(card)) {
      return
    }

    const cardId = card.getAttribute('data-id')
    this.#memoryUI.flipCard(card, this.fetchCardImageUrl(cardId))

    if (!this.#firstCard) {
      console.log(`Card with id: ${cardId} picked as first card`)
      this.#firstCard = card
      this.#memoryUI.playSoundEffect(this.#soundEffects.flipCard1)
    } else if (!this.#secondCard) {
      console.log(`Card with id: ${cardId} picked as second card`)
      this.#secondCard = card
    }

    // we exit here because there is no point in checking for match with only one card selected
    if (!this.#firstCard || !this.#secondCard) {
      return
    }

    // Check for match
    if (this.#firstCard.getAttribute('data-id') === this.#secondCard.getAttribute('data-id')) {
      console.log('Cards match!')
      this.handleMatch()
      this.checkGameOver()
    } else {
      console.log('Cards do not match.')
      this.handleMismatch()
    }

    // Increment number of attempts made
    this.#numberOfAttempts++
    this.#memoryUI.updateNumberOfAttempts(this.#numberOfAttempts)
  }

  /**
   * Handles a successful match of two cards.
   */
  handleMatch () {
    this.#firstCard.setAttribute('data-matched', 'true')
    this.#secondCard.setAttribute('data-matched', 'true')
    this.#currentScore += this.calculateScore()
    this.#memoryUI.updateScore(this.#currentScore)
    this.#memoryUI.playSoundEffect(this.#soundEffects.flipCard2Match)
    // Remove matched card from card set we are using and check for game over
    const matchedCardId = this.#firstCard.getAttribute('data-id')
    this.#currentCardSet = this.#currentCardSet.filter(card => card.id !== matchedCardId)
    this.resetFirstAndSecondCard()
  }

  /**
   * Handles a mismatch of two cards.
   * Flips the cards back after a delay.
   */
  handleMismatch () {
    this.#memoryUI.playSoundEffect(this.#soundEffects.flipCard2NoMatch)
    this.#awaitCardTransition = true
    this.#memoryTimer.delayAction(1, () => {
      this.#memoryUI.flipCard(this.#firstCard, this.#backsideTile.url)
      this.#memoryUI.flipCard(this.#secondCard, this.#backsideTile.url)
      this.resetFirstAndSecondCard()
      this.#awaitCardTransition = false
    })
  }

  /**
   * Prepares the tiles for the game based on the chosen mode.
   * @returns {Array<object>} - Shuffled array of memory tiles.
   */
  prepareTiles () {
    const numberOfTilesToGenerate = (this.#chosenGameMode[0] * this.#chosenGameMode[1]) * 0.5
    const randomTilesIndices = getRandomNumbers(numberOfTilesToGenerate, this.#memoryIcons.length)
    const memoryTiles = []

    this.#memoryIcons.forEach((tile, index) => {
      if (randomTilesIndices.includes(index)) {
        memoryTiles.push(tile)
        memoryTiles.push(tile)
      }
    })

    // Shuffle and return array
    const shuffledTiles = shuffleArray(memoryTiles)
    this.#currentCardSet = shuffledTiles
    return shuffledTiles
  }

  /**
   * Updates the chosen game mode based on user input.
   * @param {string} mode - The chosen game mode (e.g., '4x4').
   */
  updateGameModeCallBack = (mode) => {
    const [rows, cols] = mode.split('x').map(Number)
    this.#chosenGameMode = [rows, cols]
    console.log(`Game mode updated to: ${rows} x ${cols}`)
  }

  /**
   * Retrieves the image URL for a card based on its ID.
   * @param {string} cardId - The ID of the card.
   * @returns {string} - The URL of the card image.
   */
  fetchCardImageUrl (cardId) {
    const card = this.#currentCardSet.find(card => card.id === cardId)
    return card.url
  }

  /**
   * Validates if a card selection is valid based on game rules.
   * @param {HTMLElement} card - The card element being checked.
   * @returns {boolean} - Returns true if the selection is valid, otherwise false.
   */
  checkIfSelectionValid (card) {
    // Check if the chosen cards have had time to flip back
    if (this.#awaitCardTransition) {
      console.log('Chosen cards has to be reset first')
      return false
    }

    // Check if card has been matched already
    if (card.getAttribute('data-matched') === 'true') {
      console.log('Card has already been matched')
      return false
    }
    // Is the first picked card selected twice
    if (this.#firstCard && this.#firstCard === card) {
      console.log('Cannot pick the same card twice')
      return false
    }

    return true
  }

  /**
   * Calculates the score based on the game mode and time elapsed.
   * @returns {number} - The calculated score.
   */
  calculateScore () {
    const gameModeFactor = this.#chosenGameMode[0] * this.#chosenGameMode[1]
    const timeFactor = Math.max(this.#memoryTimer.timeElapsed, 1)
    const score = (Math.PI ** Math.E) * gameModeFactor * (1 + (747 / timeFactor))
    return Math.round(score)
  }
}

customElements.define('memory-game', Memory)
