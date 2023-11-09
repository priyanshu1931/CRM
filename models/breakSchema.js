import mongoose from "mongoose";

const breakSchema = mongoose.Schema({
    reason: {
        type: String,
        required: [true, "Break reason is required."],
    },
    time: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default breakSchema;