/**
 * Manages the timer functionality for the Memory game.
 */
export class MemoryTimer {
  #intervallId
  #timeElapsed

  /**
   * Initializes the MemoryTimer instance.
   */
  constructor () {
    this.#intervallId = null
    this.#timeElapsed = 0
  }

  /**
   * Gets the total time elapsed since the timer started.
   * @returns {number} - The time elapsed in seconds.
   */
  get timeElapsed () {
    return this.#timeElapsed
  }

  /**
   * Starts the timer and invokes the update callback every second.
   * @param {Function} updateCallback - Callback invoked every second with the elapsed time.
   */
  startClock (updateCallback) {
    this.#timeElapsed = 0
    this.#intervallId = setInterval(() => {
      this.#timeElapsed++
      updateCallback(this.#timeElapsed)
    }, 1000)
  }

  /**
   * Stops the timer and clears the interval.
   */
  stopClock () {
    if (this.#intervallId) {
      clearInterval(this.#intervallId)
      this.#intervallId = null
    }
  }

  /**
   * Delays the execution of a specified callback function.
   * @param {number} delayInSeconds - The delay duration in seconds.
   * @param {Function} callback - The callback to execute after the delay.
   */
  delayAction (delayInSeconds, callback) {
    setTimeout(callback, delayInSeconds * 1000)
  }
}
