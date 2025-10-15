"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Lock, ImageIcon, Loader2, AlertCircle, Trash2 } from "lucide-react"
import type { User, GalleryAlbum } from "@/lib/db/models"
import { CoupleSpinnerLogo } from "@/components/couple-spinner-logo"

export default function GalleryPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    description: "",
    isPrivate: false,
    password: "",
  })

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
          setUser(data.user)
          loadAlbums()
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

  const loadAlbums = () => {
    const savedAlbums = localStorage.getItem("galleryAlbums")
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums))
    }
    setLoading(false)
  }

  const handleCreateAlbum = () => {
    if (!newAlbum.title || !user) return

    const album: GalleryAlbum = {
      id: Date.now().toString(),
      title: newAlbum.title,
      description: newAlbum.description || undefined,
      isPrivate: newAlbum.isPrivate,
      password: newAlbum.isPrivate ? newAlbum.password : undefined,
      photos: [],
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedAlbums = [...albums, album]
    setAlbums(updatedAlbums)
    localStorage.setItem("galleryAlbums", JSON.stringify(updatedAlbums))

    setNewAlbum({ title: "", description: "", isPrivate: false, password: "" })
    setCreateDialogOpen(false)
  }

  const handleAlbumClick = (album: GalleryAlbum) => {
    if (album.isPrivate && album.password) {
      setSelectedAlbum(album)
      setPasswordDialogOpen(true)
    } else {
      router.push(`/gallery/${album.id}`)
    }
  }

  const handlePasswordSubmit = () => {
    if (!selectedAlbum) return

    if (passwordInput === selectedAlbum.password) {
      setPasswordDialogOpen(false)
      setPasswordInput("")
      setPasswordError("")
      router.push(`/gallery/${selectedAlbum.id}`)
    } else {
      setPasswordError("Incorrect password")
    }
  }

  const handleDeleteAlbum = (albumId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this album?")) {
      const updatedAlbums = albums.filter((a) => a.id !== albumId)
      setAlbums(updatedAlbums)
      localStorage.setItem("galleryAlbums", JSON.stringify(updatedAlbums))
    }
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
          <CoupleSpinnerLogo />
        </div>

        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/forum")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Love Gallery
            </h1>
            <p className="text-muted-foreground font-medium">Our precious memories together</p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="font-semibold shadow-lg btn-glow">
                <Plus className="h-5 w-5 mr-2" />
                Create Album
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">Create New Album</DialogTitle>
                <DialogDescription>Organize your photos into beautiful albums</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold">
                    Album Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Our First Date"
                    value={newAlbum.title}
                    onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                    className="font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-semibold">
                    Description (Optional)
                  </Label>
                  <Input
                    id="description"
                    placeholder="Add a description..."
                    value={newAlbum.description}
                    onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                    className="font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={newAlbum.isPrivate}
                    onChange={(e) => setNewAlbum({ ...newAlbum, isPrivate: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isPrivate" className="font-semibold cursor-pointer">
                    Password Protected
                  </Label>
                </div>

                {newAlbum.isPrivate && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-semibold">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={newAlbum.password}
                      onChange={(e) => setNewAlbum({ ...newAlbum, password: e.target.value })}
                      className="font-medium"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAlbum} disabled={!newAlbum.title} className="font-semibold">
                    Create Album
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {albums.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No albums yet</h3>
              <p className="text-muted-foreground mb-4">Create your first album to start collecting memories</p>
              <Button onClick={() => setCreateDialogOpen(true)} className="font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Create First Album
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Card
                key={album.id}
                className="shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer animate-fade-in-up group"
                onClick={() => handleAlbumClick(album)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">
                        {album.title}
                      </CardTitle>
                      {album.description && (
                        <CardDescription className="font-medium">{album.description}</CardDescription>
                      )}
                    </div>
                    {album.isPrivate && <Lock className="h-5 w-5 text-primary flex-shrink-0" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30 rounded-lg flex items-center justify-center mb-4">
                    {album.coverImage ? (
                      <img
                        src={album.coverImage || "/placeholder.svg"}
                        alt={album.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-primary/50" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">
                      {album.photos.length} photos
                    </Badge>
                    {user?.role === "admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteAlbum(album.id, e)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">Password Protected Album</DialogTitle>
              <DialogDescription>Enter the password to access this private album</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {passwordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="albumPassword" className="font-semibold">
                  Password
                </Label>
                <Input
                  id="albumPassword"
                  type="password"
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value)
                    setPasswordError("")
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordSubmit()
                    }
                  }}
                  className="font-medium"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPasswordDialogOpen(false)
                    setPasswordInput("")
                    setPasswordError("")
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handlePasswordSubmit} className="font-semibold">
                  Unlock
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
