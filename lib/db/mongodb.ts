import "server-only"
import { MongoClient, type Db, type Collection } from "mongodb"
import type { User, ForumPost, ForumReply, Session, PrivateMessage, TypingStatus, GalleryAlbum } from "./models"

let client: MongoClient | null = null
let db: Db | null = null

// MongoDB Connection Manager
class MongoDBConnection {
  private static instance: MongoDBConnection
  private isConnected: boolean = false

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection()
    }
    return MongoDBConnection.instance
  }

  async connect(): Promise<Db> {
    if (db && this.isConnected) {
      return db
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    try {
      client = new MongoClient(process.env.MONGODB_URI)
      await client.connect()
      db = client.db("nazzelandavionnadb")
      this.isConnected = true

      // Create indexes for better performance
      await this.createIndexes()

      console.log("✅ MongoDB connected successfully")
      return db
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error)
      this.isConnected = false
      throw error
    }
  }

  private async createIndexes(): Promise<void> {
    if (!db) return

    try {
      // Users collection indexes
      await db.collection("users").createIndex({ email: 1 }, { unique: true })
      await db.collection("users").createIndex({ username: 1 }, { unique: true })
      await db.collection("users").createIndex({ isOnline: 1 })
      await db.collection("users").createIndex({ createdAt: -1 })

      // Sessions collection indexes
      await db.collection("sessions").createIndex({ token: 1 }, { unique: true })
      await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
      await db.collection("sessions").createIndex({ userId: 1 })

      // Forum posts collection indexes
      await db.collection("forumPosts").createIndex({ userId: 1 })
      await db.collection("forumPosts").createIndex({ category: 1 })
      await db.collection("forumPosts").createIndex({ createdAt: -1 })
      await db.collection("forumPosts").createIndex({ views: -1 })
      await db.collection("forumPosts").createIndex({ likes: -1 })

      // Forum replies collection indexes
      await db.collection("forumReplies").createIndex({ postId: 1 })
      await db.collection("forumReplies").createIndex({ userId: 1 })
      await db.collection("forumReplies").createIndex({ createdAt: 1 })

      // Private messages collection indexes
      await db.collection("privateMessages").createIndex({ senderId: 1, receiverId: 1 })
      await db.collection("privateMessages").createIndex({ receiverId: 1, isRead: 1 })
      await db.collection("privateMessages").createIndex({ createdAt: -1 })

      // Typing status collection indexes
      await db.collection("typingStatuses").createIndex({ userId: 1 }, { unique: true })

      // Gallery albums collection indexes
      await db.collection("galleryAlbums").createIndex({ createdBy: 1 })
      await db.collection("galleryAlbums").createIndex({ createdAt: -1 })
      await db.collection("galleryAlbums").createIndex({ isPrivate: 1 })

      console.log("✅ MongoDB indexes created successfully")
    } catch (error) {
      console.error("❌ Error creating MongoDB indexes:", error)
    }
  }

  async disconnect(): Promise<void> {
    if (client) {
      await client.close()
      client = null
      db = null
      this.isConnected = false
      console.log("✅ MongoDB disconnected")
    }
  }

  async getCollection<T>(name: string): Promise<Collection<T>> {
    const database = await this.connect()
    return database.collection<T>(name)
  }

  isMongoConnected(): boolean {
    return this.isConnected
  }
}

// MongoDB Operations Class
export class MongoDBOperations {
  private connection: MongoDBConnection

  constructor() {
    this.connection = MongoDBConnection.getInstance()
  }

  // Users Operations
  async getUsers(): Promise<User[]> {
    const collection = await this.connection.getCollection<User>("users")
    return await collection.find({}).toArray()
  }

