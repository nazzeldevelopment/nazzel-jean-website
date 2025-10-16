import "server-only"
import { mongodb } from "./mongodb"
import type {
  User,
  ForumPost,
  ForumReply,
  Session,
  PrivateMessage,
  TypingStatus,
  GalleryAlbum,
} from "./models"

class Storage {
  // USERS
  async getUsers(): Promise<User[]> {
    return mongodb.getUsers()
  }

  async saveUser(user: User): Promise<void> {
    await mongodb.saveUser(user)
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return mongodb.getUserByEmail(email)
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return mongodb.getUserByUsername(username)
  }

  async getUserById(id: string): Promise<User | undefined> {
    return mongodb.getUserById(id)
  }

  async getOnlineUsers(): Promise<User[]> {
    return mongodb.getOnlineUsers()
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await mongodb.updateUserOnlineStatus(userId, isOnline)
  }

  // FORUM POSTS
  async getPosts(): Promise<ForumPost[]> {
    return mongodb.getPosts()
  }

  async savePost(post: ForumPost): Promise<void> {
    await mongodb.savePost(post)
  }

  async getPostById(id: string): Promise<ForumPost | undefined> {
    return mongodb.getPostById(id)
  }

  // FORUM REPLIES
  async getReplies(postId: string): Promise<ForumReply[]> {
    return mongodb.getReplies(postId)
  }

  async saveReply(reply: ForumReply): Promise<void> {
    await mongodb.saveReply(reply)
  }

  async getReplyById(replyId: string): Promise<ForumReply | undefined> {
    return mongodb.getReplyById(replyId)
  }

  // SESSIONS
  async getSessions(): Promise<Session[]> {
    return mongodb.getSessions()
  }

  async saveSession(session: Session): Promise<void> {
    await mongodb.saveSession(session)
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    return mongodb.getSessionByToken(token)
  }

  async deleteSession(token: string): Promise<void> {
    await mongodb.deleteSession(token)
  }

  // PRIVATE MESSAGES
  async getMessages(userId1: string, userId2: string): Promise<PrivateMessage[]> {
    return mongodb.getMessages(userId1, userId2)
  }

  async saveMessage(message: PrivateMessage): Promise<void> {
    await mongodb.saveMessage(message)
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await mongodb.markMessageAsRead(messageId)
  }

  async getUnreadCount(userId: string): Promise<number> {
    return mongodb.getUnreadCount(userId)
  }

  // TYPING STATUS
  async getTypingStatus(userId: string): Promise<TypingStatus | undefined> {
    return mongodb.getTypingStatus(userId)
  }

  async updateTypingStatus(status: TypingStatus): Promise<void> {
    await mongodb.updateTypingStatus(status)
  }

  // GALLERY ALBUMS
  async getAlbums(): Promise<GalleryAlbum[]> {
    return mongodb.getAlbums()
  }

  async saveAlbum(album: GalleryAlbum): Promise<void> {
    await mongodb.saveAlbum(album)
  }

  async getAlbumById(id: string): Promise<GalleryAlbum | undefined> {
    return mongodb.getAlbumById(id)
  }

  async deleteAlbum(id: string): Promise<void> {
    await mongodb.deleteAlbum(id)
  }

  async getAlbumsByUser(userId: string): Promise<GalleryAlbum[]> {
    return mongodb.getAlbumsByUser(userId)
  }

  // UTILITIES
  async isMongoConnected(): Promise<boolean> {
    return mongodb.isConnected()
  }

  async getStats(): Promise<{
    users: number
    posts: number
    replies: number
    messages: number
    albums: number
  }> {
    return mongodb.getStats()
  }
}

export const storage = new Storage()
