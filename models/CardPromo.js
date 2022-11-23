import mongoose from "mongoose";
const { Schema } = mongoose

const cardPromoSchema = mongoose.Schema({
    price: { type: String, require: true },
    image: { type: String, require: true },
    title: { type: String, require: true },
    subtitle: { type: String, require: true },
    willLearn: { type: [String], require: true },
    description: { type: String, require: true },
    card: { type: Schema.Types.ObjectId, ref: "Card" }
})
const CardPromo = mongoose.model("CardPromo", cardPromoSchema)
export default CardPromo