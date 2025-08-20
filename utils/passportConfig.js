import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export default function passportConfig(passport) {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await prisma.user.findFirst({
                    where: { username },
                })
                if (!user) {
                    return done(null, false, { message: 'incorrect username or password' })
                }
                const match = await bcrypt.compare(password, user.password)
                if (!match) {
                    return done(null, false, { message: "incorrect username or password" })
                }

                return done(null, user)
            } catch (err) {
                return done(err)
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            })
            done(null, user)
        } catch (err) {
            done(err)
        }
    })
} 