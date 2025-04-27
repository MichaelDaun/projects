/**
 * @file api.js
 * @description Handles server communication for the quiz application. Includes functions
 * to fetch quiz questions and submit user answers to the server.
 *
 * Ensures proper handling of asynchronous operations, parsing responses, and error
 * management.
 */

/**
 * Fetches a quiz question from the server.
 * @param {string} url - The URL to fetch the question from.
 * @returns {Promise<string>} - A promise that resolves to the question string.
 * @throws {Error} - If the fetch operation fails or the server returns an error status.
 */
export async function fetchQuestion (url) {
  const response = await fetch(url)
  const question = await response.json()
  return question
}

/**
 * Posts the user's answer to the server.
 * @param {string} url - The URL to post the answer to.
 * @param {string} answer - The user's answer.
 * @returns {Promise<object>} - A promise that resolves to the server's response.
 * @throws {Error} - If the post operation fails or the server returns an error status.
 */
export async function postAnswer (url, answer) {
  const jsonAnswer = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answer })
  }

  const response = await fetch(url, jsonAnswer)
  const dataJSON = await response.json()

  if (response.ok) {
    // Correct Answer, append a key value pair with the weird ... "spread operator"
    return { correct: true, ...dataJSON }
  } else if (response.status === 400) {
    return { correct: false, ...dataJSON }
  } else {
    throw new Error(`Unexpected HTTP status: ${response.status}`)
  }
}
