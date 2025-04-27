/**
 * @file highscores.js
 * @description Manages the storage and display of high scores for the quiz application.
 * Handles the retrieval, sorting, formatting, and persistence of high scores using the
 * browser's local storage.
 */

/**
 * Retrieves the high scores from local storage.
 * If no high scores are found, returns an empty array.
 * @returns {Array<object>} - An array of high score objects with playerName, score, and totalTime.
 */
function getHighScores () {
  const localstorage = window.localStorage
  return JSON.parse(localstorage.getItem('highscores')) || []
}

/**
 * Saves a player's score to the high score list.
 * Adds the player's score to the list, sorts it by highest score,
 * and trims the list to the top 5 scores. The updated list is stored in local storage.
 * @param {string} playerName - The name of the player.
 * @param {number} score - The player's score.
 * @param {number} totalTime - The total time the player took to complete the game.
 */
export function saveToHighscore (playerName, score, totalTime) {
  const localStorage = window.localStorage
  let highscores = getHighScores()
  highscores.push({ playerName, score, totalTime })
  highscores.sort((a, b) => b.score - a.score)
  highscores = highscores.slice(0, 5)

  localStorage.setItem('highscores', JSON.stringify(highscores))
}

/**
 * Formats the high scores for display in the UI.
 * Maps the high scores to an ordered HTML list showing player names, scores, and times.
 * @returns {string} - A string of formatted high scores as an HTML list.
 */
export function getHighScoresFormatted () {
  const highscores = getHighScores()

  const formattedHighScoreArray = highscores.map((entry, index) => `<li>${index + 1}. ${entry.playerName} - 
                      Score: ${entry.score}, Time: ${entry.totalTime}s</li>`).join('')
  return formattedHighScoreArray
}
