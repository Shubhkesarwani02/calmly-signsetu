interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailData) {
  // Using a simple email service - you can replace this with your preferred provider
  // For production, consider using services like Resend, SendGrid, or AWS SES

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Calmly SignsEtu <noreply@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Email service error: ${response.statusText} - ${errorData}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
}

export function generateReminderEmail(title: string, startTime: string, endTime: string) {
  const startDate = new Date(startTime)
  const endDate = new Date(endTime)

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }) + " IST"
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Calmly SignsEtu - Quiet Hours Reminder</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0891b2; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .time-block { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #84cc16; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔕 Calmly SignsEtu - Quiet Hours Reminder</h1>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>This is a friendly reminder that your quiet hours are starting in <strong>10 minutes</strong>.</p>
            
            <div class="time-block">
              <h3>${title}</h3>
              <p><strong>Start:</strong> ${formatTime(startDate)}</p>
              <p><strong>End:</strong> ${formatTime(endDate)}</p>
            </div>
            
            <p>Time to prepare for your focused work session. Consider:</p>
            <ul>
              <li>Silencing notifications on your devices</li>
              <li>Letting colleagues know you'll be unavailable</li>
              <li>Gathering any materials you'll need</li>
              <li>Finding a quiet, comfortable workspace</li>
            </ul>
            
            <p>Make the most of your quiet time!</p>
          </div>
          <div class="footer">
            <p>Sent by Calmly SignsEtu Reminder System</p>
          </div>
        </div>
      </body>
    </html>
  `
}