  async saveUser(user: User): Promise<void> {
    const collection = await this.connection.getCollection<User>("users")
    await collection.updateOne({ id: user.id }, { $set: user }, { upsert: true })
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const collection = await this.connection.getCollection<User>("users")
    const user = await collection.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } })
    return user || undefined
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const collection = await this.connection.getCollection<User>("users")
    const user = await collection.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } })
    return user || undefined
  }

  async getUserById(id: string): Promise<User | undefined> {
    const collection = await this.connection.getCollection<User>("users")
    const user = await collection.findOne({ id })
    return user || undefined
  }

  async getOnlineUsers(): Promise<User[]> {
    const collection = await this.connection.getCollection<User>("users")
    return await collection.find({ isOnline: true }).toArray()
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    const collection = await this.connection.getCollection<User>("users")
    await collection.updateOne({ id: userId }, { $set: { isOnline, lastSeen: new Date() } })
  }

  // Forum Posts Operations
  async getPosts(): Promise<ForumPost[]> {
    const collection = await this.connection.getCollection<ForumPost>("forumPosts")
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async savePost(post: ForumPost): Promise<void> {
    const collection = await this.connection.getCollection<ForumPost>("forumPosts")
    await collection.updateOne({ id: post.id }, { $set: post }, { upsert: true })
  }

  async getPostById(id: string): Promise<ForumPost | undefined> {
    const collection = await this.connection.getCollection<ForumPost>("forumPosts")
    const post = await collection.findOne({ id })
    return post || undefined
  }

  async getPostsByCategory(category: string): Promise<ForumPost[]> {
    const collection = await this.connection.getCollection<ForumPost>("forumPosts")
    return await collection.find({ category }).sort({ createdAt: -1 }).toArray()
  }

  async getPostsByUser(userId: string): Promise<ForumPost[]> {
    const collection = await this.connection.getCollection<ForumPost>("forumPosts")
    return await collection.find({ userId }).sort({ createdAt: -1 }).toArray()
  }

  // Forum Replies Operations
  async getReplies(postId: string): Promise<ForumReply[]> {
    const collection = await this.connection.getCollection<ForumReply>("forumReplies")
    return await collection.find({ postId }).sort({ createdAt: 1 }).toArray()
  }

  async saveReply(reply: ForumReply): Promise<void> {
    const collection = await this.connection.getCollection<ForumReply>("forumReplies")
    await collection.insertOne(reply as any)
  }

  async getReplyById(replyId: string): Promise<ForumReply | undefined> {
    const collection = await this.connection.getCollection<ForumReply>("forumReplies")
    const reply = await collection.findOne({ id: replyId })
    return reply || undefined
  }

  // Sessions Operations
  async getSessions(): Promise<Session[]> {
    const collection = await this.connection.getCollection<Session>("sessions")
    return await collection.find({}).toArray()
  }

  async saveSession(session: Session): Promise<void> {
    const collection = await this.connection.getCollection<Session>("sessions")
    await collection.insertOne(session as any)
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const collection = await this.connection.getCollection<Session>("sessions")
    const session = await collection.findOne({
      token,
      expiresAt: { $gt: new Date() },
    })
    return session || undefined
  }

  async deleteSession(token: string): Promise<void> {
    const collection = await this.connection.getCollection<Session>("sessions")
    await collection.deleteOne({ token })
  }

  async deleteExpiredSessions(): Promise<void> {
    const collection = await this.connection.getCollection<Session>("sessions")
    await collection.deleteMany({ expiresAt: { $lt: new Date() } })
  }

  // Private Messages Operations
  async getMessages(userId1: string, userId2: string): Promise<PrivateMessage[]> {
    const collection = await this.connection.getCollection<PrivateMessage>("privateMessages")
    return await collection
      .find({
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      })
      .sort({ createdAt: 1 })
      .toArray()
  }

  async saveMessage(message: PrivateMessage): Promise<void> {
    const collection = await this.connection.getCollection<PrivateMessage>("privateMessages")
    await collection.insertOne(message as any)
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const collection = await this.connection.getCollection<PrivateMessage>("privateMessages")
    await collection.updateOne({ id: messageId }, { $set: { isRead: true } })
  }

  async getUnreadCount(userId: string): Promise<number> {
    const collection = await this.connection.getCollection<PrivateMessage>("privateMessages")
    return await collection.countDocuments({ receiverId: userId, isRead: false })
  }

  // Typing Status Operations
  async getTypingStatus(userId: string): Promise<TypingStatus | undefined> {
    const collection = await this.connection.getCollection<TypingStatus>("typingStatuses")
    const status = await collection.findOne({ userId })
    return status || undefined
  }

  async updateTypingStatus(status: TypingStatus): Promise<void> {
    const collection = await this.connection.getCollection<TypingStatus>("typingStatuses")
    await collection.updateOne({ userId: status.userId }, { $set: status }, { upsert: true })
  }

  // Gallery Albums Operations
  async getAlbums(): Promise<GalleryAlbum[]> {
    const collection = await this.connection.getCollection<GalleryAlbum>("galleryAlbums")
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async saveAlbum(album: GalleryAlbum): Promise<void> {
    const collection = await this.connection.getCollection<GalleryAlbum>("galleryAlbums")
    await collection.updateOne({ id: album.id }, { $set: album }, { upsert: true })
  }

  async getAlbumById(id: string): Promise<GalleryAlbum | undefined> {
    const collection = await this.connection.getCollection<GalleryAlbum>("galleryAlbums")
    const album = await collection.findOne({ id })
    return album || undefined
  }

  async deleteAlbum(id: string): Promise<void> {
    const collection = await this.connection.getCollection<GalleryAlbum>("galleryAlbums")
    await collection.deleteOne({ id })
  }

  async getAlbumsByUser(userId: string): Promise<GalleryAlbum[]> {
    const collection = await this.connection.getCollection<GalleryAlbum>("galleryAlbums")
    return await collection.find({ createdBy: userId }).sort({ createdAt: -1 }).toArray()
  }

  // Utility Methods
  async isConnected(): Promise<boolean> {
    try {
      await this.connection.connect()
      return this.connection.isMongoConnected()
    } catch (error) {
      return false
    }
  }

  async getStats(): Promise<{
    users: number
    posts: number
    replies: number
    messages: number
    albums: number
  }> {
    const [users, posts, replies, messages, albums] = await Promise.all([
      this.connection.getCollection("users").then(c => c.countDocuments()),
      this.connection.getCollection("forumPosts").then(c => c.countDocuments()),
      this.connection.getCollection("forumReplies").then(c => c.countDocuments()),
      this.connection.getCollection("privateMessages").then(c => c.countDocuments()),
      this.connection.getCollection("galleryAlbums").then(c => c.countDocuments()),
    ])

    return { users, posts, replies, messages, albums }
  }
}

// Export singleton instance
export const mongodb = new MongoDBOperations()

// Export connection manager for advanced usage
export const mongoConnection = MongoDBConnection.getInstance()
