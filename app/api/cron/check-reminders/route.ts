import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendEmail, generateReminderEmail } from "@/lib/email"

export async function GET() {
  try {
    // Find quiet hours that start in 10 minutes and haven't been notified yet
    const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000)
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)

    const upcomingQuietHours = await sql`
      SELECT * FROM quiet_hours 
      WHERE start_time BETWEEN ${fiveMinutesFromNow.toISOString()} AND ${tenMinutesFromNow.toISOString()}
      AND notification_sent = false
    `

    console.log(`[v0] Found ${upcomingQuietHours.length} quiet hours needing reminders`)

    for (const quietHour of upcomingQuietHours) {
      try {
        const emailHtml = generateReminderEmail(quietHour.title, quietHour.start_time, quietHour.end_time)

        await sendEmail({
          to: quietHour.email,
          subject: `Reminder: ${quietHour.title} starts in 10 minutes`,
          html: emailHtml,
        })

        // Mark as notified
        await sql`
          UPDATE quiet_hours 
          SET notification_sent = true 
          WHERE id = ${quietHour.id}
        `

        console.log(`[v0] Sent reminder for quiet hour: ${quietHour.title}`)
      } catch (emailError) {
        console.error(`[v0] Failed to send email for quiet hour ${quietHour.id}:`, emailError)
        // Continue with other reminders even if one fails
      }
    }

    return NextResponse.json({
      message: `Processed ${upcomingQuietHours.length} reminders`,
      count: upcomingQuietHours.length,
    })
  } catch (error) {
    console.error("[v0] Error in cron job:", error)
    return NextResponse.json({ error: "Failed to process reminders" }, { status: 500 })
  }
}

// Allow the cron job to be triggered manually for testing
export async function POST() {
  return GET()
}
