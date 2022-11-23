import mongoose from "mongoose";

const cardSchema = mongoose.Schema({
    title: { type: String, require: true },
    text: { type: String, require: true },
    image: { type: String, require: true },
    type: { type: String, default: 'design', require: true },
    popular: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lessonBlocks: [{ type: mongoose.Schema.Types.ObjectId, ref: "LessonBlock" }]



})
const Card = mongoose.model("Card", cardSchema)
export default Card