import express from 'express'
import multer from 'multer'
import authMiddleware from '../middleware/auth.middleware.js'
import rolesMiddleware from '../middleware/roles.middleware.js'
import { addCard, addComment, addLesson, addLessonBlock, changeCardInfo, changeLesson, changeLessonBlock, deleteLesson, deleteLessonBlock, getCard, getCardPromo, getCards, getLessons, loadComments, removeCard } from '../controllers/card.controller.js'



const router = express.Router()
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
router.post('/addLesson', rolesMiddleware(['ADMIN', 'TEACHER']), upload.single('video'), addLesson)
router.post('/:id/addLessonBlock', rolesMiddleware(['ADMIN', 'TEACHER']), addLessonBlock)
router.post('/getLessons', authMiddleware, getLessons)
router.get('/loadComments', authMiddleware, loadComments)
router.post('/:id/addComment', authMiddleware, addComment)
router.delete('/:id/deleteLessonBlock', rolesMiddleware(['ADMIN', 'TEACHER']), deleteLessonBlock)
router.put('/changeLessonBlock', rolesMiddleware(['ADMIN', 'TEACHER']), changeLessonBlock)
router.put('/:id/changeLesson', rolesMiddleware(['ADMIN', 'TEACHER']), upload.single('video'), changeLesson)
router.delete('/:id/deleteLesson', rolesMiddleware(['ADMIN', 'TEACHER']), deleteLesson)

router.post('/add', rolesMiddleware(['ADMIN', 'TEACHER']), upload.single('file'), addCard)
router.get('/', getCards)
router.post('/:id', rolesMiddleware(['ADMIN', 'TEACHER']), getCard)
router.put('/:id', rolesMiddleware(['ADMIN', 'TEACHER']), upload.single('image'), changeCardInfo)
router.delete('/:id', rolesMiddleware(['ADMIN', 'TEACHER']), removeCard)
router.post('/:id/promo', getCardPromo)



export default router