import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// This is a helper route to debug database connections
export async function GET() {
  try {
    const client = await clientPromise

    // Get current database name from environment variable
    const currentDbName = process.env.MONGODB_DB_NAME || "restaurantDirectory"

    // Get all databases
    const adminDb = client.db("admin")
    const dbs = await adminDb.admin().listDatabases()

    const dbInfo: any[] = []

    // For each database, get collections and document counts
    for (const db of dbs.databases) {
      if (db.name !== "admin" && db.name !== "local" && db.name !== "config") {
        const database = client.db(db.name)
        const collections = await database.listCollections().toArray()

        const collectionInfo: any[] = []

        for (const collection of collections) {
          const count = await database.collection(collection.name).countDocuments()
          collectionInfo.push({
            name: collection.name,
            documentCount: count,
          })
        }

        dbInfo.push({
          name: db.name,
          isCurrentDb: db.name === currentDbName,
          collections: collectionInfo,
        })
      }
    }

    return NextResponse.json({
      success: true,
      currentDbName,
      databases: dbInfo,
    })
  } catch (error) {
    console.error("Error debugging database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
