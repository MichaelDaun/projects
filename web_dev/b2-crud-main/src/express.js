import express from 'express'
import logger from 'morgan'
import router from './route/routes.js'
import session from 'express-session'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(logger('dev'))
app.use(express.static('public'))

app.use('/', router)

// 404 status
app.use((req, res, next) => {
  const username = req.session.username ?? null
  res.status(404).render('errorStatus', {
    statusCode: 404,
    message: 'Page Not Found',
    username
  })
})

// 500 status
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err)
  res.status(500).render('errorStatus', {
    statusCode: 500,
    message: 'Something went wrong!',
    username: req.session.username ?? null
  })
})

export default (port = 3000) => {
  app.listen(port, () => { console.log(`Listening at port ${port}`) })
}
