import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Calmly SignsEtu</h1>
          </div>
          <SignedIn>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Calmly SignsEtu - Quiet Hours Management</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Manage your focused work time with automated email reminders. Never miss your scheduled quiet hours again with Calmly SignsEtu.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Schedule Blocks</CardTitle>
              <CardDescription>Create time blocks for your quiet hours with flexible scheduling</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Email Reminders</CardTitle>
              <CardDescription>Get notified 10 minutes before your quiet hours begin</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>No Overlaps</CardTitle>
              <CardDescription>Smart scheduling prevents conflicting time blocks</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <SignedOut>
            <SignInButton>
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Open Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>
      </main>
    </div>
  )
}
