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
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
        });
      }

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
      // Users
      const users = db.collection("users");
      await users.createIndex({ email: 1 }, { unique: true });
      await users.createIndex({ username: 1 }, { unique: true });
      await users.createIndex({ createdAt: -1 });
      await users.createIndex({ isOnline: 1 });

      // Sessions
      const sessions = db.collection("sessions");
      await sessions.createIndex({ token: 1 }, { unique: true });
      await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

      // Forum posts
      const posts = db.collection("forumPosts");
      await posts.createIndex({ userId: 1 });
      await posts.createIndex({ category: 1 });
      await posts.createIndex({ createdAt: -1 });

      // Forum replies
      const replies = db.collection("forumReplies");
      await replies.createIndex({ postId: 1 });
      await replies.createIndex({ createdAt: 1 });

      // Private messages
      const msgs = db.collection("privateMessages");
      await msgs.createIndex({ senderId: 1, receiverId: 1 });
      await msgs.createIndex({ createdAt: -1 });

      // Typing statuses
      const typings = db.collection("typingStatuses");
      await typings.createIndex({ userId: 1 }, { unique: true });

      // Gallery albums
      const albums = db.collection("galleryAlbums");
      await albums.createIndex({ createdBy: 1 });
      await albums.createIndex({ createdAt: -1 });

      console.log("✅ MongoDB indexes ensured successfully");
    } catch (err) {
      console.error("❌ Error creating indexes:", err);
    }
  }

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

  async getOnlineUsers(): Promise<User[]> {
    const c = await this.connection.getCollection<User>("users");
    return c
      .find({ isOnline: true })
      .project({ password: 0 })
      .sort({ username: 1 })
      .toArray();
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    if (!ids.length) return [];
    const c = await this.connection.getCollection<User>("users");
    return c
      .find({ id: { $in: ids } })
      .project({ password: 0 })
      .toArray();
  }

  async getUserById(id: string): Promise<User | undefined> {
    const c = await this.connection.getCollection<User>("users");
    return (await c.findOne({ id })) || undefined;
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    const c = await this.connection.getCollection<User>("users");
    await c.updateOne(
      { id: userId },
      {
        $set: {
          isOnline,
          lastSeen: new Date(),
          updatedAt: new Date(),
        },
      },
    );
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

  // === FORUM POSTS ===
  async getPosts(): Promise<ForumPost[]> {
    const c = await this.connection.getCollection<ForumPost>("forumPosts");
    return c.find({}).sort({ createdAt: -1 }).toArray();
  }

  async getForumPostById(id: string): Promise<ForumPost | undefined> {
    const c = await this.connection.getCollection<ForumPost>("forumPosts");
    return (await c.findOne({ id })) || undefined;
  }

  async savePost(post: ForumPost): Promise<void> {
    const c = await this.connection.getCollection<ForumPost>("forumPosts");
    await c.updateOne({ id: post.id }, { $set: post }, { upsert: true });
  }

  async saveReply(reply: ForumReply): Promise<void> {
    const c = await this.connection.getCollection<ForumReply>("forumReplies");
    await c.updateOne({ id: reply.id }, { $set: reply }, { upsert: true });
  }

  async getReplies(postId: string): Promise<ForumReply[]> {
    const c = await this.connection.getCollection<ForumReply>("forumReplies");
    return c.find({ postId }).sort({ createdAt: 1 }).toArray();
  }

  async getReplyById(id: string): Promise<ForumReply | undefined> {
    const c = await this.connection.getCollection<ForumReply>("forumReplies");
    return (await c.findOne({ id })) || undefined;
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

  async getSessions(): Promise<Session[]> {
    const c = await this.connection.getCollection<Session>("sessions");
    return c.find({}).toArray();
  }

  async deleteSession(token: string): Promise<void> {
    const c = await this.connection.getCollection<Session>("sessions");
    await c.deleteOne({ token });
  }

  // === PRIVATE MESSAGES ===
  async getMessages(userId1: string, userId2: string): Promise<PrivateMessage[]> {
    const c = await this.connection.getCollection<PrivateMessage>("privateMessages");
    return c
      .find({
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      })
      .sort({ createdAt: 1 })
      .toArray();
  }

  async saveMessage(message: PrivateMessage): Promise<void> {
    const c = await this.connection.getCollection<PrivateMessage>("privateMessages");
    await c.updateOne({ id: message.id }, { $set: message }, { upsert: true });
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const c = await this.connection.getCollection<PrivateMessage>("privateMessages");
    await c.updateOne(
      { id: messageId },
      {
        $set: {
          isRead: true,
          updatedAt: new Date(),
        },
      },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    const c = await this.connection.getCollection<PrivateMessage>("privateMessages");
    return c.countDocuments({ receiverId: userId, isRead: false });
  }

  // === TYPING STATUS ===
  async getTypingStatus(userId: string): Promise<TypingStatus | undefined> {
    const c = await this.connection.getCollection<TypingStatus>("typingStatuses");
    return (await c.findOne({ userId })) || undefined;
  }

  async updateTypingStatus(status: TypingStatus): Promise<void> {
    const c = await this.connection.getCollection<TypingStatus>("typingStatuses");
    await c.updateOne({ userId: status.userId }, { $set: status }, { upsert: true });
  }

  // === GALLERY ALBUMS ===
  async getAlbums(): Promise<GalleryAlbum[]> {
    const c = await this.connection.getCollection<GalleryAlbum>("galleryAlbums");
    return c.find({}).sort({ createdAt: -1 }).toArray();
  }

  async saveAlbum(album: GalleryAlbum): Promise<void> {
    const c = await this.connection.getCollection<GalleryAlbum>("galleryAlbums");
    await c.updateOne({ id: album.id }, { $set: album }, { upsert: true });
  }

  async getAlbumById(id: string): Promise<GalleryAlbum | undefined> {
    const c = await this.connection.getCollection<GalleryAlbum>("galleryAlbums");
    return (await c.findOne({ id })) || undefined;
  }

  async deleteAlbum(id: string): Promise<void> {
    const c = await this.connection.getCollection<GalleryAlbum>("galleryAlbums");
    await c.deleteOne({ id });
  }

  async getAlbumsByUser(userId: string): Promise<GalleryAlbum[]> {
    const c = await this.connection.getCollection<GalleryAlbum>("galleryAlbums");
    return c.find({ createdBy: userId }).sort({ createdAt: -1 }).toArray();
  }

  // === STATS ===
  async getStats(): Promise<{
    users: number;
    posts: number;
    replies: number;
    messages: number;
    albums: number;
  }> {
    const users = await (await this.connection.getCollection<User>("users")).countDocuments();
    const posts = await (await this.connection.getCollection<ForumPost>("forumPosts")).countDocuments();
    const replies = await (await this.connection.getCollection<ForumReply>("forumReplies")).countDocuments();
    const messages = await (await this.connection.getCollection<PrivateMessage>("privateMessages")).countDocuments();
    const albums = await (await this.connection.getCollection<GalleryAlbum>("galleryAlbums")).countDocuments();

    return { users, posts, replies, messages, albums };
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
