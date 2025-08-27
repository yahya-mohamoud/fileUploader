import express from 'express'
import passport from 'passport'
import session from 'express-session'
import dotenv from 'dotenv'
import auth from './routes/auth.js'
import passportConfig from './utils/passportConfig.js'
import { PrismaClient } from '@prisma/client'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import fileRoute from './routes/upload.js'
import folderRoute from './routes/folder.js'
import { checkAuth } from './middlewares.js'
import flash from 'connect-flash'

dotenv.config()
const app = express()
const prisma = new PrismaClient()


app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
  cookie: {
    maxAge: 60 * 60 * 1000 // ms
  },
  secret: 'mesa verde',
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 60 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}))
app.use(flash())

passportConfig(passport)
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next();
})
app.use((req, res, next) => {
  res.locals.sessionData = req.session.data || null
  next()
})

app.get('/', (req, res) => {
  res.render('home')
})
app.use('/auth', auth)
app.use('/files', fileRoute)
app.use('/folders', folderRoute)

const PORT = process.env.PORT || 4300
app.listen(PORT, (req, res) => {
  console.log(`Server Started on Port ${PORT}`)
})