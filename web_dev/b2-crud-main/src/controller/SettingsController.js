import snippetModel from '../model/snippetmodel.js'

export class SettingsController {
  async renderSettingsScreen (req, res, next) {
    try {
      const flashMsg = req.session.message ?? null
      const username = req.session.username ?? null

      if (!username) {
        req.session.message = { type: 'error', text: '403: Login or create a user account first' }
        res.redirect('/login')
      }

      req.session.message = null
      // Get user contributions
      const userSnippets = await snippetModel.getAllSnippetsByAuthor(username)
      res.render('userSettings', {
        backgroundClass: 'settings',
        mainClass: 'settings-screen',
        message: flashMsg,
        username,
        snippets: userSnippets
      })
    } catch (error) {
      next(error)
    }
  }
}
