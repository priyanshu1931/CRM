import mongoose from "mongoose";

const leadSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Lead name is required."]
    },
    contact: {
        type: Number,
        required: [true, 'Lead contact is required.']
    },
    notes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Note'
    }]
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;