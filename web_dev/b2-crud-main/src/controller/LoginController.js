import userModel from '../model/usermodel.js'

export class LoginController {
  async renderLoginScreen (req, res, next) {
    let flashMsg = null
    try {
      // Check if user ends up in login screen because of logout request
      if (req.query.logout === 'success') {
        flashMsg = { type: 'success', text: 'You have been logged out.' }
      } else {
        flashMsg = req.session.message ?? null
        req.session.message = null
      }
      res.render('login', { backgroundClass: 'login', mainClass: 'login-screen', message: flashMsg })
    } catch (error) {
      next(error)
    }
  }

  async renderRegisterScreen (req, res, next) {
    try {
      if (!req.session.username) {
        const flashMsg = req.session.message ?? null
        res.render('register', {
          backgroundClass: 'register',
          mainClass: 'register-screen',
          message: flashMsg
        })
      } else {
        req.session.message = { type: 'error', text: '403: Please log out before creating a new account' }
        res.redirect('/user/settings')
      }
    } catch (error) {
      next(error)
    }
  }

  async authenticateUser (req, res) {
    const { username, password } = req.body
    const isValidUser = await userModel.comparePassword(username, password)

    if (isValidUser) {
      req.session.username = username
      req.session.message = { type: 'success', text: 'Logged in successfully!' }
      res.redirect('/user/settings')
    } else {
      req.session.message = { type: 'error', text: 'Invalid username or password' }
      res.redirect('/login')
    }
  }

  async logoutUser (req, res) {
    req.session.destroy(error => {
      if (error) {
        console.error('Error destroying session: ', error)
        req.session.message = { type: 'error', text: error }
      }
    })
    res.redirect('/login?logout=success')
  }

  async registerNewUser (req, res, next) {
    try {
      const { username, password } = req.body
      console.log(`username: ${username} password: ${password}`)
      const userNameAvailable = await userModel.userNameAvailable(username)

      if (!userNameAvailable) {
        req.session.message = { type: 'error', text: 'Username is already taken' }
        res.redirect('/login/register')
        return
      }

      const status = userModel.add(username, password)

      if (status) {
        req.session.message = { type: 'success', text: `User: ${username} successfully created!` }
        res.redirect('/login')
      }
    } catch (error) {
      next(error)
    }
  }
}
