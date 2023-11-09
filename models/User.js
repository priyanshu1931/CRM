import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required."]
    },
    contact: {
        type: Number,
        required: [true, "Contact number is required."]
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    role: {
        type: String,
        enum: ['admin', 'agent'],
        default: 'agent'
    },
    image: {
        type: String
    },
    leads: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Lead'
    }]
});

const User = mongoose.model('User', userSchema);

export default User;