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
    const specialties = await prisma.specialty.findMany()
    return NextResponse.json(specialties)
  } catch (error) {
    console.error("Error fetching specialties:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await req.json()

  try {
    const newSpecialty = await prisma.specialty.create({
      data: { name },
    })
    return NextResponse.json(newSpecialty)
  } catch (error) {
    console.error("Error creating specialty:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

