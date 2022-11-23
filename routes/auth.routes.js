import express from 'express'
import bcrypt from 'bcrypt'
import config from 'config'
import validator from 'express-validator'
import jwt from 'jsonwebtoken'

import authMiddleware from '../middleware/auth.middleware.js'
import User from '../models/User.js'
import Role from '../models/Role.js'

const { check, validationResult } = validator
const router = express.Router()
const generateAccessToken = (id, roles) => {
    const payload = {
        id, roles
    }
    return jwt.sign(payload, config.get("secretKey"), { expiresIn: "24h" })
}
router.post('/registration',
    [
        check('email', 'Неверный email').isEmail(),
        check('username', 'Отсутствует username').isLength({ min: 3 }),
        check('password', 'Неверный пароль').isLength({ min: 3, max: 12 })
    ],
    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Неверные данные", errors })
        }
        try {
            const { username, email, password, role } = req.body

            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь уже существует' })
            }
            const hashPassword = await bcrypt.hash(password, 7)


            const userRole = await Role.findOne({ value: role })
            const user = await new User({ username, email, password: hashPassword, roles: [userRole.value] })
            await user.save()
            const token = generateAccessToken(user._id, user.roles)

            return res.json({
                token, user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    secondName: user.secondName,
                    userLink: user.userLink,
                    githubLink: user.githubLink,
                    roles: user.roles,
                    favoriteCourses: user.favoriteCourses,
                    avatar: user.avatar,
                    purchasedCourses: user.purchasedCourses,

                }
            })
        } catch (error) {
            console.log(error);
            res.send({ message: 'Server error' })
        }
    })
router.post('/login',
    async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }
            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({ message: 'Неверный пароль' })
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({
                token, user: {
                    _id: user.id,
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    secondName: user.secondName,
                    userLink: user.userLink,
                    roles: user.roles,
                    githubLink: user.githubLink,
                    favoriteCourses: user.favoriteCourses,
                    avatar: user.avatar,
                    purchasedCourses: user.purchasedCourses,
                    currentLesson: user.currentLesson

                }
            })
        } catch (error) {

            res.send({ message: 'Server error' })
        }
    })
router.get('/auth', authMiddleware,
    async (req, res) => {
        try {

            const user = await User.findOne({ _id: req.user.id })

            const token = generateAccessToken(user._id, user.roles)
            return res.json({
                token, user: {
                    _id: user.id,
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    secondName: user.secondName,
                    userLink: user.userLink,
                    roles: user.roles,
                    githubLink: user.githubLink,
                    favoriteCourses: user.favoriteCourses,
                    avatar: user.avatar,
                    purchasedCourses: user.purchasedCourses,
                    currentLesson: user.currentLesson

                }
            })

        } catch (error) {

            res.send({ message: 'Server error' })
        }
    })
export default router