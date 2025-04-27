/**
 * @file quizUI.js
 * @description Provides functions to render and update the quiz application's user
 * interface. Manages the display of questions, answers, scores, and feedback messages.
 *
 * Includes logic for toggling the high score section and supporting keyboard shortcuts
 * for accessibility.
 */

/**
 * Renders the question text in the UI.
 * @param {object} question - The question object containing the question text.
 */
export function renderQuestion (question) {
  const questionText = document.getElementById('question-text')
  questionText.textContent = question.question
}

/**
 * Updates the question counter to display the current question number.
 * @param {number} questionNumber - The current question number.
 */
export function updateQuestionCounter (questionNumber) {
  const currentQuestion = document.getElementById('current-question-number')
  currentQuestion.innerHTML = ''
  currentQuestion.innerHTML = `Question #${questionNumber}!`
}

/**
 * Renders the answer alternatives in the UI.
 * Supports both multiple-choice and free-text answer types.
 * Listens to key press related to corresponding radio button, 1 for first alternative and so on.
 * @param {object} question - The question object containing alternatives or free-text input.
 */
export function renderAnswerAlternatives (question) {
  // This is reference to where the element be placed in the DOM
  const answerContainer = document.getElementById('answer-options')
  answerContainer.innerHTML = ''

  if ('alternatives' in question) {
    const ul = document.createElement('ul')

    // Loop through alternatives, object entries thing returns key-value pairs
    Object.entries(question.alternatives).forEach(([key, value], index) => {
      const li = document.createElement('li')
      const radio = document.createElement('input')
      radio.type = 'radio'
      radio.id = key
      radio.name = 'radio-buttons'
      radio.value = value

      // Create a symbol that hints to keyboard support
      const symbolHint = document.createElement('hint')
      symbolHint.className = 'hint-symbol'
      symbolHint.textContent = `(${(index + 1)}  )`

      const label = document.createElement('label')
      label.htmlFor = key
      label.textContent = value

      li.appendChild(symbolHint)
      li.appendChild(radio)
      li.appendChild(label)
      ul.appendChild(li)

      // Adds keyboard listener bound to question alternative
      document.addEventListener('keydown', (event) => {
        if (event.key === `${index + 1}`) {
          radio.checked = true
        }
      })
    })

    answerContainer.appendChild(ul)
  } else {
    const input = document.createElement('textarea')
    input.id = 'free-text-answer'
    input.placeholder = 'Type your answer here...'
    answerContainer.appendChild(input)
    input.focus() // This pre-selects the text container
  }
}

/**
 * Displays an error message and provides a restart option.
 * @param {string} errorMessage - The error message to display.
 * @param {Function} onRestartCallback - Callback function to restart the quiz.
 */
export function displayErrorMessage (errorMessage, onRestartCallback) {
  const errorMessageHTML = `<div class="error-message">
  <h2>${errorMessage}</h2>
  <button id="restart-button">Restart Quiz</button>
  </div>
  `
  updateQuizContainer('error-state', errorMessageHTML)
  document.getElementById('restart-button').addEventListener('click', () => {
    removeClass('quiz-area', 'error-state')
    onRestartCallback()
  })
}

/**
 * Displays the game over screen with the final score and high scores.
 * @param {number} finalScore - The user's final score.
 * @param {string} highscores - The formatted high scores to display.
 * @param {Function} onRestartCallback - Callback function to restart the quiz.
 */
export function displayGameOverScreen (finalScore, highscores, onRestartCallback) {
  const gameOverHTML = `
  <div class="game-over-message">
    <h2>Game Over!</h2>
    <p>Your final score: ${finalScore}</p>
    <div class="high-scores-section">
      <h3>Top 5 High Scores:</h3>
        <ul class="high-score-list">
          ${highscores}
        </ul>
      </div>
    <button id="restart-button">Try Again ⏎</button>
  </div>
  `
  updateQuizContainer('game-over-state', gameOverHTML)
  document.getElementById('restart-button').addEventListener('click', () => {
    removeClass('quiz-area', 'game-over-state')
    onRestartCallback()
  })
}

/**
 * Displays the win screen with the user's final score, total time, and high scores.
 * @param {number} score - The user's score.
 * @param {number} totalTime - The total time taken to complete the quiz.
 * @param {string} playerName - The name of the player.
 * @param {string} highscores - The formatted high scores to display.
 * @param {Function} onRestartCallback - Callback function to restart the quiz.
 */
export function displayWinScreen (score, totalTime, playerName, highscores, onRestartCallback) {
  const winScreenHTML = `
    <div class="win-message">
      <h2>Congratulations, ${playerName}!</h2>
      <p>Your final score: ${score}</p>
      <p>Total time: ${totalTime} seconds</p>
      <div class="high-scores-section">
      <h3>Top 5 High Scores:</h3>
        <ul class="high-score-list">
          ${highscores}
        </ul>
      </div>
      <button id="restart-button">Play Again ⏎</button>
    </div>
  `

  updateQuizContainer('win-state', winScreenHTML)
  document.getElementById('restart-button').addEventListener('click', () => {
    removeClass('quiz-area', 'win-state')
    onRestartCallback()
  })
}

