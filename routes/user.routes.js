import express from 'express'
import { addToFavorite, buyCourse, changeAvatar, changeEmail, changePassword, changeProfileInfo, changeUserData, createUser, deleteUser, getAllUsers, getCurrentLesson, getUserData, removeFromFavorite, setCurrentLesson } from '../controllers/user.controller.js'
import multer from 'multer'
import authMiddleware from '../middleware/auth.middleware.js'

import rolesMiddleware from '../middleware/roles.middleware.js'
import authvalidator from '../controllers/validators/auth.valudator.js'

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'static/')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '.' + file.originalname.split('.')[1])
        }
    })
})


const router = express.Router()
// router.post('/role', async (req, res) => {
//     const adminRole = await new Role({ value: 'ADMIN' })
//     const userRole = await new Role({ value: 'USER' })
//     await userRole.save()
//     res.json({ message: 'Дада' })
// })
// rolesMiddleware(['ADMIN'])
router.get('/', rolesMiddleware(['ADMIN']), getAllUsers)
router.post('/', rolesMiddleware(['ADMIN']), authvalidator.createUserValidator, createUser)
router.post('/:id/getCurrentLesson', authMiddleware, getCurrentLesson)
router.put('/:id/setCurrentLesson', authMiddleware, setCurrentLesson)
router.post('/:id', rolesMiddleware(['ADMIN']), getUserData)
router.put('/:id/addToFav', authMiddleware, addToFavorite)
router.put('/:id/removeFromFav', authMiddleware, removeFromFavorite)
router.put('/:id/changeData', rolesMiddleware(['ADMIN']), changeUserData)
router.delete('/:id', rolesMiddleware(['ADMIN']), deleteUser)
router.put('/profileInfo', rolesMiddleware(['USER', 'ADMIN']), changeProfileInfo)
router.put('/email', authMiddleware, changeEmail)
router.put('/password', authMiddleware, changePassword)
router.put('/buyCourse', rolesMiddleware(['USER', 'ADMIN']), buyCourse)
router.put('/avatar', upload.single('avatar'), authMiddleware, changeAvatar)

export default router