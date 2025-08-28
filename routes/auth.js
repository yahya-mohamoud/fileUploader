import { Router } from "express";
import { loginValidator, sigupValidator } from "../utils/validator.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import authControllers from "../controllers/authControllers.js";
const auth = Router()

auth.get('/login', authControllers.loginGet)

auth.post('/login', loginValidator, authControllers.loginValidate, authControllers.loginPost)


auth.get('/signup', authControllers.signupGet)


auth.post('/signup', sigupValidator, authControllers.signupvalidate, authControllers.signupPost)

auth.get('/logout', authControllers.logoutGet)

export default auth