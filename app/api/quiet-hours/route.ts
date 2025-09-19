import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quietHours = await sql`
      SELECT * FROM quiet_hours 
      WHERE user_id = ${userId} 
      ORDER BY start_time ASC
    `

    return NextResponse.json(quietHours)
  } catch (error) {
    console.error("Error fetching quiet hours:", error)
    return NextResponse.json({ error: "Failed to fetch quiet hours" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, start_time, end_time, email } = await request.json()

    // Validate required fields
    if (!title || !start_time || !end_time || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate time range
    const startDate = new Date(start_time)
    const endDate = new Date(end_time)

    if (startDate >= endDate) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 })
    }

    // Check for overlapping blocks (handled by database trigger)
    const result = await sql`
      INSERT INTO quiet_hours (user_id, title, start_time, end_time, email)
      VALUES (${userId}, ${title}, ${start_time}, ${end_time}, ${email})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    console.error("Error creating quiet hour:", error)

    if (error.message?.includes("overlap")) {
      return NextResponse.json({ error: "This time slot overlaps with an existing quiet hour block" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create quiet hour" }, { status: 500 })
  }
}
