import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'Role' }],
    avatar: { type: String },
    firstName: { type: String },
    secondName: { type: String },
    userLink: { type: String },
    githubLink: { type: String },
    currentLesson: [{
        cardId: { type: String },
        lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' }
    }],


    favoriteCourses: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    purchasedCourses: [{ type: Schema.Types.ObjectId, ref: 'Card' }]
})
const User = mongoose.model('User', userSchema)
export default User