"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import type { ChangeEvent, CSSProperties, MouseEvent } from "react"
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
  Filter,
  TrendingUp,
  Activity,
  Crown,
  Dot,
  Clock3,
  Bookmark,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ForumPostWithAuthor, User } from "@/lib/db/models"
import { EnhancedHeader } from "@/components/enhanced-header"
import { apiFetch } from "@/lib/utils"
import { NotificationCenter } from "@/components/notification-center"
import { buildThemeCssVariables, getForumTheme } from "@/config/forum-theme"
import { siteConfig } from "@/config/site"

declare const process: { env: Record<string, string | undefined> }

const { couple, forum, site } = siteConfig
const normalizeName = (value?: string) => (value ?? "").toLowerCase().replace(/\s+/g, "")
const normalizedCoupleNames = [normalizeName(couple?.primaryName), normalizeName(couple?.partnerName)].filter(
  (value) => value.length > 0,
)
const coupleDisplayName =
  couple?.combinedName ||
  [couple?.primaryName, couple?.partnerName].filter((value) => (value ?? "").trim().length > 0).join(" & ") ||
  site.name
const forumFeaturedLineTemplate = forum?.featuredLine ?? "Featured space for {{coupleName}}"
const forumFeaturedLine = forumFeaturedLineTemplate.replace("{{coupleName}}", coupleDisplayName)
const forumLogPrefix = coupleDisplayName

const categories = ["Love Letters", "Memories", "Thoughts & Quotes", "Future Dreams", "Open Talks"] as const
type ForumCategory = (typeof categories)[number]

const categoryIcons: Record<ForumCategory, LucideIcon> = {
  "Love Letters": Heart,
  Memories: Camera,
  "Thoughts & Quotes": MessageCircle,
  "Future Dreams": Sparkles,
  "Open Talks": Globe,
}

const moodOptions = ["Happy", "Hopeful", "Sentimental", "Thoughtful", "Excited"] as const
type ForumMood = (typeof moodOptions)[number]

const moodColors: Record<ForumMood, string> = {
  Happy: "bg-amber-50 border-amber-200",
  Hopeful: "bg-sky-50 border-sky-200",
  Sentimental: "bg-rose-50 border-rose-200",
  Thoughtful: "bg-violet-50 border-violet-200",
  Excited: "bg-orange-50 border-orange-200",
}

const reactionEmojis = ["❤️", "👍", "😂", "😮", "😢", "🔥"] as const
type ReactionEmoji = (typeof reactionEmojis)[number]

type ReactionRecord = ForumPostWithAuthor["reactions"][number]

type CategoryFilter = "all" | ForumCategory
type SortOption = "newest" | "most-liked" | "most-discussed"
type SharePlatform = "facebook" | "twitter" | "instagram"

interface ForumMeta {
  totalPosts: number
  totalReplies: number
  totalReactions: number
  totalViews: number
}

const defaultStats: ForumMeta = {
  totalPosts: 0,
  totalReplies: 0,
  totalReactions: 0,
  totalViews: 0,
}

const themeKey = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_FORUM_THEME : undefined
const themeTokens = getForumTheme(themeKey)
const themeCssVariables = buildThemeCssVariables(themeTokens)

const RELATIVE_TIME_DIVISIONS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
]

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

function formatRelativeTimeValue(dateInput?: Date | string): string {
  if (!dateInput) return "Unknown"
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (Number.isNaN(date.getTime())) return "Unknown"

  let duration = (date.getTime() - Date.now()) / 1000

  for (const division of RELATIVE_TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }

  return relativeTimeFormatter.format(Math.round(duration), "year")
}

interface DraftPost {
  title: string
  content: string
  category: string
  tags: string
  mood: string
}

interface ForumPostsResponse {
  posts?: ForumPostWithAuthor[]
  meta?: ForumMeta
}

interface OnlineUsersResponse {
  users?: User[]
}

