"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

type Appointment = {
  id: string
  date: string
  time: string
  doctorName: string
  patientName: string
}

export default function AppointmentConfirmation() {
  const params = useParams()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true)
      try {
        // Simulating an API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock appointment data
        const mockAppointment: Appointment = {
          id: params.id as string,
          date: new Date().toISOString().split("T")[0], // Current date
          time: "10:00 AM",
          doctorName: "Dr. John Doe",
          patientName: "Jane Smith",
        }

        setAppointment(mockAppointment)
      } catch (error) {
        console.error("Error fetching appointment:", error)
        toast({
          title: "Error",
          description: "Failed to fetch appointment details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [params.id])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!appointment) {
    return <div>Appointment not found.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Appointment ID:</strong> {appointment.id}
        </div>
        <div>
          <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
        </div>
        <div>
          <strong>Time:</strong> {appointment.time}
        </div>
        <div>
          <strong>Doctor:</strong> {appointment.doctorName}
        </div>
        <div>
          <strong>Patient:</strong> {appointment.patientName}
        </div>
        <Button onClick={handlePrint}>Print Confirmation</Button>
      </CardContent>
    </Card>
  )
}

