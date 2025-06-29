import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs';

// Define the Mongoose schema for the User model
const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [30, 'Username cannot be more than 30 characters long'],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'], 
            minlength: [6, 'Password must be at least 6 characters long'],
        },
    },
    {
        timestamps: true,   // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Pre-save middleware: Hash the password before saving the user document
userSchema.pre('save', async function (next) {
    // Only hash if the password field has been modified (or is new)
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    });

    // Instance method to compare an entered password with the hashed password in the database
    userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
