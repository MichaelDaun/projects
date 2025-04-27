/**
 * Configuration for the desktop environment, including available backgrounds,
 * memory game icons, and apps.
 */
export const config = {
  /**
   * Array of available desktop backgrounds.
   * Each background contains a name and a URL to the image.
   * @type {Array<{name: string, url: string}>}
   */
  backgrounds: [
    { name: 'Blade Runner', url: '/img/blade_wallpaper.jpg' },
    { name: 'Cyberpunk Moria', url: '/img/mine_wallpaper.jpg' },
    { name: 'Spaceship', url: '/img/spaceship_wallpaper.jpg' },
    { name: 'Future Colony', url: '/img/spacemining_wallpaper.jpg' }
  ],

  /**
   * Array of memory game icons.
   * Each icon contains a unique ID and a URL to the image.
   * @type {Array<{id: string, url: string}>}
   */
  memoryIcons: [
    { id: '0', url: '/icons/questionmark_icon.png' },
    { id: '1', url: '/icons/Civ_icon.png' },
    { id: '2', url: '/icons/Spaceship_icon.png' },
    { id: '3', url: '/icons/car_icon.png' },
    { id: '4', url: '/icons/cat_icon.png' },
    { id: '5', url: '/icons/catan_icon.png' },
    { id: '6', url: '/icons/change_background_icon.png' },
    { id: '7', url: '/icons/earth_icon.png' },
    { id: '8', url: '/icons/gun_icon.png' },
    { id: '9', url: '/icons/headphones_icon.png' },
    { id: '10', url: '/icons/memory.png' },
    { id: '11', url: '/icons/mininglogo_icon.png' },
    { id: '12', url: '/icons/whale_icon.png' },
    { id: '13', url: '/icons/witcher_icon.png' }
  ],

  /**
   * Object mapping app names to their corresponding icon URLs.
   * @type {{[key: string]: string}}
   */
  appIcons: {
    'Change Background': '/icons/change_background_icon.png',
    Memory: '/icons/memory.png',
    'Chat App': '/icons/chat_icon.png',
    About: '/icons/about_icon.png',
    Browser: '/icons/browser.png'
  },

  /**
   * Object mapping memory game actions to their corresponding sound effect URLs.
   * @type {{[key: string]: string}}
   */
  memorySoundEffects: {
    flipCard1: '/sounds/656393__nikos34__select.wav',
    flipCard2NoMatch: '/sounds/656394__nikos34__select-2.wav',
    flipCard2Match: '/sounds/274203__littlerobotsoundfactory__ui_synth_02.wav',
    focusCard: '/sounds/729216__techspiredminds__upgradeselect-ui.wav',
    gameOverVictory: '/sounds/274177__littlerobotsoundfactory__jingle_win_synth_03.wav'
  },

  /**
   * Array of available apps for the desktop environment.
   * Each app contains a name.
   * @type {Array<{name: string}>}
   */
  apps: ['background-changer', 'memory-game', 'chat-app', 'about-window', 'browser-window'],

  /**
   * Configuration for the chat app, including server address, API key,
   * and sound effect URLs for sent and received messages.
   * @type {{serverAddress: string, apiKey: string, messageSentSoundEffect: string, messageReceivedSoundEffect: string}}
   */
  chatConfig: {
    serverAddress: 'wss://courselab.lnu.se/message-app/socket',
    apiKey: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd',
    messageSentSoundEffect: '/sounds/750435__rescopicsound__ui-click-menu-modern-interface-select-small-01.mp3',
    messageReceivedSoundEffect: '/sounds/703380__sonically_sound__short-notification.wav'
  }
}
