import { config } from './config.js'

/**
 * Returns {count} unique random integers between 0 and max (exclusive).
 * @param {number} count - The number of random integers to generate.
 * @param {number} max - The upper limit of the random integers.
 * @returns {Array} - An array of random integers.
 */
export function getRandomNumbers (count, max) {
  const numbers = []
  while (numbers.length < count) {
    const randomNumber = Math.floor(Math.random() * max)
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber)
    }
  }
  return numbers
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
export function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [array[i], array[j]] = [array[j], array[i]] // Swap
  }
  return array
}

/**
 * Retrieves the icon URL for a given app title.
 * @param {string} appTitle - The title of the app whose icon URL is being fetched.
 * @returns {string} The URL of the app's icon.
 */
export function getAppIcon (appTitle) {
  const { appIcons } = config
  return appIcons[appTitle]
}
