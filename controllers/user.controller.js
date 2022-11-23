import User from "../models/User.js";
import bcrypt from "bcrypt"
import fs from 'fs'
import validator from 'express-validator'
import config from 'config'
import Card from "../models/Card.js";
import Lesson from "../models/Lesson.js";
import LessonBlock from "../models/LessonBlock.js";

const { validationResult } = validator

//admin panel
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.json({ users })
    } catch (e) {
        res.json({ message: "Пользователи не найдены" })
    }
}
export const createUser = async (req, res) => {
    try {
        const { email, password, username, firstname, surname, roles } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Неверные данные", errors })
        }

        const candidate = await User.findOne({ email: email })
        if (candidate) {
            return res.status(400).json({ message: 'Пользователь уже существует' })
        }
        const hashPassword = await bcrypt.hash(password, 7)

        const user = await new User({ username, email, password: hashPassword, roles: roles, firstName: firstname, secondName: surname })
        await user.save()
        return res.status(201).json({ user })
    } catch (e) {
        res.json({ message: "Не удалось создать пользователя" })
    }
}
export const changeUserData = async (req, res) => {
    try {
        const { id, email, username, firstName, secondName, roles } = req.body
        console.log(req.body);


        const candidate = await User.find({ email: email })

        if (candidate.length > 1) {
            return res.status(400).json({ message: 'Пользователь уже существует' })
        }


        await User.findOneAndUpdate({ _id: id }, { username: username, email: email, roles: roles, firstName: firstName, secondName: secondName }, { new: true })

        return res.status(201).json({ message: "Данные обновлены" })
    } catch (e) {
        console.log(e);
        res.json({ message: "Не удалось изменить пользователя" })
    }
}
export const deleteUser = async (req, res) => {
    try {

        await User.findByIdAndDelete(req.body.userId)
        res.status(200).json({ message: "Пользователь удален" })
    } catch (e) {
        res.status(401).json({ message: "Произошла ошибка при удалении" })
    }
}
export const getUserData = async (req, res) => {
    try {
        const { _id } = req.body

        const user = await User.findById(_id)
        res.status(200).json({ user: { _id: user._id, email: user.email, username: user.username, firstName: user.firstName, roles: user.roles, secondName: user.secondName } })
    } catch (e) {
        res.status(401).json({ message: "Произошла ошибка при удалении" })
    }
}





// user actions
export const changeEmail = async (req, res) => {
    try {
        const data = req.body
        let currentUser = await User.findOne({ _id: data.userId })
        const candidate = await User.findOne({ email: data.email })

        const isPassValid = bcrypt.compareSync(data.password, currentUser.password)
        if (!isPassValid) {
            return res.status(400).json({ message: 'Неверный пароль' })
        }
        if (candidate) {
            return res.status(400).json({ message: 'Пользователь с данным email уже существует' })
        }
        await User.findByIdAndUpdate(data.userId, { email: data.email })
        currentUser = await User.findOne({ _id: data.userId })
        res.json({ message: "Данные обновлены", email: currentUser.email })
    } catch (e) {
        res.status(400).json({ message: "Произошла ошибка" })
    }
}
export const changeProfileInfo = async (req, res) => {
    try {
        const data = req.body

        await User.findByIdAndUpdate(data.userId, { username: data.username, firstName: data.firstName, secondName: data.secondName, userLink: data.userLink, githubLink: data.githubLink })
        const currentUser = await User.findOne({ _id: data.userId })

        res.status(200).json({ currentUser: currentUser, message: 'Данные успешно изменены' })
    } catch (e) {
        res.status(400).json({ message: "Произошла ошибка" })
    }
}
export const changePassword = async (req, res) => {
    try {
        const data = req.body

        const currentUser = await User.findOne({ _id: data.userId })
        const isPassValid = bcrypt.compareSync(data.oldPas, currentUser.password)
        if (!isPassValid) {
            return res.status(400).json({ message: 'Неверный пароль' })
        }
        const hashPassword = await bcrypt.hash(data.newPas, 7)
        await User.findByIdAndUpdate(data.userId, { password: hashPassword })

        res.status(200).json({ message: 'Пароль успешно изменен' })
    } catch (e) {
        return res.status(400).json({ message: "Произошла ошибка при изменении" })
    }
}
export const changeAvatar = async (req, res) => {
    try {
        const file = req.file
        const data = req.body
        const user = await User.findById(data.userId)
        const path = config.get('staticPath') + '\\'

        if (fs.existsSync(path + user.avatar)) {
            fs.unlinkSync(path + user.avatar)
        }

        await User.findByIdAndUpdate(data.userId, { avatar: file.filename })
        const currentUser = await User.findOne({ _id: data.userId })
        return res.status(200).json({ avatar: currentUser.avatar, message: 'Данные успешно изменены' })


    } catch (e) {
        console.log(e);
        res.status(401).json({ message: 'Не удалось изменить фото' })
    }
}


export const buyCourse = async (req, res) => {
    try {
        const { userId, cardId } = req.body
        const user = await User.findByIdAndUpdate(userId, { "$push": { purchasedCourses: cardId } }, { new: true })
        await Card.findByIdAndUpdate(cardId, { $inc: { popular: 1 } })
        return res.status(200).json({ currentUser: user, message: 'Курс успешно куплен' })
    } catch (error) {
        return res.status(400).json({ message: "Произошла ошибка при покупке" })
    }
}
export const addToFavorite = async (req, res) => {
    try {
        const { userId, cardId } = req.body


        const user = await User.findByIdAndUpdate(userId, { $push: { favoriteCourses: cardId } }, { new: true })
        const card = await Card.findOne({ _id: cardId })
        return res.status(200).json(card)
    } catch (e) {

        return res.status(401).json({ message: "Произошла ошибка при добавлении" })
    }

}
export const setCurrentLesson = async (req, res) => {
    try {
        const { lessonId, userId, lesId } = req.body

        const lesson = await Lesson.findById(lessonId)
        const les = await Card.findById(lesId)




        // console.log(block._id);
        const user = await User.findById(userId)
        const currentLessonBlock = await user.currentLesson.find(el => el.cardId === lesId)


        if (currentLessonBlock) {
            const user = await User.findById(userId)
            user.currentLesson.find(el => el.cardId === lesId).lesson = lessonId
            await user.save()



        } else {
            const user = await User.findByIdAndUpdate(userId, { $push: { currentLesson: { cardId: les._id, lesson: lesson._id } } })
            const use = await User.findById(userId)


        }
        const currentUser = await User.findById(userId)
        return res.status(200).json(currentUser.currentLesson)

    } catch (e) {
        console.log(e);
        return res.status(401).json({ message: "Произошла ошибка при добавлении" })
    }

}
export const getCurrentLesson = async (req, res) => {
    try {
        const { userId } = req.body


        const user = await User.findById(userId)

        return res.status(200).json(user.currentLesson)

    } catch (e) {

        return res.status(401).json({ message: "Произошла ошибка при добавлении" })
    }

}
export const removeFromFavorite = async (req, res) => {
    try {
        const { userId, cardId } = req.body


        const user = await User.findByIdAndUpdate(userId, { $pull: { favoriteCourses: cardId } }, { new: true })
        const card = await Card.findOne({ _id: cardId })
        return res.status(200).json(card)
    } catch (e) {

        return res.status(401).json({ message: "Произошла ошибка при удалении" })
    }

}