import mongoose from 'mongoose'

const RoleSchema = mongoose.Schema({
    value: { type: String, unique: true, default: 'USER' }
})
const Role = mongoose.model('Role', RoleSchema)
export default Role