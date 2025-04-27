import snippetModel from '../model/snippetmodel.js'

export class SnippetsController {
  async renderWriteScreen (req, res, next) {
    let flashMsg = null
    try {
      if (req.session.username) {
        flashMsg = req.session.message ?? null
        req.session.message = null
        res.render('writeSnippets', {
          backgroundClass: 'write',
          mainClass: 'write-screen',
          username: req.session.username ?? null,
          message: flashMsg
        })
      } else {
        res.status(403)
        req.session.message = { type: 'error', text: '403: Login or create a user account first' }
        res.redirect('/login')
      }
    } catch (error) {
      next(error)
    }
  }

  async renderEditScreen (req, res, next) {
    let flashMsg = null
    try {
      if (req.session.username) {
        const snippetToEdit = await snippetModel.findById(req.query.snippetID)
        console.log(snippetToEdit)
        flashMsg = req.session.message ?? null
        req.session.message = null
        res.render('editSnippet', {
          backgroundClass: 'write',
          mainClass: 'write-screen',
          username: req.session.username,
          message: flashMsg,
          snippetToEdit
        })
      } else {
        res.status(403)
        req.session.message = { type: 'error', text: '403: Login or create a user account first' }
        res.redirect('/login')
      }
    } catch (error) {
      next(error)
    }
  }

  async deleteSnippet (req, res, next) {
    try {
      const deleteStatus = snippetModel.deleteSnippet(req.body.snippetID)
      if (deleteStatus) {
        req.session.message = { type: 'success', text: 'Code snippet deleted successfully' }
        res.redirect('/user/settings')
      } else {
        req.session.message = { type: 'error', text: 'Failed to delete code snippet' }
        res.redirect('/user/settings')
      }
    } catch (error) {
      next(error)
    }
  }

  async createSnippet (req, res) {
    const userAction = req.body.action
    const username = req.session.username

    if (userAction === 'cancel') {
      res.redirect('/user/settings')
      return
    }

    const { title, language, code, tag1, tag2 } = req.body
    const status = await snippetModel.add(code, title, language, username, tag1, tag2)
    if (status) {
      req.session.message = { type: 'success', text: 'Code snippet submitted successfully!' }
      res.redirect('/snippets/create')
    } else {
      req.session.message = { type: 'error', text: 'Failed to submit code snippet' }
      res.redirect('/snippets/create')
    }
  }

  async editSnippet (req, res, next) {
    try {
      const { title, code, language, tag1, tag2, snippetID } = req.body
      const status = await snippetModel.editSnippet(snippetID, { title, code, language, tag1, tag2 })
      if (status) {
        req.session.message = { type: 'success', text: 'Code snippet edited successfully' }
        res.redirect('/user/settings')
      } else {
        req.session.message = { type: 'error', text: 'Failed to edit code snippet' }
        res.redirect('/user/settings')
      }
    } catch (error) {
      next(error)
    }
  }
}
