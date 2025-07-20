import mongoose from 'mongoose'; 

/**
 * Function to connect to the MongoDB database.
 * Uses the MONGODB_URI from the .env file.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
