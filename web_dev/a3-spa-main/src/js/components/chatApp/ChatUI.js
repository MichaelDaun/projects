/**
 * Manages the user interface for the chat application.
 * Handles rendering screens, managing settings, and displaying messages.
 */
export class ChatUI {
  #systemWindowContent
  #enterChatCallback
  #sendMessageCallback
  #enterSettingsCallback
  #saveSettingsCallback
  #messageSentSound
  #messageReceivedSound

  /**
   * Initializes a new instance of the ChatUI class.
   * @param {HTMLElement} systemWindowContent - The DOM element for the chat application's content area.
   * @param {Function} enterChatCallback - Callback invoked when the user enters the chat.
   * @param {Function} sendMessageCallback - Callback invoked when the user sends a message.
   * @param {Function} enterSettingsCallback - Callback invoked to open the settings screen.
   * @param {Function} saveSettingsCallback - Callback invoked to save settings changes.
   * @param {string} messageSentSound - URL of the sound effect for sent messages.
   * @param {string} messageReceivedSound - URL of the sound effect for received messages.
   */
  constructor (systemWindowContent, enterChatCallback, sendMessageCallback, enterSettingsCallback, saveSettingsCallback, messageSentSound, messageReceivedSound) {
    this.#systemWindowContent = systemWindowContent
    this.#enterChatCallback = enterChatCallback
    this.#sendMessageCallback = sendMessageCallback
    this.#enterSettingsCallback = enterSettingsCallback
    this.#saveSettingsCallback = saveSettingsCallback
    this.#messageSentSound = messageSentSound
    this.#messageReceivedSound = messageReceivedSound
  }

  /**
   * Renders the initial screen for entering the chat.
   * @param {string} [lastSavedName] - The last saved username to prefill the input field.
   */
  launchScreen (lastSavedName = '') {
    this.#systemWindowContent.innerHTML = `
      <h2 class="chat-title">Welcome to the Chat</h2>
      <label for="chat-username" class="chat-label">Enter your name:</label>
      <input type="text" id="chat-username" class="system-input" value="${lastSavedName}" placeholder="Your Name">
      <button class="system-button enter-chat-button">Enter Chat</button>
    `

    const handleSubmitName = () => {
      this.#enterChatCallback(userInput.value)
    }

    const enterChatButton = this.#systemWindowContent.querySelector('.enter-chat-button')
    const userInput = this.#systemWindowContent.querySelector('#chat-username')
    enterChatButton.addEventListener('click', handleSubmitName)

    userInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        handleSubmitName()
      }
    })
  }

  /**
   * Renders the settings screen for the chat application.
   * Allows the user to configure username, channel, and sound effects.
   * @param {string} clientId - The unique client identifier.
   * @param {string} userName - The current username.
   * @param {string} channel - The current chat channel.
   * @param {string} soundStatus - The current sound status ('ON' or 'OFF').
   */
  settingScreen (clientId, userName, channel, soundStatus) {
    this.#systemWindowContent.innerHTML = `
    <div class="chat-settings-container">
      <!-- Header Section -->
      <div class="settings-header">
        <h2>Settings</h2>
      </div>

      <!-- Settings Items -->
      <div class="settings-item">
        <label for="client-id" class="settings-label">Client ID:</label>
        <span id="client-id" class="settings-value">${clientId}</span>
      </div>

      <div class="settings-item">
        <label for="username" class="settings-label">Username:</label>
        <input
          type="text"
          id="username"
          class="system-input settings-input"
          value="${userName}"
        />
      </div>

      <div class="settings-item">
        <label for="channel" class="settings-label">Channel:</label>
        <input
          type="text"
          id="channel"
          class="system-input settings-input"
          value="${channel}"
        />
      </div>

      <div class="settings-item">
        <label for="sound-effects" class="settings-label">Sound Effects:</label>
        <button id="toggle-sound" class="system-button settings-button">
          ${soundStatus}
        </button>
      </div>

      <!-- Save and Cancel Buttons -->
      <div class="settings-footer">
        <button class="system-button save-settings-button">Save</button>
        <button class="system-button cancel-settings-button">Cancel</button>
      </div>
    </div>`
  }

  /**
   * Renders the main chat interface with a header, message area, and input field.
   * @param {string} channel - The name of the chat channel.
   */
  chatScreen (channel) {
    this.#systemWindowContent.innerHTML = `
    <style>
      .system-window {
      display: grid !important;
      grid-template-rows: auto 1fr auto !important;
    }

    .system-window-content {
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
    }
  }
</style>
    <div class="chat-container">
      <!-- Header Section -->
      <div class="chat-header">
        <span class="placeholder-icon">💬</span>
        <span class="chat-channel">#${channel}</span>
        <button class="chat-settings-button">⚙️</button>
      </div>

