/**
 * @file timer.js
 * @description Implements a countdown timer for the quiz application. Tracks the
 * remaining time for each question, updates the UI, and triggers callbacks when the timer
 * reaches zero.
 *
 * Provides methods to start, stop, and reset the timer to ensure synchronization with the
 * game logic.
 */

export class Timer {
  constructor (durationInSeconds, onUpdate, onReachingZero) {
    this.duration = durationInSeconds
    this.timeRemaining = durationInSeconds
    this.onUpdate = onUpdate
    this.onReachingZero = onReachingZero
    this.intervalId = null
  }

  start () {
    this.onUpdate(this.timeRemaining)
    this.intervalId = setInterval(() => {
      this.timeRemaining--
      // Call callback every second to update UI
      this.onUpdate(this.timeRemaining)

      // If timer runs out
      if (this.timeRemaining <= 0) {
        this.stop()
        this.onReachingZero()
      }
    }, 1000) // Code runs every 1000 ms
  }

  stop () {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  reset () {
    this.stop()
    this.timeRemaining = this.duration
    this.onUpdate(this.timeRemaining)
  }
}
