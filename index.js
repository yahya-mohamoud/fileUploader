import express from 'express'
import passport from 'passport'
import session from 'express-session'
import dotenv from 'dotenv'
import auth from './routes/auth.js'
import passportConfig from './utils/passportConfig.js'
import { PrismaClient } from '@prisma/client'
import {PrismaSessionStore } from '@quixo3/prisma-session-store'
import fileRoute from './routes/upload.js'
import folderRoute from './routes/folder.js'
import { checkAuth } from './middlewares.js'

dotenv.config()
const app = express()

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(session({
     cookie: {
     maxAge: 2 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 60 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
}))

passportConfig(passport)
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')


app.get('/',(req, res) => {
    res.render('home')
})
app.use('/auth', auth)
app.use('/files', fileRoute)
app.use('/folders', folderRoute)

const PORT = process.env.PORT || 4300
app.listen(PORT, (req, res) => {
    console.log(`Server Started on Port ${PORT}`)
})