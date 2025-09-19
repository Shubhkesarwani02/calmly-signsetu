import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, start_time, end_time, email } = await request.json()
    const id = Number.parseInt(params.id)

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

    // Update the quiet hour (overlap check handled by database trigger)
    const result = await sql`
      UPDATE quiet_hours 
      SET title = ${title}, start_time = ${start_time}, end_time = ${end_time}, 
          email = ${email}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Quiet hour not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error updating quiet hour:", error)

    if (error.message?.includes("overlap")) {
      return NextResponse.json({ error: "This time slot overlaps with an existing quiet hour block" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update quiet hour" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    const result = await sql`
      DELETE FROM quiet_hours 
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Quiet hour not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Quiet hour deleted successfully" })
  } catch (error) {
    console.error("Error deleting quiet hour:", error)
    return NextResponse.json({ error: "Failed to delete quiet hour" }, { status: 500 })
  }
}
