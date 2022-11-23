import mongoose from 'mongoose'

const { Schema } = mongoose

const LessonBlockSchema = mongoose.Schema({
    title: { type: String },

    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    cardId: { type: Schema.Types.ObjectId, ref: 'Card' }
})
const LessonBlock = mongoose.model('LessonBlock', LessonBlockSchema)
export default LessonBlock