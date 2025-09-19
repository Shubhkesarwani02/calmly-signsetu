"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Plus, Trash2, Edit, LogOut } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"

interface QuietHour {
  id: number
  title: string
  start_time: string
  end_time: string
  email: string
  notification_sent: boolean
}

export function QuietHoursManager() {
  const { user } = useUser()
  const { toast } = useToast()
  const [quietHours, setQuietHours] = useState<QuietHour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
    email: user?.primaryEmailAddress?.emailAddress || "",
  })

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setFormData((prev) => ({ ...prev, email: user.primaryEmailAddress?.emailAddress || "" }))
    }
  }, [user])

  useEffect(() => {
    fetchQuietHours()
  }, [])

  const fetchQuietHours = async () => {
    try {
      const response = await fetch("/api/quiet-hours")
      if (response.ok) {
        const data = await response.json()
        setQuietHours(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch quiet hours",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/quiet-hours/${editingId}` : "/api/quiet-hours"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingId ? "Quiet hour updated" : "Quiet hour created",
        })
        setFormData({ title: "", start_time: "", end_time: "", email: user?.primaryEmailAddress?.emailAddress || "" })
        setIsCreating(false)
        setEditingId(null)
        fetchQuietHours()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save quiet hour",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quiet hour",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (quietHour: QuietHour) => {
    setFormData({
      title: quietHour.title,
      start_time: new Date(quietHour.start_time).toISOString().slice(0, 16),
      end_time: new Date(quietHour.end_time).toISOString().slice(0, 16),
      email: quietHour.email,
    })
    setEditingId(quietHour.id)
    setIsCreating(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/quiet-hours/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Quiet hour deleted",
        })
        fetchQuietHours()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete quiet hour",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quiet hour",
        variant: "destructive",
      })
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Quiet Hours Dashboard</h1>
        </div>
        <SignOutButton>
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </SignOutButton>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Quiet Hours</h2>
            <Button
              onClick={() => {
                setIsCreating(true)
                setEditingId(null)
                setFormData({
                  title: "",
                  start_time: "",
                  end_time: "",
                  email: user?.primaryEmailAddress?.emailAddress || "",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>

          <div className="space-y-4">
            {quietHours.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No quiet hours scheduled yet. Create your first one!
                  </p>
                </CardContent>
              </Card>
            ) : (
              quietHours.map((quietHour) => (
                <Card key={quietHour.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{quietHour.title}</CardTitle>
                        <CardDescription>
                          {formatDateTime(quietHour.start_time)} - {formatDateTime(quietHour.end_time)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(quietHour)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(quietHour.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Email: {quietHour.email}</p>
                    {quietHour.notification_sent && <p className="text-sm text-accent mt-1">✓ Reminder sent</p>}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {isCreating && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Quiet Hour" : "Create New Quiet Hour"}</h2>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Morning Focus Time"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email for Reminders</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">{editingId ? "Update" : "Create"} Quiet Hour</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false)
                        setEditingId(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
