import "server-only"
import { mongodb } from "./mongodb"
import type { User, ForumPost, ForumReply, Session, PrivateMessage, TypingStatus, GalleryAlbum } from "./models"

class Storage {
  // Users
  async getUsers(): Promise<User[]> {
    return await mongodb.getUsers()
  }

  async saveUser(user: User): Promise<void> {
    await mongodb.saveUser(user)
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await mongodb.getUserByEmail(email)
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await mongodb.getUserByUsername(username)
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await mongodb.getUserById(id)
  }

  async getOnlineUsers(): Promise<User[]> {
    return await mongodb.getOnlineUsers()
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await mongodb.updateUserOnlineStatus(userId, isOnline)
  }

  // Forum Posts
  async getPosts(): Promise<ForumPost[]> {
    return await mongodb.getPosts()
  }

  async savePost(post: ForumPost): Promise<void> {
    await mongodb.savePost(post)
  }

  async getPostById(id: string): Promise<ForumPost | undefined> {
    return await mongodb.getPostById(id)
  }

  // Forum Replies
  async getReplies(postId: string): Promise<ForumReply[]> {
    return await mongodb.getReplies(postId)
  }

  async saveReply(reply: ForumReply): Promise<void> {
    await mongodb.saveReply(reply)
  }

  async getReplyById(replyId: string): Promise<ForumReply | undefined> {
    return await mongodb.getReplyById(replyId)
  }

  // Sessions
  async getSessions(): Promise<Session[]> {
    return await mongodb.getSessions()
  }

  async saveSession(session: Session): Promise<void> {
    await mongodb.saveSession(session)
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    return await mongodb.getSessionByToken(token)
  }

  async deleteSession(token: string): Promise<void> {
    await mongodb.deleteSession(token)
  }

  // Private Messages
  async getMessages(userId1: string, userId2: string): Promise<PrivateMessage[]> {
    return await mongodb.getMessages(userId1, userId2)
  }

  async saveMessage(message: PrivateMessage): Promise<void> {
    await mongodb.saveMessage(message)
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await mongodb.markMessageAsRead(messageId)
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await mongodb.getUnreadCount(userId)
  }

  // Typing Status
  async getTypingStatus(userId: string): Promise<TypingStatus | undefined> {
    return await mongodb.getTypingStatus(userId)
  }

  async updateTypingStatus(status: TypingStatus): Promise<void> {
    await mongodb.updateTypingStatus(status)
  }

  // Gallery Albums
  async getAlbums(): Promise<GalleryAlbum[]> {
    return await mongodb.getAlbums()
  }

  async saveAlbum(album: GalleryAlbum): Promise<void> {
    await mongodb.saveAlbum(album)
  }

  async getAlbumById(id: string): Promise<GalleryAlbum | undefined> {
    return await mongodb.getAlbumById(id)
  }

  async deleteAlbum(id: string): Promise<void> {
    await mongodb.deleteAlbum(id)
  }

  // Utility methods
  async isMongoConnected(): Promise<boolean> {
    return await mongodb.isConnected()
  }

  async getStats(): Promise<{
    users: number
    posts: number
    replies: number
    messages: number
    albums: number
  }> {
    return await mongodb.getStats()
  }
}

export const storage = new Storage()
