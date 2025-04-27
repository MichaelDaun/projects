/**
 * @file quiz.js
 * @description Implements the main game logic for the quiz application. Manages game
 * states, including question fetching, answer validation, scoring, and transitions
 * between gameplay, game over, and restart states.
 *
 * Handles interactions between the UI, timer, and server, ensuring smooth coordination
 * and proper response to user actions.
 */

import { fetchQuestion, postAnswer } from './api.js'
import { renderQuestion, updateQuestionCounter, renderAnswerAlternatives, displayErrorMessage, displayGameOverScreen, displayWinScreen, displayChooseNameScreen, setupDefaultGameUI, updateTimerUI, updateScoreUI, updatePlayerNameUI } from './quizUI.js'
import { Timer } from './timer.js'
import { getHighScoresFormatted, saveToHighscore } from './highscores.js'

export class Quiz {
  #playerName
  #score
  #currentQuestion
  #numberOfQuestionsAnswered
  #nextURL
  #totalTime
  #currentState
  #timer
  #startingURL

  /**
   * Creates a new Quiz instance.
   * @param {string} startingURL - The initial URL for fetching the first question.
   */
  constructor (startingURL) {
    this.#playerName = ' '
    this.#score = 0
    this.#currentQuestion = null
    this.#numberOfQuestionsAnswered = 0
    this.#nextURL = startingURL
    this.#totalTime = 0
    this.#currentState = 'selectName' // answerState, gameOver, errorState
    this.#startingURL = startingURL

    this.#timer = new Timer(10,
      (timeRemaining) => updateTimerUI(timeRemaining),
      () => this.#endGame()
    )
  }

  /**
   * Starts the quiz by resetting the game state, initializing the timer,
   * and displaying the name entry screen. When user has chosen a name
   * it calls on function to fetch question and render the default game UI.
   */
  startGame () {
    this.#resetGame()
    updateScoreUI(this.#score)
    console.log('A new game has started!')
    document.addEventListener('keypress', this.#handleKeyPress)

    this.#playerName = displayChooseNameScreen(getHighScoresFormatted(), (choosenName) => {
      // remember javascript can compare whatever you throw at it...
      // will return first "truthy" value in the or-operator
      this.#playerName = choosenName || 'Bombi Bitt'

      updatePlayerNameUI(this.#playerName)
      this.#nextQuestion()
      this.#currentState = 'answerState'
      setupDefaultGameUI(() => this.#validateAnswer())
    })
  }

  /**
   * Fetches the next question from the API and updates the UI to display it.
   * Starts the timer for the question.
   * @throws Will log an error if the question cannot be fetched.
   */
  async #nextQuestion () {
    try {
      this.#currentQuestion = await fetchQuestion(this.#nextURL)
      this.#updateUINewQuestion(this.#currentQuestion, this.#numberOfQuestionsAnswered)
      this.#nextURL = this.#currentQuestion.nextURL
      this.#timer.start()
    } catch (error) {
      console.error('Failed to start the game: ', error)
      displayErrorMessage('Something went wrong. Please try again.', () => this.startGame())
    }
  }

  /**
   * Updates the UI with the newly fetched question, alternatives,
   * and question counter.
   * @param {object} currentQuestion - The current question object to render.
   */
  #updateUINewQuestion (currentQuestion) {
    this.#numberOfQuestionsAnswered++
    renderQuestion(currentQuestion)
    renderAnswerAlternatives(currentQuestion)
    updateQuestionCounter(this.#numberOfQuestionsAnswered)
  }

  /**
   * Validates the user's answer by checking the selected radio button or
   * free text input. Updates the score and fetches the next question
   * or ends the game based on the response.
   */
  async #validateAnswer () {
    const userAnswer = this.#getSelectedAnswer()
    if (!userAnswer) {
      console.log('No answer provided')
      return
    }

    try {
      const response = await postAnswer(this.#nextURL, userAnswer)

      // Correct answer, update score & next URL
      if (response.correct) {
        this.#score += Math.round((this.#timer.timeRemaining ** 2) * (1 * Math.PI))
        this.#totalTime += 10 - this.#timer.timeRemaining
        this.#timer.reset()
        this.#nextURL = response.nextURL
        updateScoreUI(this.#score)
        console.log(response.message)

        if (this.#nextURL) {
          this.#nextQuestion(this.#nextURL)
        } else {
          this.#gameWon()
        }
      } else {
        console.log('Wrong answer!')
        this.#endGame()
      }
    } catch (error) {
      // Something unexpected happens...
      console.error('Error validating answer: ', error)
      displayErrorMessage('An unexpected error occurred, please try again.',
        () => this.startGame)
    }
  }

  /**
   * Stops the game, resets the timer, and displays the game-over screen.
   */
  #endGame () {
    this.#timer.stop()
    console.log('Game Over')
    this.#currentState = 'gameOver'
    this.#nextURL = this.#startingURL
    displayGameOverScreen(this.#score, getHighScoresFormatted(), () => {
      this.startGame()
      this.#currentState = 'selectName'
    })
  }

  /**
   * Stops the game, resets the timer, and displays the game-won screen.
   * Saves the user's high score.
   */
  #gameWon () {
    this.#timer.stop()
    console.log('No more questions, user won!')
    this.#currentState = 'gameOver'
    saveToHighscore(this.#playerName, this.#score, this.#totalTime)
    this.#nextURL = this.#startingURL
    displayWinScreen(this.#score, this.#totalTime, this.#playerName, getHighScoresFormatted(), () => {
      this.startGame()
      this.#currentState = 'selectName'
    })
  }

  /**
   * Resets the game state and UI, removing lingering event listeners and
   * resetting variables.
   */
  #resetGame () {
    // Clear the quiz area and remove any lingering event listeners or elements
    document.removeEventListener('keypress', this.#handleKeyPress)
    const quizArea = document.getElementById('quiz-area')
    quizArea.innerHTML = '' // Clear the DOM

    // Reset state variables
    this.#currentQuestion = null
    this.#numberOfQuestionsAnswered = 0
    this.#score = 0
    this.#totalTime = 0
    this.#timer.reset()
    this.#playerName = ' '
    updatePlayerNameUI(this.#playerName)
  }

  /**
   * Retrieves the user's selected answer from either radio buttons or
   * a free-text input.
   * @returns {string|null} The user's answer or null if no selection.
   */
  #getSelectedAnswer () {
    // Begin to check if a radio button has been pressed
    const selectedRadio = document.querySelector('input[type="radio"]:checked')
    if (selectedRadio) {
      return selectedRadio.id
    }

    const textInput = document.getElementById('free-text-answer')
    if (textInput) {
      return textInput.value
    }

    // If no value is selected
    return null
  }

  /**
   * Handles the Enter keypress event and triggers the corresponding
   * button click based on the current game state.
   * @param {KeyboardEvent} event - The keypress event object.
   */
  #handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      let buttonToClick = null

      switch (this.#currentState) {
        case 'selectName':
          buttonToClick = document.getElementById('start-game-button')
          break

        case 'answerState':
          buttonToClick = document.getElementById('submit-answer')
          break

        default:
          buttonToClick = document.getElementById('restart-button')
          break
      }

      if (buttonToClick) {
        buttonToClick.click()
      }
    }
  }
}
