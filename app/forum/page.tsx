"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Plus,
  LogOut,
  AlertCircle,
  Loader2,
  Users,
  Lock,
  Eye,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Search,
  Heart,
  Camera,
  MessageCircle,
  Sparkles,
  Globe,
  SortAsc,
  Tag,
  Smile,
} from "lucide-react"
import type { ForumPost, User } from "@/lib/db/models"
import { EnhancedHeader } from "@/components/enhanced-header"
import { apiFetch } from "@/lib/utils"
import { NotificationCenter } from "@/components/notification-center"

const categories = ["Love Letters", "Memories", "Thoughts & Quotes", "Future Dreams", "Open Talks"]

const categoryIcons = {
  "Love Letters": Heart,
  Memories: Camera,
  "Thoughts & Quotes": MessageCircle,
  "Future Dreams": Sparkles,
  "Open Talks": Globe,
}

const moodOptions = ["Happy", "Hopeful", "Sentimental", "Thoughtful", "Excited"]

const moodColors = {
  Happy: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300",
  Hopeful: "bg-blue-100 dark:bg-blue-900/30 border-blue-300",
  Sentimental: "bg-pink-100 dark:bg-pink-900/30 border-pink-300",
  Thoughtful: "bg-purple-100 dark:bg-purple-900/30 border-purple-300",
  Excited: "bg-orange-100 dark:bg-orange-900/30 border-orange-300",
}

const reactionEmojis = ["❤️", "👍", "😂", "😮", "😢", "🔥"]

