import "server-only"
import { MongoClient, type Db, type Collection } from "mongodb"
import type { User, ForumPost, ForumReply, Session, PrivateMessage, TypingStatus, GalleryAlbum } from "./models"

let client: MongoClient | null = null
let db: Db | null = null

async function connectToDatabase(): Promise<Db> {
  if (db) return db

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  db = client.db("nazzelandavionnadb")

  // Create indexes for better performance
  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("users").createIndex({ username: 1 }, { unique: true })
  await db.collection("sessions").createIndex({ token: 1 })
  await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

  return db
}

class MongoStorage {
  private async getCollection<T>(name: string): Promise<Collection<T>> {
    const database = await connectToDatabase()
    return database.collection<T>(name)
  }

  // Users
  async getUsers(): Promise<User[]> {
    const collection = await this.getCollection<User>("users")
    return await collection.find({}).toArray()
  }

  async saveUser(user: User): Promise<void> {
    const collection = await this.getCollection<User>("users")
    await collection.updateOne({ id: user.id }, { $set: user }, { upsert: true })
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const collection = await this.getCollection<User>("users")
    const user = await collection.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } })
    return user || undefined
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const collection = await this.getCollection<User>("users")
    const user = await collection.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } })
    return user || undefined
  }

  async getUserById(id: string): Promise<User | undefined> {
    const collection = await this.getCollection<User>("users")
    const user = await collection.findOne({ id })
    return user || undefined
  }

  async getOnlineUsers(): Promise<User[]> {
    const collection = await this.getCollection<User>("users")
    return await collection.find({ isOnline: true }).toArray()
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    const collection = await this.getCollection<User>("users")
    await collection.updateOne({ id: userId }, { $set: { isOnline, lastSeen: new Date() } })
  }

  // Forum Posts
  async getPosts(): Promise<ForumPost[]> {
    const collection = await this.getCollection<ForumPost>("forumPosts")
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async savePost(post: ForumPost): Promise<void> {
    const collection = await this.getCollection<ForumPost>("forumPosts")
    await collection.updateOne({ id: post.id }, { $set: post }, { upsert: true })
  }

  async getPostById(id: string): Promise<ForumPost | undefined> {
    const collection = await this.getCollection<ForumPost>("forumPosts")
    const post = await collection.findOne({ id })
    return post || undefined
  }

  // Forum Replies
  async getReplies(postId: string): Promise<ForumReply[]> {
    const collection = await this.getCollection<ForumReply>("forumReplies")
    return await collection.find({ postId }).sort({ createdAt: 1 }).toArray()
  }

  async saveReply(reply: ForumReply): Promise<void> {
    const collection = await this.getCollection<ForumReply>("forumReplies")
    await collection.insertOne(reply as any)
  }

  async getReplyById(replyId: string): Promise<ForumReply | undefined> {
    const collection = await this.getCollection<ForumReply>("forumReplies")
    const reply = await collection.findOne({ id: replyId })
    return reply || undefined
  }

  // Sessions
  async getSessions(): Promise<Session[]> {
    const collection = await this.getCollection<Session>("sessions")
    return await collection.find({}).toArray()
  }

  async saveSession(session: Session): Promise<void> {
    const collection = await this.getCollection<Session>("sessions")
    await collection.insertOne(session as any)
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const collection = await this.getCollection<Session>("sessions")
    const session = await collection.findOne({
      token,
      expiresAt: { $gt: new Date() },
    })
    return session || undefined
  }

  async deleteSession(token: string): Promise<void> {
    const collection = await this.getCollection<Session>("sessions")
    await collection.deleteOne({ token })
  }

  // Private Messages
  async getMessages(userId1: string, userId2: string): Promise<PrivateMessage[]> {
    const collection = await this.getCollection<PrivateMessage>("privateMessages")
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
    const collection = await this.getCollection<PrivateMessage>("privateMessages")
    await collection.insertOne(message as any)
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const collection = await this.getCollection<PrivateMessage>("privateMessages")
    await collection.updateOne({ id: messageId }, { $set: { isRead: true } })
  }

  async getUnreadCount(userId: string): Promise<number> {
    const collection = await this.getCollection<PrivateMessage>("privateMessages")
    return await collection.countDocuments({ receiverId: userId, isRead: false })
  }

  // Typing Status
  async getTypingStatus(userId: string): Promise<TypingStatus | undefined> {
    const collection = await this.getCollection<TypingStatus>("typingStatuses")
    const status = await collection.findOne({ userId })
    return status || undefined
  }

  async updateTypingStatus(status: TypingStatus): Promise<void> {
    const collection = await this.getCollection<TypingStatus>("typingStatuses")
    await collection.updateOne({ userId: status.userId }, { $set: status }, { upsert: true })
  }

  // Gallery Albums
  async getAlbums(): Promise<GalleryAlbum[]> {
    const collection = await this.getCollection<GalleryAlbum>("galleryAlbums")
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async saveAlbum(album: GalleryAlbum): Promise<void> {
    const collection = await this.getCollection<GalleryAlbum>("galleryAlbums")
    await collection.updateOne({ id: album.id }, { $set: album }, { upsert: true })
  }

  async getAlbumById(id: string): Promise<GalleryAlbum | undefined> {
    const collection = await this.getCollection<GalleryAlbum>("galleryAlbums")
    const album = await collection.findOne({ id })
    return album || undefined
  }

  async deleteAlbum(id: string): Promise<void> {
    const collection = await this.getCollection<GalleryAlbum>("galleryAlbums")
    await collection.deleteOne({ id })
  }
}

export const storage = new MongoStorage()
