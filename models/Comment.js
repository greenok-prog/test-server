import mongoose from 'mongoose'

const { Schema } = mongoose

const CommentSchema = mongoose.Schema({

    user: { type: Schema.Types.ObjectId, ref: 'User' },

    text: { type: String },

    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },


})
const Comment = mongoose.model('Comment', CommentSchema)
export default Comment