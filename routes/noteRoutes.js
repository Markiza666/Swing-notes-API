import express from 'express';
import Note from '../models/noteModel.js';
import authenticateToken from '../middleware/authMiddleware.js';
import { validateNote } from '../middleware/validationMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @swagger
 * tags:
 *     name: Notes
 *     description: Note management
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Retrieve all notes for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized (no token or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token, authorization denied.
 *       403:
 *         description: Forbidden (invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is not valid.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching notes
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        // req.user.id comes from the JWT payload after authentication
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Get notes error:", error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *             examples:
 *               newNote:
 *                 value:
 *                   title: "Meeting with team"
 *                   text: "Discuss project X and sprint planning."
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation Error: Title is required"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token, authorization denied.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is not valid.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error saving note
 */
router.post('/', authenticateToken, validateNote, async (req, res) => {
    const { title, text } = req.body;

    try {
        const newNote = await Note.create({
            title,
            text,
            userId: req.user.id,
        });
        res.status(201).json(newNote);
    } catch (error) {
        console.error("Create note error:", error);
        // Handle Mongoose validation errors that might occur even after Joi validation
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error saving note' });
    }
});

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Search for notes by title
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term for the note title
 *         example: meeting
 *     responses:
 *       200:
 *         description: A list of notes matching the search term
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       400:
 *         description: Search term missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Search query (q) is required
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token, authorization denied.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is not valid.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error searching notes
 */
router.get('/search', authenticateToken, async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ message: 'Search query (q) is required' });
    }

    try {
        const notes = await Note.find({
            userId: req.user.id,
            title: { $regex: new RegExp(q, 'i') }, // Case-insensitive search
        }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Search notes error:", error);
        res.status(500).json({ message: 'Error searching notes' });
    }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Retrieve a single note by ID for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: ID of the note to retrieve
 *     responses:
 *       200:
 *         description: The requested note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid note ID format.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token, authorization denied.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is not valid.
 *       404:
 *         description: Note not found or you do not have permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note not found.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching note.
 */
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid note ID format.' });
    }

    try {
        // Find the note by its ID AND ensure it belongs to the authenticated user
        const note = await Note.findOne({ _id: id, userId: req.user.id });

        if (!note) {
            // If no note is found (either wrong ID or wrong user), return 404
            return res.status(404).json({ message: 'Note not found.' });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error("Get single note error:", error);
        res.status(500).json({ message: 'Error fetching note.' });
    }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update an existing note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *             examples:
 *               updatedNote:
 *                 value:
 *                   title: "Meeting with team (Updated)"
 *                   text: "Discuss project X and sprint planning. Add new points."
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation Error: Title cannot be empty"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token, authorization denied.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is not valid.
 *       404:
 *         description: Note not found or you do not have permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note not found or you do not have permission to modify it
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating note
 */
router.put('/:id', authenticateToken, validateNote, async (req, res) => {
    const { id } = req.params; // Get note ID from URL parameters
    const { title, text } = req.body; // Get updated title and text from request body

    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { title, text },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            // If no note found with that ID for the current user, return 404
            return res.status(404).json({ message: 'Note not found or you do not have permission to modify it' });
        }
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Update note error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error updating note' });
    }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: ID of the note to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token, authorization denied.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is not valid.
 *       404:
 *         description: Note not found or you do not have permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note not found or you do not have permission to delete it
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting note
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) { 
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        // The query {_id: id, userId: req.user.id} ensures only the owner can delete the note.
        const result = await Note.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!result) {
            return res.status(404).json({ message: 'Note not found or you do not have permission to delete it' });
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error("Delete note error:", error);
        res.status(500).json({ message: 'Error deleting note' });
    }
});

export default router;
