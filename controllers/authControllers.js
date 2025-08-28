import { validationResult } from "express-validator"
import passport from "passport"
import bcrypt from "bcryptjs"
import prisma from "../prisma.js"
const loginGet = (req, res) => {
    const error = req.flash('error')
    const success = req.flash('success')
    res.render('auth/login', { error, success, errors: [] })
}

const loginValidate = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        req.flash('error', 'validation error')
        return res.redirect('/auth/login')
    }
    next()
}

const loginPost = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)

        if (!user) {
            return res.render('auth/login', { error: ["invalid credentials", "Invalid username or password"]})
        }

        req.logIn(user, (err) => {
            if (err) return next(err)
            req.session.data = {
                id: user.id,
                username: user.username,
            }
            req.flash('success', `Welcome back ${req.session.data.username}`)
            return res.render('home', {success: ['You logged in successfully' || "Welcome back " + req.session.data.username], sessionData: req.session.data})
        })
    })(req, res, next)
}

const logoutGet = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

const signupGet = (req, res) => {
    const error = req.flash('error')
    const success = req.flash('success')

    res.render('auth/signup', { error, success, errors: [] })
}

const signupvalidate = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg)

    errorMessages.forEach(msg => req.flash('error', msg))

    return res.render('auth/signup', { error: errorMessages })
  }
    next()
}

const signupPost = async (req, res, next) => {
    const { firstname, lastname, username, password, confirm } = req.body;

    try {
        if (password !== confirm) {
            req.flash('error', 'Passwords do not match, please try again')
            return res.render('auth/signup', {error: ['passwords do not match', 'passwords must be the same']})
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
        req.flash('success', 'Your registration was successfull')
        return res.redirect('/auth/login')
    } catch (error) {
        console.error(error)
        req.flash('error', 'something went wrong')
        res.redirect('/auth/signup')
    }
}
export default { loginGet, loginPost, loginValidate, logoutGet, signupGet, signupvalidate, signupPost }