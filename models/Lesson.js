import mongoose from 'mongoose'

const { Schema } = mongoose

const LessonSchema = mongoose.Schema({
    title: { type: String },
    text: { type: String },
    links: [{ type: String }],
    video: { type: String },
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },

        text: { type: String }
    }],
    lessonBlock: { type: Schema.Types.ObjectId, ref: 'LessonBlock' },


})
const Lesson = mongoose.model('Lesson', LessonSchema)
export default Lesson