import { channel } from "diagnostics_channel";
//It imports the channel object from the "diagnostics_channel" module and the entire mongoose library.
import mongoose from "mongoose";
//incredibly common pattern used in nodeJS applications especially in severless environments like vercel.This technique is extremely used to cache a database connection in this case a mongodb conne ction by mongoose via across multiple invocations of serverless API routes in nextJS
const MONGODB_URI = process.env.MONGODB_URI;
//It retrieves the MongoDB connection URI from the environment variables.
let cached = (global as any).mongoose || { conn: null, promise: null }
//It initializes a variable named cached as a property of the global object as it's running in a Node.js environment. This is a caching mechanism to reuse the MongoDB connection if it has already been established.

export const connectToDatabase = async () => {
    //It exports a function named connectToDatabase as a constant. This function is asynchronous.
    if (cached.conn) return cached.conn;
    //If there's already a cached connection, it immediately returns that connection to avoid unnecessary reconnecting.
    if (!MONGODB_URI) throw new Error("MONGODB_URI is missing")
    //If the MongoDB URI is not defined (missing), it throws an error.
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: "planify",
        bufferCommands: false,
    });
    //It either uses the existing promise stored in cached.promise or creates a new promise by calling mongoose.connect to establish a connection to the MongoDB database. The options passed to mongoose.connect include the database name ("planify") and disabling command buffering.
    cached.conn = await cached.promise;
    return cached.conn;
}
