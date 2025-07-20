import Note from '../models/noteModel.js';
import Joi from 'joi'; 

// Define Joi schema for creating a new note.
const noteSchema = Joi.object({
    title: Joi.string().max(50).required(),
    text: Joi.string().max(300).required()
});

// Define Joi schema for updating an existing note.
const noteUpdateSchema = Joi.object({
    title: Joi.string().max(50),
    text: Joi.string().max(300)
}).min(1); 

/**
 * Handles fetching all notes for the authenticated user.
 */
const getNotes = async (req, res) => {
    try {
        const notes = await Note.findByUserId(req.user.id);
        res.status(200).json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * Handles creating a new note.
 * Validates input and saves the note to the database, associating it with the authenticated user.
 */
const createNote = async (req, res) => {
    try {
        const { error } = noteSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { title, text } = req.body;
        const newNote = await Note.create(req.user.id, title, text);
        res.status(200).json(newNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * Handles updating an existing note.
 * Validates input, finds the note by ID and user ID, and updates it.
 */
const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = noteUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { title, text } = req.body;

        const updatedNote = await Note.update(id, req.user.id, title, text);

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found or you are not authorized to update it.' });
        }
        res.status(200).json(updatedNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * Handles deleting a note.
 * Finds the note by ID and user ID, and removes it from the database.
 */
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const numRemoved = await Note.delete(id, req.user.id);

        if (numRemoved === 0) {
            return res.status(404).json({ message: 'Note not found or you are not authorized to delete it.' });
        }
        res.status(200).json({ message: 'Note has been deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * Handles searching notes by title for the authenticated user.
 */
const searchNotes = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query (q) is required.' });
        }

        const notes = await Note.search(req.user.id, q);
        res.status(200).json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export { getNotes, createNote, updateNote, deleteNote, searchNotes };
