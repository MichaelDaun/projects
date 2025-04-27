import express from 'express'
import { LoginController } from '../controller/LoginController.js'
import { SnippetsController } from '../controller/SnippetsController.js'
import { BrowseController } from '../controller/BrowseController.js'
import { SettingsController } from '../controller/SettingsController.js'

const router = express.Router()
const loginController = new LoginController()
const snippetsController = new SnippetsController()
const browseController = new BrowseController()
const settingsController = new SettingsController()

// LOGIN/AUTHENTICATION RELATED ACTIONS

router.get('/', async (request, response) => { response.redirect('/login') })

router.get('/login', loginController.renderLoginScreen)

router.post('/login', loginController.authenticateUser)

router.get('/logout', loginController.logoutUser)

router.get('/login/register', loginController.renderRegisterScreen)

router.post('/login/register', loginController.registerNewUser)

// CREATE, BROWSE AND USER CONTENT

router.get('/snippets/create', snippetsController.renderWriteScreen)

router.post('/snippets/create', snippetsController.createSnippet)

router.get('/snippets/edit', snippetsController.renderEditScreen)

router.post('/snippets/edit', snippetsController.editSnippet)

router.get('/snippets/browse', browseController.renderBrowseScreen)

router.post('/snippets/delete', snippetsController.deleteSnippet)

router.get('/user/settings', settingsController.renderSettingsScreen)

export default router