      <!-- Messages Section -->
      <div class="chat-message-area">
      <!-- User Messages -->
      </div>
      <div class="chat-resize-handle"></div>
      <!-- Message Input Section -->
      <div class="chat-input">
        <input
          type="text"
          id="chat-message-input"
          class="system-input"
          placeholder="Type your message..."
        />
        <button class="system-button chat-send-button">Send</button>
      </div>
    </div>`

    // Small style change needed, parent class was changed which made design slightly offset
    this.#systemWindowContent.style.padding = '0'
  }

  setupSettingsListeners () {
    const saveButton = this.#systemWindowContent.querySelector('.save-settings-button')
    const cancelButton = this.#systemWindowContent.querySelector('.cancel-settings-button')
    const toggleSoundButton = this.#systemWindowContent.querySelector('#toggle-sound')
    const usernameInput = this.#systemWindowContent.querySelector('#username')
    const channelInput = this.#systemWindowContent.querySelector('#channel')
    const lastUserName = usernameInput.value

    cancelButton.addEventListener('click', () => {
      this.#enterChatCallback(lastUserName)
    })

    saveButton.addEventListener('click', () => {
      const updatedSoundStatus = toggleSoundButton.textContent.trim()
      const updatedUserName = usernameInput.value.trim()
      const updatedChannel = channelInput.value.trim()
      this.#saveSettingsCallback(updatedUserName, updatedChannel, updatedSoundStatus)
    })

    toggleSoundButton.addEventListener('click', () => {
      const currentStatus = toggleSoundButton.textContent
      if (currentStatus === 'ON') {
        toggleSoundButton.textContent = 'OFF'
      } else {
        toggleSoundButton.textContent = 'ON'
      }
    })
  }

  /**
   * Displays a message in the chat area.
   * @param {string} username - The username of the message sender.
   * @param {string} message - The message content.
   * @param {string} timestamp - The timestamp of the message.
   * @param {boolean} [isUser] - Whether the message was sent by the current user.
   * @param {string} [soundEffect] - Whether to play a sound effect ('ON' or 'OFF').
   */
  displayMessage (username, message, timestamp, isUser = false, soundEffect = 'OFF') {
    const chatContainer = this.#systemWindowContent.querySelector('.chat-message-area')
    const chatMessageDiv = document.createElement('div')
    chatMessageDiv.classList.add('chat-message')

    if (isUser) {
      chatMessageDiv.classList.add('user-message')
    }

    chatMessageDiv.innerHTML = `
      <span class="chat-username">${username}: </span>
      <span class="chat-text">${message}</span>
      <span class="chat-timestamp">${timestamp}</span>`

    chatContainer.appendChild(chatMessageDiv)

    if (soundEffect === 'ON') {
      this.#playSoundNotification(isUser)
    }

    // scroll container to bottom when a new message is displayed
    chatContainer.scrollTop = chatContainer.scrollHeight
  }

  /**
   * Plays a sound notification for sent or received messages.
   * @private
   * @param {boolean} isUser - Whether the sound is for a message sent by the user.
   */
  #playSoundNotification (isUser) {
    let messageSound

    if (isUser) {
      messageSound = new Audio(this.#messageSentSound)
    } else {
      messageSound = new Audio(this.#messageReceivedSound)
    }
    messageSound.volume = 0.5
    messageSound.play().catch(error => {
      console.error('Failed to play sound:', error)
    })
  }

  /**
   * Sets up event listeners for sending messages.
   * Handles message sending via button click or Enter key.
   */
  setupSendListener () {
    const enterChatButton = this.#systemWindowContent.querySelector('.chat-send-button')
    const userInput = this.#systemWindowContent.querySelector('#chat-message-input')
    enterChatButton.addEventListener('click', () => {
      this.#sendMessageCallback(userInput.value.trim())
      userInput.value = ''
    })

    userInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.#sendMessageCallback(userInput.value.trim())
        userInput.value = ''
      }
    })

    // Set up settings button
    const settingsButton = this.#systemWindowContent.querySelector('.chat-settings-button')
    settingsButton.addEventListener('click', this.#enterSettingsCallback)
  }
}
