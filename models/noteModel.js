import mongoose from 'mongoose';

// Define the Mongoose schema for the Note model
const noteSchema = mongoose.Schema(
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        },
        title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters long'],
        },
        text: {
        type: String,
        required: [true, 'Please add text to the note'],
        maxlength: [300, 'Note text cannot be more than 300 characters long'],
        },
    },
    {
        timestamps: true,
    }
);

// Create the Mongoose model from the schema and export it
const Note = mongoose.model('Note', noteSchema);

export default Note;
