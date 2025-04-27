import snippetModel from '../model/snippetmodel.js'

export class BrowseController {
  async renderBrowseScreen (req, res, next) {
    try {
      let searchResults = ''
      let currentChosenCodeSnippet = null
      if (Object.keys(req.query).length > 0 && !req.query.selectedId) {
        const { title, language, tag1, tag2 } = req.query
        searchResults = await snippetModel.search(title, language, tag1, tag2)
        // Set last search parameters so we can keep the state of the page when the user reloads
        req.session.lastSearchParameters = { title, language, tag1, tag2 }
      }

      if (req.query.selectedId) {
        currentChosenCodeSnippet = await snippetModel.findById(req.query.selectedId)
        const { title, language, tag1, tag2 } = req.session.lastSearchParameters || {}
        searchResults = await snippetModel.search(title, language, tag1, tag2)
      }

      res.render('browseCode', {
        backgroundClass: 'browse',
        mainClass: 'browse-container',
        searchResults,
        currentChosenCodeSnippet,
        username: req.session.username ?? null
      })
    } catch (error) {
      next(error)
    }
  }
}
