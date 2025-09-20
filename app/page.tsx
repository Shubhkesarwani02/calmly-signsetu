import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail, Shield, ArrowRight, Calendar, Zap, Users } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Calmly SignSetu</h1>
              <p className="text-xs text-muted-foreground">Quiet Hours Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="default" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant="default" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-slide-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <Zap className="h-4 w-4" />
            Focus & Productivity Tool
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Master Your
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Focus Time</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Transform your productivity with intelligent quiet hours management. 
            Schedule focused work sessions and never miss a productivity window with automated email reminders.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <SignInButton>
                <Button size="lg" className="text-lg px-8 py-6 gap-3 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 gap-3 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                  Open Dashboard
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </SignedIn>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/50 backdrop-blur-sm">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-card to-card/50 animate-slide-in">
            <CardHeader className="text-center p-8">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-primary/10 w-fit group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Smart Scheduling</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Create intelligent time blocks for your focused work sessions with flexible scheduling and conflict prevention
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-card to-card/50 animate-slide-in" style={{animationDelay: '0.1s'}}>
            <CardHeader className="text-center p-8">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-primary/10 w-fit group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Email Reminders</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Receive timely notifications 10 minutes before your quiet hours begin, ensuring you never miss a focus session
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-card to-card/50 animate-slide-in" style={{animationDelay: '0.2s'}}>
            <CardHeader className="text-center p-8">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-primary/10 w-fit group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Conflict Protection</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Advanced scheduling system prevents overlapping sessions and ensures optimal time management
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 mb-16 border border-primary/20 animate-slide-in">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99%</div>
              <div className="text-muted-foreground">Reliability Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10min</div>
              <div className="text-muted-foreground">Advance Notice</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Automated Service</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-in">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to boost your productivity?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their work habits with Calmly SignSetu
          </p>
          <SignedOut>
            <SignInButton>
              <Button size="lg" className="text-lg px-8 py-6 gap-3 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                Start Your Journey
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 gap-3 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                Go to Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </SignedIn>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Calmly SignSetu</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 Calmly SignSetu. Crafted for productivity enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  )
}
