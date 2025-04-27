import { About } from './components/about/About.js'
import { BackgroundChanger } from './components/backgroundChanger/BackgroundChanger.js'
import { Browser } from './components/browser/Browser.js'
import { ChatApp } from './components/chatApp/ChatApp.js'
import { Desktop } from './components/desktop.js'
import { Memory } from './components/memoryGame/Memory.js'
import { AppFactory } from './utils/AppFactory.js'
import { WindowFactory } from './utils/WindowFactory.js'
import { config } from './utils/config.js'

/**
 * Entry point of the Personal Web Desktop application.
 * Initializes and sets up the desktop environment, apps, and their respective windows.
 */

/**
 * Initializes and starts the application.
 */
function start () {
  const { backgrounds, memoryIcons, chatConfig, memorySoundEffects } = config

  // Get the root element
  const root = document.body

  // Clear existing DOM
  root.innerHTML = ''

  // Create and append the Desktop component
  const desktop = new Desktop(backgrounds)
  root.appendChild(desktop)
  desktop.setBackgroundImage()

  // Get references for app initialization
  const iconsDiv = document.querySelector('.icons')
  const desktopUI = document.querySelector('.desktop')

  // Create factories for windows and apps
  const windowFactory = new WindowFactory(desktopUI)
  const appFactory = new AppFactory(iconsDiv, windowFactory)

  // Register apps
  appFactory.createAppIcon('Change Background', BackgroundChanger, backgrounds, desktopUI)
  appFactory.createAppIcon('Memory', Memory, memoryIcons, memorySoundEffects)
  appFactory.createAppIcon('Chat App', ChatApp, chatConfig)
  appFactory.createAppIcon('About', About)
  appFactory.createAppIcon('Browser', Browser)
}

// Start the application
start()