export default function ForumPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<ForumPostWithAuthor[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ForumPostWithAuthor[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [stats, setStats] = useState<ForumMeta>(defaultStats)
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newPost, setNewPost] = useState<DraftPost>({
    title: "",
    content: "",
    category: "",
    tags: "",
    mood: "",
  })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [sharePostId, setSharePostId] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [coupleMode, setCoupleMode] = useState<boolean>(false)

  const cssVariables = useMemo<CSSProperties>(() => themeCssVariables as CSSProperties, [])

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
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

            const handleBeforeUnload = () => updateOnlineStatus(false)

            window.addEventListener("beforeunload", handleBeforeUnload)

            return () => {
              clearInterval(interval)
              window.removeEventListener("beforeunload", handleBeforeUnload)
            }
          }
        } catch (err) {
          console.error(`${forumLogPrefix} Fetch user error:`, err)
        }
      }

      fetchUser()
    }

    loadPosts()
    loadOnlineUsers()
  }, [])

  useEffect(() => {
    let filtered: ForumPostWithAuthor[] = [...posts]

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query)
        const contentMatch = post.content.toLowerCase().includes(query)
        const tagMatch = post.tags?.some((tag) => tag.toLowerCase().includes(query))
        const authorMatch = post.author?.username?.toLowerCase().includes(query)
        return titleMatch || contentMatch || tagMatch || authorMatch
      })
    }

    if (coupleMode) {
      filtered = filtered.filter((post) => {
        const username = post.author?.username || post.username
        const normalized = normalizeName(username)
        return normalizedCoupleNames.includes(normalized)
      })
    }

    filtered.sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime()
      const bDate = new Date(b.createdAt).getTime()

      switch (sortBy) {
        case "most-liked":
          return (b.reactions?.length || 0) - (a.reactions?.length || 0)
        case "most-discussed":
          return (b.replies || 0) - (a.replies || 0)
        default:
          return bDate - aDate
      }
    })

    setFilteredPosts(filtered)
  }, [posts, selectedCategory, searchQuery, sortBy, coupleMode])

  const loadPosts = useCallback(async () => {
    try {
      const response = await apiFetch("/forum/posts")
      const data = (await response.json()) as ForumPostsResponse
      const normalized: ForumPostWithAuthor[] = (data.posts ?? []).map((post) => {
        const createdAt = new Date(post.createdAt)
        const updatedAt = new Date(post.updatedAt)
        const authorSummary: ForumAuthorSummary = post.author
          ? {
              ...post.author,
              lastSeen: new Date(post.author.lastSeen),
            }
          : {
              id: post.userId,
              username: post.username,
              role: "guest",
              isOnline: false,
              lastSeen: updatedAt,
            }

        const reactions: ReactionRecord[] = (post.reactions ?? []).map((reaction) => ({
          ...reaction,
          createdAt: new Date(reaction.createdAt),
        }))

        return {
          ...post,
          createdAt,
          updatedAt,
          author: authorSummary,
          reactions,
        }
      })

      setPosts(normalized)
      setStats(data.meta ?? { ...defaultStats, totalPosts: normalized.length })
    } catch (err) {
      console.error(`${forumLogPrefix} Load posts error:`, err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadOnlineUsers = useCallback(async () => {
    try {
      const response = await apiFetch("/users/online")
      const data = (await response.json()) as OnlineUsersResponse
      setOnlineUsers(data.users ?? [])
    } catch (err) {
      console.error(`${forumLogPrefix} Load online users error:`, err)
    }
  }, [])

  const updateOnlineStatus = useCallback(async (isOnline: boolean) => {
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
      console.error(`${forumLogPrefix} Update online status error:`, err)
    }
  }, [loadOnlineUsers])

  const trackPostView = useCallback(
    async (postId: string) => {
      try {
        await apiFetch(`/forum/posts/${postId}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id }),
        })
        loadPosts()
      } catch (err) {
        console.error(`${forumLogPrefix} Track view error:`, err)
      }
    },
    [loadPosts, user?.id],
  )

  const handleReaction = useCallback(
    async (postId: string, emoji: string) => {
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
        console.error(`${forumLogPrefix} Reaction error:`, err)
      }
    },
    [loadPosts, router, user],
  )

  const handleShare = useCallback(
    async (postId: string, platform: SharePlatform) => {
      try {
        await apiFetch(`/forum/posts/${postId}/share`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        loadPosts()

        const post = posts.find((candidate) => candidate.id === postId)
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
            await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
            alert("Link copied to clipboard! You can now paste it on Instagram.")
            break
          default:
            break
        }

        setShareDialogOpen(false)
      } catch (err) {
        console.error(`${forumLogPrefix} Share error:`, err)
      }
    },
    [loadPosts, posts],
  )

  const handleCreatePost = useCallback(async () => {
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
  }, [loadPosts, newPost])

  const handleLogout = useCallback(async () => {
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
        console.error(`${forumLogPrefix} Logout error:`, err)
      }
      localStorage.removeItem("authToken")
    }
    setUser(null)
    router.push("/login")
  }, [router, updateOnlineStatus])

  const handleCreatePostClick = useCallback(() => {
    if (!user) {
      router.push("/signup/account")
      return
    }
    if (user.role !== "member" && user.role !== "admin") {
      setError("You must be a verified member to post. Please complete email verification.")
      return
    }
    setCreateDialogOpen(true)
  }, [router, user])

  const formatDate = useCallback((date: Date | string) => {
    const target = new Date(date)
    return target.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }, [])

  const formatRelativeTime = useCallback((date?: Date | string) => formatRelativeTimeValue(date), [])

  const getReactionCount = useCallback((reactions: ReactionRecord[], emoji: ReactionEmoji) => {
    return reactions.filter((reaction) => reaction.emoji === emoji).length
  }, [])

  const hasUserReacted = useCallback(
    (reactions: ReactionRecord[], emoji: ReactionEmoji) => {
      return reactions.some((reaction) => reaction.userId === user?.id && reaction.emoji === emoji)
    },
    [user?.id],
  )

  const trendingTags = useMemo(() => {
    const counts = new Map<string, number>()
    posts.forEach((post) => {
      post.tags?.forEach((tag: string) => {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      })
    })
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }, [posts])

  const highlightPosts = useMemo(() => filteredPosts.slice(0, 3), [filteredPosts])

  const offlineAuthors = useMemo(() => {
    const unique = new Map<string, { username: string; lastSeen?: Date }>()
    posts.forEach((post) => {
      const author = post.author
      if (!author || author.isOnline) return
      if (!unique.has(author.id)) {
        unique.set(author.id, {
          username: author.username,
          lastSeen: author.lastSeen,
        })
      }
    })
    return Array.from(unique.values()).slice(0, 10)
  }, [posts])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--forum-surface-muted)]" style={cssVariables}>
        <Loader2 className="h-8 w-8 animate-spin text-[var(--forum-primary)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--forum-surface-muted)]" style={cssVariables}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-80" style={{ background: themeTokens.heroGradient }} />
        <div className="relative">
          <div className="container max-w-7xl mx-auto px-4 pt-8">
            <EnhancedHeader />
          </div>
          <section className="container max-w-7xl mx-auto px-4 pb-12">
            <div className="mt-10 grid gap-6 lg:grid-cols-12">
              <Card className="lg:col-span-8 border-0 bg-[var(--forum-surface)]/90 shadow-xl backdrop-blur-md">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-[var(--forum-foreground-muted)]">
                        <Crown className="h-4 w-4 text-[var(--forum-secondary)]" />
                        {forumFeaturedLine}
                      </div>
                      <h1 className="mt-3 text-3xl md:text-4xl font-serif text-[var(--forum-foreground)]">
                        A professional forum crafted for your love story
                      </h1>
                      <p className="mt-3 max-w-2xl text-base text-[var(--forum-foreground-muted)]">
                        Capture milestones, build conversations, and celebrate your journey with a live community hub.
                        Everything here is synced with MongoDB, so your memories stay safe and always online.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                      <Button size="lg" className="justify-center shadow-lg" onClick={handleCreatePostClick}>
                        <Plus className="mr-2 h-5 w-5" />
                        Start a new conversation
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-center border-[var(--forum-border)] text-[var(--forum-foreground)]"
                        onClick={() => document.getElementById("forum-feed")?.scrollIntoView({ behavior: "smooth" })}
                      >
                        Explore discussions
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        label: "Published Posts",
                        value: stats.totalPosts,
                        icon: MessageSquare,
                      },
                      {
                        label: "Community Replies",
                        value: stats.totalReplies,
                        icon: Activity,
                      },
                      {
                        label: "Reactions Shared",
                        value: stats.totalReactions,
                        icon: Heart,
                      },
                      {
                        label: "Total Views",
                        value: stats.totalViews,
                        icon: Eye,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-[var(--forum-border)] bg-[var(--forum-surface-accent)] p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-[var(--forum-secondary)]/10 p-2 text-[var(--forum-secondary)]">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-[var(--forum-foreground-muted)]">
                              {item.label}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-[var(--forum-foreground)]">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-4 border-0 bg-[var(--forum-sidebar-bg)] text-[var(--forum-foreground)]">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-5 w-5 text-[var(--forum-accent)]" />
                    Member Presence
                  </CardTitle>
                  <CardDescription className="text-[var(--forum-foreground-muted)]">
                    Realtime status synced with MongoDB — see who’s online and who recently dropped by.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-sm font-medium text-[var(--forum-foreground-muted)]">
                      <span>Online right now</span>
                      <span>{onlineUsers.length}</span>
                    </div>
                    <div className="mt-3 space-y-3">
                      {onlineUsers.length === 0 ? (
                        <p className="text-sm text-[var(--forum-foreground-muted)]">No one is online just yet.</p>
                      ) : (
                        onlineUsers.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback className="bg-[var(--forum-secondary)] text-white font-bold">
                                    {item.username.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[var(--forum-foreground)]">{item.username}</p>
                                <p className="text-xs text-[var(--forum-foreground-muted)] capitalize">
                                  {item.role || "member"}
                                </p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-600">
                              <Dot className="h-3 w-3" />
                              Online
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {offlineAuthors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-[var(--forum-foreground-muted)]">Recently active</p>
                      <div className="mt-3 space-y-2">
                        {offlineAuthors.map((item) => (
                          <div key={item.username} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-gray-400" />
                              <span className="font-medium text-[var(--forum-foreground)]">{item.username}</span>
                            </div>
                            <span className="text-[var(--forum-foreground-muted)]">{formatRelativeTime(item.lastSeen)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      <main id="forum-feed" className="container max-w-7xl mx-auto px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <Card className="border border-[var(--forum-border)] bg-[var(--forum-surface)] shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--forum-foreground-muted)]" />
                    <Input
                      placeholder="Search by title, content, tags, or author"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="h-12 rounded-xl border-[var(--forum-border)] bg-[var(--forum-surface-muted)] pl-11 font-medium"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[200px] h-12 rounded-xl border-[var(--forum-border)] bg-[var(--forum-surface-muted)] font-medium">
                      <SortAsc className="h-4 w-4 mr-2 text-[var(--forum-secondary)]" />
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="most-liked">Most reactions</SelectItem>
                      <SelectItem value="most-discussed">Most discussed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant={coupleMode ? "default" : "outline"}
                    onClick={() => setCoupleMode((prev) => !prev)}
                    className="h-12 rounded-xl border-[var(--forum-border)] font-semibold"
                  >
                    <Heart className="h-4 w-4 mr-2" /> Couple mode
                  </Button>
                </div>

                <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as CategoryFilter)} className="w-full">
                  <TabsList className="flex w-full flex-wrap justify-start gap-2 rounded-2xl bg-[var(--forum-surface-muted)] p-2">
                    <TabsTrigger
                      value="all"
                      className="rounded-xl px-4 py-2 text-sm font-semibold transition"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      All posts
                    </TabsTrigger>
                    {categories.map((cat) => {
                      const Icon = categoryIcons[cat]
                      return (
                        <TabsTrigger
                          key={cat}
                          value={cat}
                          className="rounded-xl px-4 py-2 text-sm font-semibold transition"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {cat}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {highlightPosts.length > 0 && (
              <div className="grid gap-4 md:grid-cols-3">
                {highlightPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group border border-[var(--forum-border)] bg-[var(--forum-surface-accent)] shadow-sm transition hover:shadow-lg"
                  >
                    <CardContent className="p-5 space-y-4">
                      <Badge className="w-fit bg-[var(--forum-secondary)]/20 text-[var(--forum-secondary)]">
                        Spotlight
                      </Badge>
                      <p className="line-clamp-3 text-sm text-[var(--forum-foreground-muted)]">{post.content}</p>
                      <Button
                        variant="ghost"
                        className="p-0 text-sm font-semibold text-[var(--forum-secondary)] hover:text-[var(--forum-secondary)]"
                        onClick={() => trackPostView(post.id)}
                      >
                        Continue reading
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <Card className="border border-dashed border-[var(--forum-border)] bg-[var(--forum-surface)] text-center">
                <CardContent className="space-y-4 py-16">
                  <Users className="mx-auto h-12 w-12 text-[var(--forum-foreground-muted)]" />
                  <h3 className="text-xl font-semibold text-[var(--forum-foreground)]">No posts found</h3>
                  <p className="text-sm text-[var(--forum-foreground-muted)]">
                    {searchQuery || selectedCategory !== "all" || coupleMode
                      ? "Try refining your filters or search keywords."
                      : "Start the very first discussion for today."}
                  </p>
                  {user && !searchQuery && selectedCategory === "all" && !coupleMode && (
                    <Button onClick={() => setCreateDialogOpen(true)} className="font-semibold">
                      <Plus className="mr-2 h-4 w-4" />
                      Launch the first thread
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-5">
                {filteredPosts.map((post) => {
                  const Icon = categoryIcons[post.category]
                  const moodColorClass = post.mood ? moodColors[post.mood as ForumMood] ?? "bg-[var(--forum-surface)] border-[var(--forum-border)]" : "bg-[var(--forum-surface)] border-[var(--forum-border)]"

                  const author = post.author ?? {
                    username: post.username,
                    role: "guest",
                    isOnline: false,
                    lastSeen: post.createdAt,
                  }

                  return (
                    <Card
                      key={post.id}
                      className={`group border-2 ${moodColorClass} overflow-hidden shadow-sm transition hover:shadow-lg`}
                      onClick={() => trackPostView(post.id)}
                    >
                      <CardContent className="p-6 space-y-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--forum-foreground-muted)]">
                              <Badge className="bg-[var(--forum-secondary)]/15 text-[var(--forum-secondary)]">
                                <Icon className="mr-2 h-3 w-3" /> {post.category}
                              </Badge>
                              {post.mood && (
                                <Badge variant="outline" className="border-dashed text-[var(--forum-foreground-muted)]">
                                  <Smile className="mr-2 h-3 w-3" />
                                  {post.mood}
                                </Badge>
                              )}
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <h2 className="text-2xl font-serif text-[var(--forum-foreground)] transition group-hover:text-[var(--forum-secondary)]">
                              {post.title}
                            </h2>
                          </div>
                          <div className="flex items-center gap-3 rounded-full border border-[var(--forum-border)] bg-white/60 px-4 py-2 backdrop-blur">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-[var(--forum-primary)]/20 text-[var(--forum-primary)] font-semibold">
                                {(author.username || post.username).charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="leading-tight">
                              <p className="text-sm font-semibold text-[var(--forum-foreground)]">{author.username || post.username}</p>
                              <p className="text-xs text-[var(--forum-foreground-muted)] capitalize">
                                {author.role || "member"}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-semibold">
                              <span
                                className={`h-2 w-2 rounded-full ${author.isOnline ? "bg-emerald-500" : "bg-slate-400"}`}
                              />
                              <span className="text-[var(--forum-foreground-muted)]">
                                {author.isOnline ? "Online" : formatRelativeTime(author.lastSeen)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="line-clamp-4 text-[var(--forum-foreground)]/90 leading-relaxed">{post.content}</p>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="rounded-full border-[var(--forum-border)] bg-white/60 text-[var(--forum-foreground-muted)]"
                              >
                                <Tag className="mr-1 h-3 w-3" />#{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--forum-foreground-muted)]">
                            <span className="flex items-center gap-2">
                              <Eye className="h-4 w-4" /> {post.views || 0} views
                            </span>
                            <span className="flex items-center gap-2">
                              <Users className="h-4 w-4" /> {post.seenBy?.length || 0} readers
                            </span>
                            <span className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" /> {post.replies || 0} replies
                            </span>
                            <span className="flex items-center gap-2">
                              <Share2 className="h-4 w-4" /> {post.shares || 0} shares
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {reactionEmojis.map((emoji) => {
                              const reactions = post.reactions ?? []
                              const count = getReactionCount(reactions, emoji)
                              const reacted = hasUserReacted(reactions, emoji)
                              return (
                                <button
                                  key={emoji}
                                  onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                    event.stopPropagation()
                                    handleReaction(post.id, emoji)
                                  }}
                                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold transition ${
                                    reacted
                                      ? "bg-[var(--forum-primary)] text-white shadow"
                                      : "bg-white/70 text-[var(--forum-foreground)] hover:bg-white"
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  {count > 0 && <span>{count}</span>}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-[var(--forum-border)]"
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                              event.stopPropagation()
                              setSharePostId(post.id)
                              setShareDialogOpen(true)
                            }}
                          >
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-[var(--forum-foreground-muted)] hover:text-[var(--forum-secondary)]"
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                              event.preventDefault()
                              event.stopPropagation()
                            }}
                          >
                            <Bookmark className="mr-2 h-4 w-4" /> Save to library
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-[var(--forum-foreground-muted)] hover:text-[var(--forum-secondary)]"
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                              event.preventDefault()
                              event.stopPropagation()
                            }}
                          >
                            <Clock3 className="mr-2 h-4 w-4" /> View timeline
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            <div className="rounded-3xl border border-[var(--forum-border)] bg-[var(--forum-surface-muted)] p-6 text-center">
              <p className="text-sm text-[var(--forum-foreground-muted)]">
                Please follow our {" "}
                <Link href="/legal/terms" className="font-semibold text-[var(--forum-secondary)] hover:underline">
                  community guidelines
                </Link>{" "}
                when posting.
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="border border-[var(--forum-border)] bg-[var(--forum-surface)] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 text-[var(--forum-secondary)]" /> Trending tags
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {trendingTags.length === 0 ? (
                  <p className="text-sm text-[var(--forum-foreground-muted)]">No tags yet — start tagging your posts!</p>
                ) : (
                  trendingTags.map(([tag, count]) => (
                    <Badge
                      key={tag}
                      className="rounded-full border-[var(--forum-border)] bg-white/70 text-[var(--forum-foreground)]"
                    >
                      #{tag} · {count}
                    </Badge>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border border-[var(--forum-border)] bg-[var(--forum-surface)] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-5 w-5 text-[var(--forum-primary)]" /> Activity checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-[var(--forum-foreground-muted)]">
                <div className="flex items-start gap-3">
                  <Dot className="mt-1 h-5 w-5 text-[var(--forum-secondary)]" />
                  <div>
                    <p className="font-semibold text-[var(--forum-foreground)]">Stay verified</p>
                    <p>Verified members can publish instantly. Complete your email verification to unlock full access.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Dot className="mt-1 h-5 w-5 text-[var(--forum-secondary)]" />
                  <div>
                    <p className="font-semibold text-[var(--forum-foreground)]">Curate your memories</p>
                    <p>Tag posts with themes like promises, milestones, or celebrations for quick discovery later.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Dot className="mt-1 h-5 w-5 text-[var(--forum-secondary)]" />
                  <div>
                    <p className="font-semibold text-[var(--forum-foreground)]">Celebrate together</p>
                    <p>Use reactions and replies to keep the conversation alive. Everything is logged securely in MongoDB.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[var(--forum-border)] bg-[var(--forum-surface)] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-[var(--forum-primary)]" /> Team spotlight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--forum-foreground-muted)]">
                <div className="rounded-2xl border border-[var(--forum-border)] bg-white/70 p-4">
                  <p className="text-[var(--forum-foreground)] font-semibold">Professional layout</p>
                  <p>Crafted for a premium forum experience with themed visuals controlled from `.env`.</p>
                </div>
                <div className="rounded-2xl border border-[var(--forum-border)] bg-white/70 p-4">
                  <p className="text-[var(--forum-foreground)] font-semibold">MongoDB connectivity</p>
                  <p>Online presence, authors, and stats are driven directly from your live database.</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-[var(--forum-foreground)]">Create new post</DialogTitle>
            <DialogDescription className="text-[var(--forum-foreground-muted)]">
              Share your next chapter with the community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category" className="font-semibold">
                  Category
                </Label>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                  <SelectTrigger className="font-medium">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => {
                      const Icon = categoryIcons[cat]
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
                  Mood (optional)
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Give your story a headline"
                value={newPost.title}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPost({ ...newPost, title: event.target.value })}
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="font-semibold">
                Tags (optional)
              </Label>
              <Input
                id="tags"
                placeholder="anniversary, promise, milestone"
                value={newPost.tags}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPost({ ...newPost, tags: event.target.value })}
                className="font-medium"
              />
              <p className="text-xs text-[var(--forum-foreground-muted)]">Separate tags with commas to boost discovery.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="font-semibold">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Share your message..."
                value={newPost.content}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setNewPost({ ...newPost, content: event.target.value })}
                rows={6}
                className="font-medium"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
                  </>
                ) : (
                  "Publish"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-[var(--forum-foreground)]">Share post</DialogTitle>
            <DialogDescription className="text-[var(--forum-foreground-muted)]">
              Broadcast this story to your favorite platforms.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start border-[var(--forum-border)] bg-white/80 font-semibold"
              onClick={() => sharePostId && handleShare(sharePostId, "facebook")}
            >
              <Facebook className="mr-3 h-5 w-5 text-blue-600" /> Share on Facebook
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-[var(--forum-border)] bg-white/80 font-semibold"
              onClick={() => sharePostId && handleShare(sharePostId, "twitter")}
            >
              <Twitter className="mr-3 h-5 w-5 text-sky-500" /> Share on Twitter
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-[var(--forum-border)] bg-white/80 font-semibold"
              onClick={() => sharePostId && handleShare(sharePostId, "instagram")}
            >
              <Instagram className="mr-3 h-5 w-5 text-pink-500" /> Copy for Instagram
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {!user && (
        <div className="fixed bottom-6 left-1/2 z-30 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
          <Card className="border border-[var(--forum-border)] bg-[var(--forum-surface)] shadow-xl">
            <CardContent className="flex flex-col items-center gap-4 p-5 text-center md:flex-row md:justify-between md:text-left">
              <div>
                <p className="text-sm font-semibold text-[var(--forum-foreground)]">Create a free account</p>
                <p className="text-xs text-[var(--forum-foreground-muted)]">
                  Join the conversation, track replies, and sync your posts securely with MongoDB.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/signup/account")}>Sign up</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
