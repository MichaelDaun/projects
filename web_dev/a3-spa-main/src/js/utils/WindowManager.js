/**
 * Manages window positioning, boundaries, and z-index for desktop applications.
 */
export class WindowManager {
  #lastPositionX
  #lastPositionY
  #xBoundary
  #yBoundary
  #zIndexCounter

  /**
   * Creates an instance of WindowManager.
   */
  constructor () {
    this.#lastPositionX = 50 // Default starting X position
    this.#lastPositionY = 50 // Default starting Y position
    this.#xBoundary = window.innerWidth
    this.#yBoundary = window.innerHeight
    this.#zIndexCounter = 100 // Initial z-index

    /**
     * Default fallback positions for windows in case of positioning conflicts.
     * Positions are calculated as percentages of the screen size.
     * @type {Array<{x: number, y: number}>}
     */
    this.defaultWindowPositions = [
      { x: this.#xBoundary * 0.15, y: this.#yBoundary * 0.15 },
      { x: this.#xBoundary * 0.15, y: this.#yBoundary * 0.25 },
      { x: this.#xBoundary * 0.30, y: this.#yBoundary * 0.15 },
      { x: this.#xBoundary * 0.30, y: this.#yBoundary * 0.25 }
    ]
  }

  get zIndexCounter () {
    return ++this.#zIndexCounter
  }

  updateLastWindowPosition (xCoordinates, yCoordinates) {
    this.#lastPositionX = xCoordinates
    this.#lastPositionY = yCoordinates
  }

  isWindowOutOfBounds (xCoordinates, yCoordinates) {
    return xCoordinates >= this.#xBoundary - this.#xBoundary * 0.6 || yCoordinates >= this.#yBoundary - this.#yBoundary * 0.6
  }

  /**
   * Calculates a new position for a window.
   * Ensures the position is within bounds or falls back to a default position if necessary.
   * @returns {{x: number, y: number}} The calculated position for the new window.
   */
  calculateNewWindowPosition () {
    let newWindowPosition = null
    let counter = 0

    while (!newWindowPosition || this.isWindowOutOfBounds(newWindowPosition.x, newWindowPosition.y)) {
      // Break if counter exceeds 10 to avoid infinite loops
      if (counter >= 10) {
        newWindowPosition = this.defaultWindowPositions[Math.floor(Math.random() * this.defaultWindowPositions.length)]
        break
      }

      // Randomly offset the last position
      const newXCoordinate = this.#lastPositionX + 20
      const newYCoordinate = this.#lastPositionY + 20

      // Assign new position
      newWindowPosition = { x: newXCoordinate, y: newYCoordinate }
      counter++
    }

    // Update the last position for the next window
    this.updateLastWindowPosition(newWindowPosition.x, newWindowPosition.y)
    return newWindowPosition
  }
}
