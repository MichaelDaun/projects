import { SystemWindow } from '../SystemWindow'
import { ChatUI } from './ChatUI'
import { ChatService } from './ChatService'

/**
 * A chat application that allows users to connect to a server, send/receive messages,
 * and save message history. The app includes a user interface for chatting,
 * adjustable window sizing, and basic settings configuration.
 */
export class ChatApp extends SystemWindow {
  #systemWindowContent
  #chatUI
  #chatService
  #serverAddress
  #apiKey
  #chatHistory
  #clientId
  #soundStatus

  constructor (chatConfig) {
    super('Chat App')
    this.attachMaximizeButtonListener()
    this.#serverAddress = chatConfig.serverAddress
    this.#apiKey = chatConfig.apiKey
    this.#chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || []
    this.#clientId = this.getClientId()
    this.#soundStatus = 'ON'
    this.#systemWindowContent = this.shadowRoot.querySelector('.system-window-content')

    this.#chatService = new ChatService(this.#apiKey, this.#serverAddress, this.receiveMessage)
    this.#chatUI = new ChatUI(this.#systemWindowContent, this.enterChat, this.sendMessage, this.enterSettings, this.saveSettings, chatConfig.messageSentSoundEffect, chatConfig.messageReceivedSoundEffect)
    this.#chatUI.launchScreen(this.loadLastUserName())
  }

  /**
   * Handles entering the chat by validating the username input.
   * If valid, it saves the username and starts the chat.
   * @param {string} name - The username entered by the user.
   */
  enterChat = (name) => {
    if (name && name.trim() !== '') {
      this.saveUserName(name)
      this.startChat()
      console.log('Entering Chat!')
    } else {
      console.log('Name cannot be empty!')
    }
  }

  enterSettings = () => {
    this.disconnectedCallback()
    this.#chatUI.settingScreen(this.#clientId, this.loadLastUserName(), this.#chatService.channel, this.#soundStatus)
    this.#chatUI.setupSettingsListeners()

    // Set up new limits for screen
    this.setMinimumWidthAndHeight(485, 455)
  }

  /**
   * Saves updated user settings such as username, channel, and sound status.
   * Also restarts the chat if settings have changed.
   * @param {string} updatedUserName - The updated username.
   * @param {string} updatedChannel - The updated channel.
   * @param {string} updatedSoundStatus - The updated sound preference.
   */
  saveSettings = (updatedUserName, updatedChannel, updatedSoundStatus) => {
    if (updatedUserName !== this.loadLastUserName()) {
      this.saveUserName(updatedUserName)
    }

    if (updatedChannel !== this.#chatService.channel) {
      this.#chatService.channel = updatedChannel
      console.log(`Now listening to channel: #${updatedChannel}`)
    }

    if (updatedSoundStatus !== this.#soundStatus) {
      this.#soundStatus = updatedSoundStatus
      console.log(`Sound status changed to: ${updatedSoundStatus}`)
    }

    this.startChat()
  }

  saveUserName (name) {
    localStorage.setItem('chatUserName', name.trim())
    console.log(`Nickname saved as: ${name.trim()}`)
  }

  loadLastUserName () {
    const userName = localStorage.getItem('chatUserName')
    if (userName) {
      return userName
    }
  }

  /**
   * Initializes the chat interface and connects to the WebSocket server.
   * Sets up the message input field and reloads message history.
   */
  startChat () {
    // Render chat UI and connect with server
    this.#chatUI.chatScreen(this.#chatService.channel)
    this.#chatUI.setupSendListener()
    this.loadChatHistory()
    this.#chatService.connectToServer()

    // Set up new limits for screen
    this.setMinimumWidthAndHeight(550, 500)
    // Set up the resize handler
    this.setupResizeHandler()
  }

  /**
   * Retrieves the unique client ID from local storage or generates a new one if not found.
   * The client ID is used to identify messages sent by the user.
   * @returns {string} The unique client ID.
   */
  getClientId () {
    let clientId = localStorage.getItem('chatClientId')
    if (!clientId) {
      clientId = crypto.randomUUID()
      localStorage.setItem('chatClientId', clientId)
    }
    return clientId
  }

