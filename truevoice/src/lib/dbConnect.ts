import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number,
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {

    // case one is connection is already establish
    if (connection.isConnected) {
        console.log("Already connected to database")
        return;
    }

    try {
        //TODO: console log it so see details
        const db = await mongoose.connect(process.env.MONGODB_URL || '', {})

        connection.isConnected = db.connections[0].readyState
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Database connected failed", error)
        process.exit(1)
    }
}

export default dbConnect