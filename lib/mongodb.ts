import { MongoClient } from "mongodb"

// Ensure MongoDB URI is available
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
// Add connection options for better performance and reliability
const options = {
  maxPoolSize: 10,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client
let clientPromise: Promise<MongoClient>

// In development mode, use a global variable to preserve connection across hot reloads
if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, create a new client for each connection
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Add error handling for connection
clientPromise.catch((err) => {
  console.error("MongoDB connection error:", err)
})

export default clientPromise

/**
 * Helper function to get the database with the configured name
 * @returns MongoDB database instance
 */
export async function getDatabase() {
  try {
    const client = await clientPromise
    // Use the environment variable for the database name, with a fallback
    const dbName = process.env.MONGODB_DB_NAME || "restaurantDirectory"
    return client.db(dbName)
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw error
  }
}
