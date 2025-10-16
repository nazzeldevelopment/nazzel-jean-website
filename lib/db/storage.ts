import "server-only"
import { mongodb } from "./mongodb"
import type { User, ForumPost, ForumReply, Session, PrivateMessage, TypingStatus, GalleryAlbum } from "./models"

// In-memory fallback storage for development
const inMemoryStorage = {
  users: new Map<string, User>(),
  posts: new Map<string, ForumPost>(),
  replies: new Map<string, ForumReply>(),
  sessions: new Map<string, Session>(),
  messages: new Map<string, PrivateMessage>(),
  typingStatuses: new Map<string, TypingStatus>(),
  albums: new Map<string, GalleryAlbum>(),
}

class Storage {
  // Users
  async getUsers(): Promise<User[]> {
    try {
      return await mongodb.getUsers()
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.users.values())
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      await mongodb.saveUser(user)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      inMemoryStorage.users.set(user.id, user)
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      return await mongodb.getUserByEmail(email)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase())
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      return await mongodb.getUserByUsername(username)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.users.values()).find(u => u.username.toLowerCase() === username.toLowerCase())
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    try {
      return await mongodb.getUserById(id)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return inMemoryStorage.users.get(id)
    }
  }

  async getOnlineUsers(): Promise<User[]> {
    try {
      return await mongodb.getOnlineUsers()
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.users.values()).filter(u => u.isOnline)
    }
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      await mongodb.updateUserOnlineStatus(userId, isOnline)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      const user = inMemoryStorage.users.get(userId)
      if (user) {
        user.isOnline = isOnline
        user.lastSeen = new Date()
        inMemoryStorage.users.set(userId, user)
      }
    }
  }

  // Forum Posts
  async getPosts(): Promise<ForumPost[]> {
    try {
      return await mongodb.getPosts()
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.posts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  }

  async savePost(post: ForumPost): Promise<void> {
    try {
      await mongodb.savePost(post)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      inMemoryStorage.posts.set(post.id, post)
    }
  }

  async getPostById(id: string): Promise<ForumPost | undefined> {
    try {
      return await mongodb.getPostById(id)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return inMemoryStorage.posts.get(id)
    }
  }

  // Forum Replies
  async getReplies(postId: string): Promise<ForumReply[]> {
    try {
      return await mongodb.getReplies(postId)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.replies.values())
        .filter(r => r.postId === postId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    }
  }

  async saveReply(reply: ForumReply): Promise<void> {
    try {
      await mongodb.saveReply(reply)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      inMemoryStorage.replies.set(reply.id, reply)
    }
  }

  async getReplyById(replyId: string): Promise<ForumReply | undefined> {
    try {
      return await mongodb.getReplyById(replyId)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return inMemoryStorage.replies.get(replyId)
    }
  }

  // Sessions
  async getSessions(): Promise<Session[]> {
    try {
      return await mongodb.getSessions()
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.sessions.values())
    }
  }

  async saveSession(session: Session): Promise<void> {
    try {
      await mongodb.saveSession(session)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      inMemoryStorage.sessions.set(session.id, session)
    }
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    try {
      return await mongodb.getSessionByToken(token)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.sessions.values()).find(s => s.token === token && s.expiresAt > new Date())
    }
  }

  async deleteSession(token: string): Promise<void> {
    try {
      await mongodb.deleteSession(token)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      const session = Array.from(inMemoryStorage.sessions.values()).find(s => s.token === token)
      if (session) {
        inMemoryStorage.sessions.delete(session.id)
      }
    }
  }

  // Private Messages
  async getMessages(userId1: string, userId2: string): Promise<PrivateMessage[]> {
    try {
      return await mongodb.getMessages(userId1, userId2)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.messages.values())
        .filter(m => 
          (m.senderId === userId1 && m.receiverId === userId2) ||
          (m.senderId === userId2 && m.receiverId === userId1)
        )
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    }
  }

  async saveMessage(message: PrivateMessage): Promise<void> {
    try {
      await mongodb.saveMessage(message)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      inMemoryStorage.messages.set(message.id, message)
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await mongodb.markMessageAsRead(messageId)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      const message = inMemoryStorage.messages.get(messageId)
      if (message) {
        message.isRead = true
        inMemoryStorage.messages.set(messageId, message)
      }
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await mongodb.getUnreadCount(userId)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.messages.values()).filter(m => m.receiverId === userId && !m.isRead).length
    }
  }

  // Typing Status
  async getTypingStatus(userId: string): Promise<TypingStatus | undefined> {
    try {
      return await mongodb.getTypingStatus(userId)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return inMemoryStorage.typingStatuses.get(userId)
    }
  }

  async updateTypingStatus(status: TypingStatus): Promise<void> {
    try {
      await mongodb.updateTypingStatus(status)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      inMemoryStorage.typingStatuses.set(status.userId, status)
    }
  }

  // Gallery Albums
  async getAlbums(): Promise<GalleryAlbum[]> {
    try {
      return await mongodb.getAlbums()
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return Array.from(inMemoryStorage.albums.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  }

  async saveAlbum(album: GalleryAlbum): Promise<void> {
    try {
      await mongodb.saveAlbum(album)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      inMemoryStorage.albums.set(album.id, album)
    }
  }

  async getAlbumById(id: string): Promise<GalleryAlbum | undefined> {
    try {
      return await mongodb.getAlbumById(id)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      return inMemoryStorage.albums.get(id)
    }
  }

  async deleteAlbum(id: string): Promise<void> {
    try {
      await mongodb.deleteAlbum(id)
    } catch (error) {
      console.warn("MongoDB not available, using in-memory storage")
      inMemoryStorage.albums.delete(id)
    }
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
    try {
      return await mongodb.getStats()
    } catch (error) {
      console.warn("MongoDB not available, returning in-memory stats")
      return {
        users: inMemoryStorage.users.size,
        posts: inMemoryStorage.posts.size,
        replies: inMemoryStorage.replies.size,
        messages: inMemoryStorage.messages.size,
        albums: inMemoryStorage.albums.size,
      }
    }
  }
}

export const storage = new Storage()
