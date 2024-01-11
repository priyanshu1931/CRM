import mongoose from "mongoose";
import breakSchema from "./breakSchema.js";

const dailyActivitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    targetLeads: {
        type: Number,
        required: [true, 'Number of Target leads is required.']
    },
    convertedLeads: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        default : 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive','paused']
    },
    numberOfHours: {
        type: Number,
        default: 0
    },
    breaks: [breakSchema],
    endTime: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const DailyActivity = mongoose.model('DailyActivity', dailyActivitySchema);

export default DailyActivity;