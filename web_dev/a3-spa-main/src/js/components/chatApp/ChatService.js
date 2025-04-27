/**
 * Handles WebSocket communication for a chat application.
 * Manages connecting to a server, sending messages, receiving messages,
 * and handling channels.
 */
export class ChatService {
  #apiKey
  #serverUrl
  #webSocket
  #messageCallback
  #channel

  /**
   * Initializes a new instance of ChatService.
   * @param {string} apiKey - The API key for authenticating WebSocket messages.
   * @param {string} serverUrl - The WebSocket server URL.
   * @param {Function} messageCallback - Callback function to handle incoming messages.
   */
  constructor (apiKey, serverUrl, messageCallback) {
    this.#apiKey = apiKey
    this.#serverUrl = serverUrl
    this.#messageCallback = messageCallback
    this.#channel = 'general'
  }

  connectToServer () {
    try {
      this.#webSocket = new WebSocket(this.#serverUrl)
      this.setUpServerListeners()
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
    }
  }

  set channel (channel) {
    this.#channel = channel
  }

  get channel () {
    return this.#channel
  }

  /**
   * Formats and sends a message over the WebSocket connection.
   * @param {string} message - The message to send.
   * @param {string} username - The username of the sender.
   * @param {string} clientId - The unique client ID of the sender.
   * @returns {boolean} True if the message was sent successfully, otherwise false.
   */
  formatAndSend (message, username, clientId) {
    const formattedMessage = {
      type: 'message',
      data: `${message}`,
      username: `${username}`,
      channel: `${this.#channel}`,
      key: `${this.#apiKey}`,
      clientId: `${clientId}`
    }

    const jsonFormattedMessage = JSON.stringify(formattedMessage)

    try {
      this.#webSocket.send(jsonFormattedMessage)
      console.log('Message sent successfully')
      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      return false
    }
  }

  /**
   * Sets up event listeners for the WebSocket server connection.
   * Handles events such as open, close, error, and incoming messages.
   */
  setUpServerListeners () {
    // When connection open
    this.#webSocket.onopen = () => {
      console.log('Websocket is now open.')
    }

    // General error handling
    this.#webSocket.onerror = (error) => {
      console.log(`WebSocket error: ${error}`)
    }

    // When connection is closed.
    this.#webSocket.onclose = () => {
      console.log('WebSocket connection closed.')
    }

    // When the message is received
    this.#webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      // Filter out heartbeat messages
      if (message.type === 'heartbeat') {
        return
      }
      // Filter messages by channel
      if (this.#channel === 'general' || message.channel === this.#channel) {
        this.#messageCallback(message)
        console.log('Message Received')
        console.log(message)
      }
    }
  }

  closeConnection () {
    if (this.#webSocket && this.#webSocket.readyState === WebSocket.OPEN) {
      this.#webSocket.close()
    }
  }
}
