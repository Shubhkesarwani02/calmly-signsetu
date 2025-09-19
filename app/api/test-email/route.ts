import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sendEmail, generateReminderEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email address required" }, { status: 400 })
    }

    // Send a test email
    const testStartTime = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const testEndTime = new Date(Date.now() + 70 * 60 * 1000).toISOString()

    const emailHtml = generateReminderEmail("Test Quiet Hour", testStartTime, testEndTime)

    await sendEmail({
      to: email,
      subject: "Test: Quiet Hours Reminder",
      html: emailHtml,
    })

    return NextResponse.json({ message: "Test email sent successfully" })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
}
