"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Smile, ArrowLeft, Lock } from "lucide-react"
import type { PrivateMessage, User } from "@/lib/db/models"
import Link from "next/link"

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<PrivateMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    // Fetch user data from API
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (response.ok && data.user) {
          setUser(data.user)
          const otherUsername = data.user.username.toLowerCase() === "nazzel" ? "avionna" : "nazzel"
          fetchOtherUser(otherUsername)
          loadMessages(data.user.id)
        } else {
          router.push("/login")
        }
      } catch (err) {
        console.error("[v0] Fetch user error:", err)
        router.push("/login")
      }
    }

    fetchUser()

    // Poll for new messages and typing status
    const interval = setInterval(() => {
      if (user) {
        loadMessages(user.id)
        checkTypingStatus()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchOtherUser = async (username: string) => {
    // In a real app, this would fetch from the API
    // For now, we'll create a mock user
    setOtherUser({
      id: username === "nazzel" ? "nazzel-id" : "avionna-id",
      username: username.charAt(0).toUpperCase() + username.slice(1),
      email: `${username}@example.com`,
      password: "",
      dateOfBirth: "",
      isVerified: true,
      role: "member",
      failedLoginAttempts: 0,
      agreedToTerms: true,
      postCount: 0,
      isOnline: true,
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  const loadMessages = async (userId: string) => {
    if (!otherUser) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/messages?userId=${otherUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setMessages(data.messages || [])

      // Mark unread messages as read
      data.messages?.forEach((msg: PrivateMessage) => {
        if (msg.receiverId === userId && !msg.isRead) {
          markAsRead(msg.id)
        }
      })
    } catch (err) {
      console.error("[v0] Load messages error:", err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem("authToken")
      await fetch(`/api/messages/${messageId}/read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (err) {
      console.error("[v0] Mark as read error:", err)
    }
  }

  const checkTypingStatus = async () => {
    if (!otherUser) return

    try {
      const response = await fetch(`/api/messages/typing?userId=${otherUser.id}`)
      const data = await response.json()
      if (data.typingStatus) {
        const timeSinceUpdate = Date.now() - new Date(data.typingStatus.lastUpdate).getTime()
        setOtherUserTyping(data.typingStatus.isTyping && timeSinceUpdate < 5000)
      }
    } catch (err) {
      console.error("[v0] Check typing status error:", err)
    }
  }

  const updateTypingStatus = async (typing: boolean) => {
    try {
      const token = localStorage.getItem("authToken")
      await fetch("/api/messages/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isTyping: typing }),
      })
    } catch (err) {
      console.error("[v0] Update typing status error:", err)
    }
  }

  const handleInputChange = (value: string) => {
    setNewMessage(value)

    if (!isTyping && value.length > 0) {
      setIsTyping(true)
      updateTypingStatus(true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      updateTypingStatus(false)
    }, 3000)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !otherUser || !user) return

    setSending(true)
    setIsTyping(false)
    updateTypingStatus(false)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: otherUser.id,
          content: newMessage,
          type: "text",
        }),
      })

      if (response.ok) {
        setNewMessage("")
        loadMessages(user.id)
      }
    } catch (err) {
      console.error("[v0] Send message error:", err)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center romantic-gradient">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center romantic-gradient">
        <Alert className="max-w-md">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Please{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              log in
            </Link>{" "}
            to access messages.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen romantic-gradient">
      <div className="container max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/forum")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>
        </div>

        <Card className="shadow-xl border-0 h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="border-b bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white font-bold">
                    {otherUser?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-serif">{otherUser?.username}</CardTitle>
                  {otherUserTyping && (
                    <p className="text-sm text-muted-foreground italic animate-pulse">Currently typing...</p>
                  )}
                  {!otherUserTyping && otherUser?.isOnline && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse-heart" />
                      <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="font-semibold">
                Private Chat
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Smile className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground">Start your private conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const isSender = message.senderId === user.id
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isSender ? "justify-end" : "justify-start"} animate-fade-in-up`}
                    >
                      <div className={`max-w-[70%] ${isSender ? "order-2" : "order-1"}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            isSender
                              ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white"
                              : "bg-card border-2 border-primary/20"
                          }`}
                        >
                          {message.type === "image" && message.mediaUrl && (
                            <img
                              src={message.mediaUrl || "/placeholder.svg"}
                              alt="Shared image"
                              className="rounded-lg mb-2 max-w-full"
                            />
                          )}
                          <p className="text-sm leading-relaxed break-words">{message.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 ${isSender ? "text-right" : "text-left"}`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          <div className="border-t p-4 bg-card">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1 font-medium"
                disabled={sending}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="btn-glow"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">End-to-end encrypted private conversation</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
