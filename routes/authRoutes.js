import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { validateAuth } from '../middleware/validationMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @swagger
 * tags:
 * name: Användare
 * description: Användarhantering och autentisering
 */

/**
 * @swagger
 * /api/user/signup:
 * post:
 * summary: Skapa ett nytt användarkonto
 * tags: [Användare]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserSignup'
 * responses:
 * 201:
 * description: Användare skapad framgångsrikt
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: User created successfully
 * userId:
 * type: string
 * example: 60d5ec49c6f2a7001c8c8c8c
 * 400:
 * description: Felaktig förfrågan (t.ex. användarnamn finns redan, valideringsfel)
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Username already exists
 * 500:
 * description: Internt serverfel
 */
router.post('/signup', validateAuth, async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
        }

        // Lösenordet hashas automatiskt via pre-save middleware i user.js
        const newUser = await User.create({
        username,
        password,
        });

        const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', userId: newUser._id, token });

    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/user/login:
 * post:
 * summary: Logga in en användare och få en JWT
 * tags: [Användare]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserLogin'
 * responses:
 * 200:
 * description: Inloggning lyckades
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 400:
 * description: Felaktiga inloggningsuppgifter
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Invalid credentials
 * 500:
 * description: Internt serverfel
 */
router.post('/login', validateAuth, async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Jämför det angivna lösenordet med det hashade lösenordet med hjälp av Mongoose-metoden
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generera en JWT
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
