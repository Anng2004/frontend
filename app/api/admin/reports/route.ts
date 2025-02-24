import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const totalUsers = await prisma.user.count()
    const totalDoctors = await prisma.user.count({ where: { role: "DOCTOR" } })
    const totalPatients = await prisma.user.count({ where: { role: "PATIENT" } })
    const totalBookings = await prisma.booking.count()
    const completedBookings = await prisma.booking.count({ where: { status: "COMPLETED" } })

    const report = {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalBookings,
      completedBookings,
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

