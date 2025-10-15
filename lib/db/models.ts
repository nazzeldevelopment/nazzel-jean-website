export interface User {
  id: string
  username: string
  email: string
  password: string
  dateOfBirth: string
  relationshipStatus?: "Single" | "In a Relationship" | "Complicated" | "Married" | "Engaged"
  isVerified: boolean
  role?: "member" | "admin" | "guest"
  verificationCode?: string
  verificationCodeExpiry?: Date
  resetPasswordCode?: string
  resetPasswordCodeExpiry?: Date
  failedLoginAttempts: number
  accountLockedUntil?: Date
  agreedToTerms: boolean
  location?: string
  bio?: string
  postCount: number
  isOnline: boolean
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}

export interface ForumPost {
  id: string
  userId: string
  username: string
  title: string
  content: string
  category: "Love Letters" | "Memories" | "Thoughts & Quotes" | "Future Dreams" | "Open Talks"
  tags: string[] // e.g., ["anniversary", "promise", "memory"]
  mood?: "Happy" | "Hopeful" | "Sentimental" | "Thoughtful" | "Excited"
  likes: number
  replies: number
  views: number
  seenBy: string[] // Array of user IDs who viewed the post
  shares: number
  reactions: PostReaction[]
  createdAt: Date
  updatedAt: Date
}

export interface ForumReply {
  id: string
  postId: string
  userId: string
  username: string
  content: string
  likes: number
  reactions: PostReaction[]
  createdAt: Date
  updatedAt: Date
}

export interface PostReaction {
  userId: string
  username: string
  emoji: string
  createdAt: Date
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

export interface PrivateMessage {
  id: string
  senderId: string
  senderUsername: string
  receiverId: string
  receiverUsername: string
  content: string
  type: "text" | "image" | "gif"
  mediaUrl?: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TypingStatus {
  userId: string
  username: string
  isTyping: boolean
  lastUpdate: Date
}

export interface GalleryAlbum {
  id: string
  title: string
  description?: string
  isPrivate: boolean
  password?: string
  coverImage?: string
  photos: GalleryPhoto[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface GalleryPhoto {
  id: string
  albumId: string
  url: string
  caption?: string
  uploadedBy: string
  uploadedAt: Date
}
