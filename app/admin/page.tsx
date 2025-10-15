"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Loader2,
  Shield,
  Users,
  MessageSquare,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Trash2,
  AlertCircle,
} from "lucide-react"
import type { User, ForumPost } from "@/lib/db/models"
import { CoupleSpinnerLogo } from "@/components/couple-spinner-logo"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (response.ok && data.user) {
          if (data.user.role !== "admin") {
            router.push("/forum")
            return
          }
          setUser(data.user)
          loadData()
        } else {
          router.push("/login")
        }
      } catch (err) {
        console.error("[v0] Fetch user error:", err)
        router.push("/login")
      }
    }

    fetchUser()
  }, [router])

  const loadData = () => {
    const savedPosts = localStorage.getItem("forumPosts")
    const savedUsers = localStorage.getItem("users")

    if (savedPosts) setPosts(JSON.parse(savedPosts))
    if (savedUsers) setUsers(JSON.parse(savedUsers))

    setLoading(false)
  }

  const handleDeletePost = (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((p) => p.id !== postId)
      setPosts(updatedPosts)
      localStorage.setItem("forumPosts", JSON.stringify(updatedPosts))
    }
  }

  const getTotalViews = () => posts.reduce((sum, post) => sum + (post.views || 0), 0)
  const getTotalReactions = () => posts.reduce((sum, post) => sum + (post.reactions?.length || 0), 0)
  const getTotalShares = () => posts.reduce((sum, post) => sum + (post.shares || 0), 0)
  const getActiveUsers = () => users.filter((u) => u.isOnline).length

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center romantic-gradient">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center romantic-gradient">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You do not have permission to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen romantic-gradient">
      <div className="container max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <CoupleSpinnerLogo />
        </div>

        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/forum")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-muted-foreground font-medium">Manage your community and view analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold font-serif">{users.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{getActiveUsers()} currently online</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold font-serif">{posts.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Across all categories</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold font-serif">{getTotalViews()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{getTotalReactions()} reactions</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold font-serif">{getTotalShares()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Total shares</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="posts" className="font-semibold">
              Post Moderation
            </TabsTrigger>
            <TabsTrigger value="users" className="font-semibold">
              User Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-semibold">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Recent Posts</CardTitle>
                <CardDescription>Moderate and manage forum posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {posts.slice(0, 10).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start justify-between p-4 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-primary/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="font-semibold">
                            {post.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                        </div>
                        <h4 className="font-semibold mb-1">{post.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">By {post.username}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.reactions?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="h-3 w-3" />
                            {post.shares || 0}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-serif">User List</CardTitle>
                <CardDescription>View and manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-primary/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          {u.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{u.username}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={u.isVerified ? "default" : "secondary"} className="font-semibold">
                          {u.role || "member"}
                        </Badge>
                        <Badge variant="outline" className="font-semibold">
                          {u.postCount || 0} posts
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Top Posts</CardTitle>
                  <CardDescription>Most viewed and engaged posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {posts
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 5)
                      .map((post, index) => (
                        <div key={post.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{post.title}</p>
                            <p className="text-xs text-muted-foreground">{post.views || 0} views</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Category Distribution</CardTitle>
                  <CardDescription>Posts by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Love Letters", "Memories", "Thoughts & Quotes", "Future Dreams", "Open Talks"].map(
                      (category) => {
                        const count = posts.filter((p) => p.category === category).length
                        const percentage = posts.length > 0 ? Math.round((count / posts.length) * 100) : 0
                        return (
                          <div key={category}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold">{category}</span>
                              <span className="text-sm text-muted-foreground">
                                {count} ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      },
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
