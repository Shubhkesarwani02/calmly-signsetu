"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Clock, Plus, Trash2, Edit, LogOut, Calendar, Mail, CheckCircle, AlertCircle, Home } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { formatISTDateTime, utcToLocalDateTime } from "@/lib/timezone"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMediaQuery } from "@/hooks/use-media-query"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import Link from "next/link"

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
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [quietHours, setQuietHours] = useState<QuietHour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{open: boolean, id: number, title: string}>({
    open: false,
    id: 0,
    title: ""
  })
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
      } else {
        throw new Error("Failed to fetch data")
      }
    } catch (error) {
      toast({
        title: "Loading Error ⚠️",
        description: "Failed to load your quiet hours. Please refresh the page.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const startTime = new Date(formData.start_time)
    const endTime = new Date(formData.end_time)
    const now = new Date()
    
    if (startTime <= now) {
      toast({
        title: "Invalid Time ⏰",
        description: "Start time must be in the future.",
        variant: "destructive",
        duration: 4000,
      })
      return
    }
    
    if (endTime <= startTime) {
      toast({
        title: "Invalid Time ⏰",
        description: "End time must be after start time.",
        variant: "destructive",
        duration: 4000,
      })
      return
    }
    
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60) // minutes
    if (duration < 15) {
      toast({
        title: "Duration Too Short ⏱️",
        description: "Quiet hours must be at least 15 minutes long.",
        variant: "destructive",
        duration: 4000,
      })
      return
    }
    
    setIsSubmitting(true)

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
          title: "Success! ✅",
          description: editingId ? "Quiet hour updated successfully" : "New quiet hour created successfully",
          duration: 3000,
        })
        setFormData({ title: "", start_time: "", end_time: "", email: user?.primaryEmailAddress?.emailAddress || "" })
        setIsCreating(false)
        setEditingId(null)
        fetchQuietHours()
      } else {
        const error = await response.json()
        toast({
          title: "Error ❌",
          description: error.error || "Failed to save quiet hour",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      toast({
        title: "Network Error ⚠️",
        description: "Failed to save quiet hour. Please check your connection.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (quietHour: QuietHour) => {
    setFormData({
      title: quietHour.title,
      start_time: utcToLocalDateTime(quietHour.start_time),
      end_time: utcToLocalDateTime(quietHour.end_time),
      email: quietHour.email,
    })
    setEditingId(quietHour.id)
    setIsCreating(true)
  }

  const confirmDelete = (id: number, title: string) => {
    setDeleteConfirmation({ open: true, id, title })
  }

  const handleDelete = async () => {
    const id = deleteConfirmation.id
    setIsDeleting(id)
    setDeleteConfirmation({ open: false, id: 0, title: "" })
    
    try {
      const response = await fetch(`/api/quiet-hours/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success! ✅",
          description: "Quiet hour deleted successfully",
          duration: 3000,
        })
        fetchQuietHours()
      } else {
        toast({
          title: "Error ❌",
          description: "Failed to delete quiet hour",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      toast({
        title: "Network Error ⚠️",
        description: "Failed to delete quiet hour. Please check your connection.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDateTime = (dateString: string) => {
    return formatISTDateTime(new Date(dateString))
  }

  const openCreateForm = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      title: "",
      start_time: "",
      end_time: "",
      email: user?.primaryEmailAddress?.emailAddress || "",
    })
  }

  const closeForm = () => {
    setIsCreating(false)
    setEditingId(null)
  }

  // Form component that can be reused
  const QuietHourForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Session Title
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Morning Deep Work"
          required
          className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors duration-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time" className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Start Time (IST)
          </Label>
          <Input
            id="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            required
            className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors duration-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time" className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            End Time (IST)
          </Label>
          <Input
            id="end_time"
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            required
            className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors duration-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          Reminder Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="h-12 border-0 bg-muted/50 focus:bg-background transition-colors duration-300"
        />
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="h-12 gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              {editingId ? "Updating..." : "Creating..."}
            </>
          ) : editingId ? (
            <>
              <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Update Session
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Create Session
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={closeForm}
          className="h-12 bg-background/50 backdrop-blur-sm hover:bg-background transition-all duration-300"
        >
          Cancel
        </Button>
      </div>
    </form>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-4">
            <Clock className="h-12 w-12 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading Dashboard</h3>
          <p className="text-muted-foreground">Preparing your quiet hours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-tight">Dashboard</h1>
                  <p className="text-xs text-muted-foreground">Manage your quiet hours</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <SignOutButton>
                <Button variant="outline" size="sm" className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-300">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-in">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {user?.firstName || 'User'}! 👋
            </h2>
            <p className="text-muted-foreground">
              {quietHours.length === 0 
                ? "Ready to create your first quiet hour session?" 
                : `You have ${quietHours.length} quiet hour${quietHours.length === 1 ? '' : 's'} scheduled.`
              }
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Quiet Hours List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary" />
                  Your Quiet Hours
                </h3>
                <p className="text-muted-foreground mt-1">Manage and track your focus sessions</p>
              </div>
              
              {/* Mobile Create Button */}
              {!isDesktop ? (
                <Sheet open={isCreating} onOpenChange={setIsCreating}>
                  <SheetTrigger asChild>
                    <Button
                      onClick={openCreateForm}
                      className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                      Add New
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh]">
                    <SheetHeader className="text-left mb-6">
                      <SheetTitle className="text-xl flex items-center gap-2">
                        {editingId ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                        {editingId ? "Edit Quiet Hour" : "Create New Session"}
                      </SheetTitle>
                      <SheetDescription>
                        {editingId ? "Update your focus session details" : "Schedule your next productive time block"}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="px-1">
                      <QuietHourForm />
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button
                  onClick={openCreateForm}
                  className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  Add New Session
                </Button>
              )}
            </div>

            {/* Quiet Hours Cards */}
            <div className="space-y-4">
              {quietHours.length === 0 ? (
                <Card className="border-dashed border-2 border-border/50 bg-gradient-to-br from-muted/20 to-muted/10 animate-slide-in">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-4">
                      <Clock className="h-12 w-12 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">No Quiet Hours Yet</h4>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Create your first quiet hour session to start boosting your productivity with automated reminders.
                    </p>
                    {!isDesktop ? (
                      <Sheet open={isCreating} onOpenChange={setIsCreating}>
                        <SheetTrigger asChild>
                          <Button
                            onClick={openCreateForm}
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Create First Session
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[80vh]">
                          <SheetHeader className="text-left mb-6">
                            <SheetTitle className="text-xl flex items-center gap-2">
                              <Plus className="h-5 w-5 text-primary" />
                              Create New Session
                            </SheetTitle>
                            <SheetDescription>
                              Schedule your next productive time block
                            </SheetDescription>
                          </SheetHeader>
                          <div className="px-1">
                            <QuietHourForm />
                          </div>
                        </SheetContent>
                      </Sheet>
                    ) : (
                      <Button
                        onClick={openCreateForm}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create First Session
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                quietHours.map((quietHour, index) => (
                  <Card 
                    key={quietHour.id} 
                    className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-card to-card/50 animate-slide-in" 
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-lg font-semibold">{quietHour.title}</CardTitle>
                            {quietHour.notification_sent && (
                              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                                <CheckCircle className="h-3 w-3" />
                                Sent
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <CardDescription className="flex items-center gap-2 text-base">
                              <Calendar className="h-4 w-4" />
                              {formatDateTime(quietHour.start_time)} - {formatDateTime(quietHour.end_time)}
                            </CardDescription>
                            <CardDescription className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {quietHour.email}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(quietHour)}
                            className="hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => confirmDelete(quietHour.id, quietHour.title)}
                            disabled={isDeleting === quietHour.id}
                            className="hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all duration-300 disabled:opacity-50"
                          >
                            {isDeleting === quietHour.id ? (
                              <Clock className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {/* Status indicator */}
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {new Date(quietHour.start_time) > new Date() ? (
                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              Upcoming
                            </div>
                          ) : new Date(quietHour.end_time) > new Date() ? (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                              <Clock className="h-4 w-4" />
                              Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                              <CheckCircle className="h-4 w-4" />
                              Completed
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Form (Desktop Only) */}
          <div className="lg:col-span-1">
            {isCreating && isDesktop && (
              <div className="animate-slide-in-right">
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-card to-card/50 sticky top-24">
                  <CardHeader className="text-center pb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 w-fit mx-auto mb-4">
                      {editingId ? <Edit className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
                    </div>
                    <CardTitle className="text-xl">
                      {editingId ? "Edit Quiet Hour" : "Create New Session"}
                    </CardTitle>
                    <CardDescription>
                      {editingId ? "Update your focus session details" : "Schedule your next productive time block"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <QuietHourForm />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Stats Card */}
            {(!isCreating || !isDesktop) && (
              <div className="space-y-6 animate-slide-in" style={{animationDelay: '0.3s'}}>
                <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg flex items-center justify-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-primary">{quietHours.length}</div>
                        <div className="text-sm text-muted-foreground">Total Sessions</div>
                      </div>
                      <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-green-600">
                          {quietHours.filter(qh => qh.notification_sent).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Reminders Sent</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={openCreateForm}
                      variant="outline"
                      className="w-full gap-2 h-12 bg-background/50 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-300"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Session
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        open={deleteConfirmation.open}
        onOpenChange={(open) => setDeleteConfirmation(prev => ({ ...prev, open }))}
        onConfirm={handleDelete}
        title={deleteConfirmation.title}
        isDeleting={isDeleting !== null}
      />
    </div>
  )
}
