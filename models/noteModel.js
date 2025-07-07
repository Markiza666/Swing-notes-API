import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - title
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the note (MongoDB _id).
 *           readOnly: true
 *         title:
 *           type: string
 *           description: The title of the note (max 50 characters).
 *           example: My first note
 *         text:
 *           type: string
 *           description: The text content of the note (max 300 characters).
 *           example: This is a test note.
 *         userId:
 *           type: string
 *           description: The ID of the user who owns the note.
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the note was created.
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the note was last updated.
 *           readOnly: true
 */
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
  },
  {
    timestamps: true,// Automatically adds createdAt and updatedAt fields
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;