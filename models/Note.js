import mongoose from "mongoose";

const noteSchema = mongoose.Schema({
    isReminder: {
        type: Boolean,
        default: false,
    },
    reminderTime:{
        type : Date,
    },
    message: {
        type: String,
        required: [true, 'Message is required.']
    }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

export default Note;