/**
 * Displays the Choose Name screen where the user can enter their name and access high scores.
 * @param {string} highscores - The formatted high scores to display.
 * @param {Function} onStartCallback - Callback function to start the game.
 */
export function displayChooseNameScreen (highscores, onStartCallback) {
  const chooseNameHTML = `
    <div class="choose-name-message">
      <h2>Welcome to the Quiz!</h2>
      <p>Please enter your name to begin:</p>
      <input type="text" id="player-name-input" placeholder="Your Name" maxlength="20" />
      <div class="button-group">
        <button id="start-game-button">Start Game ⏎</button>
        <button id="show-highscores-button">Show High Scores</button>
      </div>
    </div>
  `
  updateQuizContainer('choose-name-state', chooseNameHTML)

  NameInputHandler(onStartCallback)
  ToggleHighScoresHandler(highscores)
}

/**
 * Handles the user input for the Choose Name screen.
 * Allows the user to submit their name and start the game.
 * @param {Function} onStartCallback - Callback function to start the game with the entered name.
 */
function NameInputHandler (onStartCallback) {
  const nameInput = document.getElementById('player-name-input')
  const startButton = document.getElementById('start-game-button')

  /**
   *
   */
  function getNameInput () {
    const playerName = nameInput.value.trim()
    removeClass('quiz-area', 'choose-name-state')
    onStartCallback(playerName)
  }

  startButton.addEventListener('click', getNameInput)
}

/**
 * Sets up the handler for toggling the high scores section.
 * @param {string} highscores - The formatted high scores to display.
 */
function ToggleHighScoresHandler (highscores) {
  const toggleButton = document.getElementById('show-highscores-button')

  toggleButton.addEventListener('click', () => {
    const existingHighScoreList = document.getElementById('high-scores-section')

    if (existingHighScoreList) {
      existingHighScoreList.remove() // Toggle off
    } else {
      const highScoreSection = document.createElement('div')
      highScoreSection.id = 'high-scores-section'
      highScoreSection.innerHTML = `
        <h3>Top 5 High Scores:</h3>
        <ul class="high-score-list">${highscores}</ul>
      `
      document.querySelector('.choose-name-message').appendChild(highScoreSection)
    }
  })
}

/**
 * Sets up the default game UI with the question and answer sections.
 * Also binds the validation callback to the submit button.
 * @param {Function} validateAnswerCallback - Callback function to validate the user's answer.
 */
export function setupDefaultGameUI (validateAnswerCallback) {
  const mainQuizContainer = document.getElementById('quiz-area')
  mainQuizContainer.innerHTML = ''
  mainQuizContainer.innerHTML = `
    <div id="current-question-number"></div>
    <div id="question-text"></div>
    <div id="answer-options"></div>
    <button id="submit-answer">Submit Answer ⏎</button>
    `
  document.getElementById('submit-answer').addEventListener('click', validateAnswerCallback)
}

/**
 * Updates the timer in the UI to show the remaining time.
 * @param {number} timeRemaining - The remaining time in seconds.
 */
export function updateTimerUI (timeRemaining) {
  const timerElement = document.getElementById('timer')
  timerElement.textContent = `Time Left: ${timeRemaining}s`
}

/**
 * Updates the player's name display in the UI.
 * @param {string} playerName - The name of the player.
 */
export function updatePlayerNameUI (playerName) {
  const playerNameElement = document.getElementById('player-name')
  playerNameElement.textContent = `Player: ${playerName}`
}

/**
 * Updates the score display in the UI.
 * @param {number} score - The current score of the player.
 */
export function updateScoreUI (score) {
  const scoreElement = document.getElementById('current-score')
  scoreElement.textContent = `Score: ${score}`
}

/**
 * Updates the quiz container with a specific class and HTML content.
 * Used to change the state of the UI (e.g., game over, win, etc.).
 * @param {string} stateClass - The class to add to the container.
 * @param {string} contentHTML - The HTML content to insert into the container.
 */
function updateQuizContainer (stateClass, contentHTML) {
  const mainQuizContainer = document.getElementById('quiz-area')

  mainQuizContainer.className = ''
  mainQuizContainer.classList.add(stateClass)
  mainQuizContainer.innerHTML = contentHTML
}

/**
 * Removes a specific class from an element by its ID.
 * @param {string} elementId - The ID of the element.
 * @param {string} className - The class to remove.
 */
function removeClass (elementId, className) {
  const element = document.getElementById(elementId)
  if (element) {
    element.classList.remove(className)
  }
}
