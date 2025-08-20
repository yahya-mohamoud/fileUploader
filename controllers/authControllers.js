import { validationResult } from "express-validator"
import passport from "passport"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
const loginGet = (req, res) => {
     res.render('auth/login', { errors: [] })
}

const loginValidate =  (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
             return res.status(401).render('auth/login', { errors: errors.array() })
        }
        next()
    }

const loginPost = (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err)

            if (!user) {
                return res.render('auth/login', {
                    errors: [{ msg: "invalid username or password" }]
                })
            }
            req.logIn(user, (err) => {
                if (err) return next(err)
                    console.log('you are in')
                return res.redirect('/')
            })
        })(req, res, next)
    }

const logoutGet = (req, res) => {
    req.session.destroy()
    res.redirect('/auth/login')
}

const signupGet = (req, res) => {
    res.render('auth/signup', { errors: [] })
}

const signupvalidate =  async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(401).render('auth/signup', {
                errors: errors.array(),
            })
        }
        next()
}

const signupPost = async (req, res, next) => {   
 const { firstname, lastname, username, password, confirm } = req.body;

        try {
            if (password !== confirm) {
                return  res.status(400).render('auth/signup', {
        errors: [{ msg: "Passwords do not match" }]
    })
            }
            const hashed = await bcrypt.hash(password, 10)
            const user = await prisma.user.create({
                data: {
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    password: hashed
                }
            })

            res.redirect('/')
        } catch (error) {
            console.error(error)
            next(error)
        }
}
export default {loginGet, loginPost, loginValidate, logoutGet, signupGet, signupvalidate, signupPost}