  /**
   * Loads the chat history from local storage and displays it in the chat UI.
   */
  loadChatHistory () {
    // Display existing messages
    for (const message of this.#chatHistory) {
      this.#chatUI.displayMessage(message.username, message.data, message.date, message.isUser)
    }

    // If history is below 7 messages, force the container to 400px
    if (this.#chatHistory.length < 7) {
      const chatArea = this.#systemWindowContent.querySelector('.chat-message-area')
      const availableHeight = this.calculateAvailableHeight()
      chatArea.style.minHeight = `${Math.min(400, availableHeight)}px`
    }

    console.log('Chat history loaded.')
  }

  /**
   * Adds a new message to the message history.
   * Ensures the history does not exceed 20 messages by removing the oldest one if necessary.
   * @param {object} messageObj - The message object containing message details.
   * @param {string} date - The timestamp of the message.
   * @param {boolean} isUser - Whether the message was sent by the user.
   */
  addToMessageHistory (messageObj, date, isUser) {
    const messageWithDateAndUserState = { ...messageObj, date, isUser }
    this.#chatHistory.push(messageWithDateAndUserState)

    // If array exceeds 20 elements shift to remove oldest entry
    if (this.#chatHistory.length > 20) {
      this.#chatHistory.shift()
    }
  }

  /**
   * Handles cleanup when the app is disconnected.
   * Saves chat history to local storage and closes the WebSocket connection.
   */
  disconnectedCallback () {
    const chatMessageArea = this.#systemWindowContent.querySelector('.chat-message-area')
    // Check if the user has entered the chat already
    if (chatMessageArea) {
      console.log('Saving history and closing WebSocket...')
      localStorage.setItem('chatHistory', JSON.stringify(this.#chatHistory))
      this.#chatService.closeConnection()
    }
  }

  receiveMessage = (message) => {
    const timeStamp = this.getCurrentTimestamp()
    const isUser = (message.clientId === this.#clientId)
    this.addToMessageHistory(message, timeStamp, isUser)
    this.#chatUI.displayMessage(message.username, message.data, timeStamp, isUser, this.#soundStatus)
  }

  sendMessage = (message) => {
    const userName = this.loadLastUserName()
    this.#chatService.formatAndSend(message, userName, this.#clientId)
  }

  // This is now considerably less chatGPT
  getCurrentTimestamp () {
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const date = now.toLocaleDateString([], { month: 'short', day: 'numeric' })
    return `${date} ${time}`
  }

  /**
   * Sets up the resize handler for dynamically resizing the chat message area.
   * The user can adjust the chat area height by dragging a handle.
   */
  setupResizeHandler () {
    const chatResizeHandle = this.#systemWindowContent.querySelector('.chat-resize-handle')
    const chatArea = this.#systemWindowContent.querySelector('.chat-message-area')

    chatResizeHandle.addEventListener('mousedown', (event) => {
      event.preventDefault()

      // Save current height values for area and system container
      const startHeight = chatArea.offsetHeight
      const startY = event.clientY

      const onMouseMove = (event) => {
        const deltaY = event.clientY - startY
        const newHeight = Math.max(startHeight + deltaY, 375)
        if (newHeight < this.calculateAvailableHeight()) {
          chatArea.style.maxHeight = `${newHeight}px`
        }
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })
  }

  /**
   * Calculates the maximum available height for the chat message area.
   * Ensures that the chat area does not overlap with the header or input field.
   * @returns {number} The maximum available height in pixels.
   */
  calculateAvailableHeight () {
    const chatHeader = this.#systemWindowContent.querySelector('.chat-header')
    const chatInputArea = this.#systemWindowContent.querySelector('.chat-input')
    // Calculate spaces for every div
    const totalHeightSystemWindow = this.#systemWindowContent.offsetHeight
    const chatHeaderHeight = chatHeader.offsetHeight
    const chatInputHeight = chatInputArea.offsetHeight
    const maxAvailableHeight = totalHeightSystemWindow - chatHeaderHeight - chatInputHeight - 10

    return Math.max(maxAvailableHeight, 375)
  }
}
customElements.define('chat-app', ChatApp)
