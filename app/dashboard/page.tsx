import { requireAuth } from "@/lib/auth"
import { QuietHoursManager } from "@/components/quiet-hours-manager"

export default async function DashboardPage() {
  await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <QuietHoursManager />
    </div>
  )
}
