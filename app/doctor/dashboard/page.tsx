"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

type Appointment = {
  id: string
  date: string
  time: string
  patientName: string
  status: string
  notes: string | null
}

export default function DoctorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user.role !== "DOCTOR") {
      router.push("/")
    } else {
      fetchAppointments()
    }
  }, [session, status, router])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/doctors/appointments")
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      } else {
        throw new Error("Failed to fetch appointments")
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast({
        title: "Error",
        description: "Failed to fetch appointments. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchAppointments()
        toast({
          title: "Success",
          description: "Appointment status updated successfully.",
        })
      } else {
        throw new Error("Failed to update appointment status")
      }
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleNotesSubmit = async () => {
    if (!selectedAppointment) return

    try {
      const response = await fetch(`/api/bookings/${selectedAppointment.id}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })
      if (response.ok) {
        fetchAppointments()
        setSelectedAppointment(null)
        setNotes("")
        toast({
          title: "Success",
          description: "Appointment notes updated successfully.",
        })
      } else {
        throw new Error("Failed to update appointment notes")
      }
    } catch (error) {
      console.error("Error updating appointment notes:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment notes. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleStatusChange(appointment.id, "COMPLETED")} className="mr-2">
                    Mark Completed
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Notes</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Notes for {appointment.patientName}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="notes" className="text-right">
                            Notes
                          </Label>
                          <Input
                            id="notes"
                            className="col-span-3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button onClick={handleNotesSubmit}>Save Notes</Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

