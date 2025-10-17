import mongoose from "mongoose";


export async function connectDB () {
    try {
        await mongoose.connect(process.env.MONGO_URI2!);
        const connection = mongoose.connection;
            
        connection.on('connected', () => {
            console.log("✅ MongoDB Connected...");
        })
        
        connection.on('error', (err) => {
            console.error('MongoDB connection error. please make sure MongoDB is running. ')
            console.error(err);
            process.exit(1);
        })
        
    } catch (error) {
        console.error("❌ MongoDB disconnected...")
        console.error(error);
        process.exit(1);
    }
}