export default function ForumPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "", tags: "", mood: "" })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [sharePostId, setSharePostId] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "most-liked" | "most-discussed">("newest")
  const [coupleMode, setCoupleMode] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      // Fetch user data from API
      const fetchUser = async () => {
        try {
          const response = await apiFetch("/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const data = await response.json()
          if (response.ok && data.user) {
            setUser(data.user)
            updateOnlineStatus(true)

            const interval = setInterval(() => {
              updateOnlineStatus(true)
            }, 30000)

            window.addEventListener("beforeunload", () => updateOnlineStatus(false))

            return () => {
              clearInterval(interval)
              window.removeEventListener("beforeunload", () => updateOnlineStatus(false))
            }
          }
        } catch (err) {
          console.error("Nazzel and Aviona Fetch user error:", err)
        }
      }

      fetchUser()
    }

    loadPosts()
    loadOnlineUsers()
  }, [])

  useEffect(() => {
    let filtered = [...posts]

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Couple mode filter (only posts by Nazzel and Avionna)
    if (coupleMode) {
      filtered = filtered.filter(
        (post) => post.username.toLowerCase() === "nazzel" || post.username.toLowerCase() === "avionna",
      )
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "most-liked":
        filtered.sort((a, b) => (b.reactions?.length || 0) - (a.reactions?.length || 0))
        break
      case "most-discussed":
        filtered.sort((a, b) => b.replies - a.replies)
        break
    }

    setFilteredPosts(filtered)
  }, [posts, selectedCategory, searchQuery, sortBy, coupleMode])

  const loadPosts = async () => {
    try {
      const response = await apiFetch("/forum/posts")
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      console.error("Nazzel and Aviona Load posts error:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadOnlineUsers = async () => {
    try {
      const response = await apiFetch("/users/online")
      const data = await response.json()
      setOnlineUsers(data.users || [])
    } catch (err) {
      console.error("Nazzel and Aviona Load online users error:", err)
    }
  }

  const updateOnlineStatus = async (isOnline: boolean) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      await apiFetch("/users/online", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isOnline }),
      })

      if (isOnline) {
        loadOnlineUsers()
      }
    } catch (err) {
      console.error("Nazzel and Aviona Update online status error:", err)
    }
  }

  const trackPostView = async (postId: string) => {
    try {
      await apiFetch(`/forum/posts/${postId}/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      })
      loadPosts()
    } catch (err) {
      console.error("Nazzel and Aviona Track view error:", err)
    }
  }

  const handleReaction = async (postId: string, emoji: string) => {
    if (!user) {
      router.push("/signup/account")
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      await apiFetch(`/forum/posts/${postId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emoji }),
      })
      loadPosts()
    } catch (err) {
      console.error("Nazzel and Aviona Reaction error:", err)
    }
  }

  const handleShare = async (postId: string, platform: string) => {
    try {
      await apiFetch(`/forum/posts/${postId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      loadPosts()

      const post = posts.find((p) => p.id === postId)
      if (!post) return

      const shareUrl = `${window.location.origin}/forum?post=${postId}`
      const shareText = `Check out this post: ${post.title}`

      switch (platform) {
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
          break
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            "_blank",
          )
          break
        case "instagram":
          navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
          alert("Link copied to clipboard! You can now paste it on Instagram.")
          break
      }

      setShareDialogOpen(false)
    } catch (err) {
      console.error("Nazzel and Aviona Share error:", err)
    }
  }

  const handleCreatePost = async () => {
    setError("")

    if (!newPost.title || !newPost.content || !newPost.category) {
      setError("Title, content, and category are required")
      return
    }

    setSubmitting(true)

    try {
      const token = localStorage.getItem("authToken")

      const tags = newPost.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const response = await apiFetch("/forum/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newPost,
          tags,
          mood: newPost.mood || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create post")
        setSubmitting(false)
        return
      }

      setNewPost({ title: "", content: "", category: "", tags: "", mood: "" })
      setCreateDialogOpen(false)
      loadPosts()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await updateOnlineStatus(false)
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        await apiFetch("/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        console.error("Nazzel and Aviona Logout error:", err)
      }
      localStorage.removeItem("authToken")
    }
    setUser(null)
    router.push("/login")
  }

  const handleCreatePostClick = () => {
    if (!user) {
      router.push("/signup/account")
      return
    }
    if (user.role !== "member" && user.role !== "admin") {
      setError("You must be a verified member to post. Please complete email verification.")
      return
    }
    setCreateDialogOpen(true)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getReactionCount = (reactions: any[], emoji: string) => {
    return reactions.filter((r) => r.emoji === emoji).length
  }

  const hasUserReacted = (reactions: any[], emoji: string) => {
    return reactions.some((r) => r.userId === user?.id && r.emoji === emoji)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center romantic-gradient">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen romantic-gradient">
      <div className="container max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <EnhancedHeader />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Forum Discussions
                </h1>
                <p className="text-muted-foreground font-medium">
                  Two hearts, one forum — where our story continues forever
                </p>
              </div>
              {user ? (
                <div className="flex items-center gap-3">
                  <NotificationCenter />
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{user.username}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user.role || "guest"}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="font-semibold bg-transparent">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => router.push("/login")} className="font-semibold">
                    Login
                  </Button>
                  <Button size="sm" onClick={() => router.push("/signup/account")} className="font-semibold">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {!user && (
              <Alert className="mb-6 border-primary/50 bg-primary/5">
                <Lock className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  You can view discussions, but you need to{" "}
                  <Link href="/account/signup" className="text-primary hover:underline font-bold">
                    sign up
                  </Link>{" "}
                  and become a member to post and participate.
                </AlertDescription>
              </Alert>
            )}

            {user && user.role !== "member" && user.role !== "admin" && (
              <Alert className="mb-6 border-orange-500/50 bg-orange-500/5">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <AlertDescription className="font-medium text-orange-700">
                  Please verify your email to become a member and start posting in the forum.
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-6 space-y-4">
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 font-medium"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px] font-medium">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="most-liked">Most Liked</SelectItem>
                    <SelectItem value="most-discussed">Most Discussed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={coupleMode ? "default" : "outline"}
                  onClick={() => setCoupleMode(!coupleMode)}
                  className="font-semibold"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Couple Mode
                </Button>
              </div>

              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-card p-2">
                  <TabsTrigger value="all" className="font-semibold">
                    All Posts
                  </TabsTrigger>
                  {categories.map((cat) => {
                    const Icon = categoryIcons[cat as keyof typeof categoryIcons]
                    return (
                      <TabsTrigger key={cat} value={cat} className="font-semibold">
                        <Icon className="h-4 w-4 mr-2" />
                        {cat}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </Tabs>
            </div>

            <div className="mb-6">
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="font-semibold shadow-lg btn-glow" onClick={handleCreatePostClick}>
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif">Create New Post</DialogTitle>
                    <DialogDescription>Share your thoughts with the community</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="category" className="font-semibold">
                        Category
                      </Label>
                      <Select
                        value={newPost.category}
                        onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                      >
                        <SelectTrigger className="font-medium">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => {
                            const Icon = categoryIcons[cat as keyof typeof categoryIcons]
                            return (
                              <SelectItem key={cat} value={cat} className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {cat}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mood" className="font-semibold">
                        Mood (Optional)
                      </Label>
                      <Select value={newPost.mood} onValueChange={(value) => setNewPost({ ...newPost, mood: value })}>
                        <SelectTrigger className="font-medium">
                          <SelectValue placeholder="Select your mood" />
                        </SelectTrigger>
                        <SelectContent>
                          {moodOptions.map((mood) => (
                            <SelectItem key={mood} value={mood} className="font-medium">
                              <div className="flex items-center gap-2">
                                <Smile className="h-4 w-4" />
                                {mood}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-semibold">
                        Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter post title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="font-semibold">
                        Tags (Optional)
                      </Label>
                      <Input
                        id="tags"
                        placeholder="anniversary, promise, memory (comma-separated)"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        className="font-medium"
                      />
                      <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content" className="font-semibold">
                        Content
                      </Label>
                      <Textarea
                        id="content"
                        placeholder="Write your post content..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        rows={6}
                        className="font-medium resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={submitting}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost} disabled={submitting} className="font-semibold">
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          "Create Post"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {filteredPosts.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Users className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategory !== "all" || coupleMode
                      ? "Try adjusting your filters"
                      : "Be the first to start a discussion!"}
                  </p>
                  {user && !searchQuery && selectedCategory === "all" && !coupleMode && (
                    <Button onClick={() => setCreateDialogOpen(true)} className="font-semibold">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => {
                  const Icon = categoryIcons[post.category as keyof typeof categoryIcons]
                  const moodClass = post.mood ? moodColors[post.mood as keyof typeof moodColors] : ""

                  return (
                    <Card
                      key={post.id}
                      className={`shadow-lg border-2 hover:shadow-xl transition-all animate-fade-in-up ${moodClass}`}
                      onClick={() => trackPostView(post.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge variant="secondary" className="font-semibold">
                                <Icon className="h-3 w-3 mr-1" />
                                {post.category}
                              </Badge>
                              {post.mood && (
                                <Badge variant="outline" className="font-semibold">
                                  <Smile className="h-3 w-3 mr-1" />
                                  {post.mood}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                            </div>
                            <CardTitle className="text-2xl font-serif mb-2 hover:text-primary transition-colors cursor-pointer">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 font-medium">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-400 text-white text-xs font-bold">
                                  {post.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {post.username}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground mb-4 leading-relaxed font-medium">{post.content}</p>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-2 mb-4 flex-wrap">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="font-medium">
                                <Tag className="h-3 w-3 mr-1" />#{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 pb-3 border-b">
                          <div className="flex items-center gap-1 font-semibold">
                            <Eye className="h-4 w-4" />
                            {post.views || 0}
                          </div>
                          <div className="flex items-center gap-1 font-semibold">
                            <Users className="h-4 w-4" />
                            {post.seenBy?.length || 0}
                          </div>
                          <div className="flex items-center gap-1 font-semibold">
                            <MessageSquare className="h-4 w-4" />
                            {post.replies}
                          </div>
                          <div className="flex items-center gap-1 font-semibold">
                            <Share2 className="h-4 w-4" />
                            {post.shares || 0}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {reactionEmojis.map((emoji) => {
                            const count = getReactionCount(post.reactions || [], emoji)
                            const hasReacted = hasUserReacted(post.reactions || [], emoji)
                            return (
                              <button
                                key={emoji}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReaction(post.id, emoji)
                                }}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                                  hasReacted
                                    ? "bg-primary text-primary-foreground animate-pulse-heart"
                                    : "bg-secondary hover:bg-secondary/80"
                                }`}
                              >
                                <span>{emoji}</span>
                                {count > 0 && <span>{count}</span>}
                              </button>
                            )
                          })}
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSharePostId(post.id)
                              setShareDialogOpen(true)
                            }}
                            className="font-semibold"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                Please follow our{" "}
                <Link href="/legal/terms" className="text-primary hover:underline font-semibold">
                  community guidelines
                </Link>{" "}
                when posting
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg font-serif flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Online Users ({onlineUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {onlineUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No users online</p>
                ) : (
                  <div className="space-y-3">
                    {onlineUsers.map((onlineUser) => (
                      <div key={onlineUser.id} className="flex items-center gap-2 animate-slide-in-right">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-400 text-white text-xs font-bold">
                              {onlineUser.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse-heart" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{onlineUser.username}</p>
                          <p className="text-xs text-muted-foreground capitalize">{onlineUser.role || "member"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">Share Post</DialogTitle>
              <DialogDescription>Choose a platform to share this post</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <Button
                variant="outline"
                className="w-full justify-start font-semibold bg-transparent"
                onClick={() => sharePostId && handleShare(sharePostId, "facebook")}
              >
                <Facebook className="h-5 w-5 mr-3 text-blue-600" />
                Share on Facebook
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start font-semibold bg-transparent"
                onClick={() => sharePostId && handleShare(sharePostId, "twitter")}
              >
                <Twitter className="h-5 w-5 mr-3 text-sky-500" />
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start font-semibold bg-transparent"
                onClick={() => sharePostId && handleShare(sharePostId, "instagram")}
              >
                <Instagram className="h-5 w-5 mr-3 text-pink-600" />
                Copy for Instagram
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
