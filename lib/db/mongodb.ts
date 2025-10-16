import "server-only";
import { MongoClient, type Db, type Collection } from "mongodb";
import type {
  User,
  ForumPost,
  ForumReply,
  Session,
  PrivateMessage,
  TypingStatus,
  GalleryAlbum,
} from "./models";

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * MongoDB Singleton Connection
 */
class MongoDBConnection {
  private static instance: MongoDBConnection;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  async connect(): Promise<Db> {
    if (db && this.isConnected) return db;

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("❌ MONGODB_URI environment variable is missing");

    try {
      if (!client) {
        client = new MongoClient(uri, {
          // optional para mas stable sa serverless / Next.js
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
        });
      }

      // Connect lang kung hindi pa connected
      if (!this.isConnected) {
        await client.connect();
        this.isConnected = true;
        console.log("✅ MongoDB connected successfully");
      }

      db = client.db("nazzelandavionnadb");

      await this.ensureCollectionsExist();
      await this.createIndexes();

      return db;
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      this.isConnected = false;
      throw new Error("Database Unavailable");
    }
  }

  private async ensureCollectionsExist(): Promise<void> {
    if (!db) return;

    const existing = await db.listCollections().toArray();
    const existingNames = existing.map((c) => c.name);

    const required = [
      "users",
      "sessions",
      "forumPosts",
      "forumReplies",
      "privateMessages",
      "typingStatuses",
      "galleryAlbums",
    ];

    for (const name of required) {
      if (!existingNames.includes(name)) {
        await db.createCollection(name);
        console.log(`🆕 Created collection: ${name}`);
      }
    }
  }

  private async createIndexes(): Promise<void> {
    if (!db) return;

    try {
      const users = db.collection("users");
      await users.createIndex({ email: 1 }, { unique: true });
      await users.createIndex({ username: 1 }, { unique: true });
      await users.createIndex({ createdAt: -1 });
      await users.createIndex({ isOnline: 1 });

      const sessions = db.collection("sessions");
      await sessions.createIndex({ token: 1 }, { unique: true });
      await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

      const posts = db.collection("forumPosts");
      await posts.createIndex({ userId: 1 });
      await posts.createIndex({ category: 1 });
      await posts.createIndex({ createdAt: -1 });

      const replies = db.collection("forumReplies");
      await replies.createIndex({ postId: 1 });
      await replies.createIndex({ createdAt: 1 });

      const msgs = db.collection("privateMessages");
      await msgs.createIndex({ senderId: 1, receiverId: 1 });
      await msgs.createIndex({ createdAt: -1 });

      const typings = db.collection("typingStatuses");
      await typings.createIndex({ userId: 1 }, { unique: true });

      const albums = db.collection("galleryAlbums");
      await albums.createIndex({ createdBy: 1 });
      await albums.createIndex({ createdAt: -1 });

      console.log("✅ MongoDB indexes ensured successfully");
    } catch (err) {
      console.error("❌ Error creating indexes:", err);
    }
  }

  // Huwag agad isara, gamitin lang sa app lifecycle
  async disconnect(): Promise<void> {
    if (client) {
      await client.close();
      client = null;
      db = null;
      this.isConnected = false;
      console.log("✅ MongoDB disconnected");
    }
  }

  async getCollection<T>(name: string): Promise<Collection<T>> {
    const database = await this.connect();
    return database.collection<T>(name);
  }

  isMongoConnected(): boolean {
    return this.isConnected;
  }
}

/**
 * MongoDB Operations Helper
 */
export class MongoDBOperations {
  private connection = MongoDBConnection.getInstance();

  // === USERS ===
  async getUsers(): Promise<User[]> {
    const c = await this.connection.getCollection<User>("users");
    return c.find({}).toArray();
  }

  async saveUser(user: User): Promise<void> {
    const c = await this.connection.getCollection<User>("users");
    await c.updateOne({ id: user.id }, { $set: user }, { upsert: true });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const c = await this.connection.getCollection<User>("users");
    return (await c.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } })) || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const c = await this.connection.getCollection<User>("users");
    return (await c.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } })) || undefined;
  }

  // === SESSIONS ===
  async saveSession(session: Session): Promise<void> {
    const c = await this.connection.getCollection<Session>("sessions");
    await c.insertOne(session as any);
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const c = await this.connection.getCollection<Session>("sessions");
    return (await c.findOne({ token, expiresAt: { $gt: new Date() } })) || undefined;
  }

  // === STATUS ===
  async isConnected(): Promise<boolean> {
    try {
      await this.connection.connect();
      return this.connection.isMongoConnected();
    } catch {
      return false;
    }
  }
}

export const mongodb = new MongoDBOperations();
export const mongoConnection = MongoDBConnection.getInstance();
