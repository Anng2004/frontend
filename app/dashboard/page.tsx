"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/AuthProvider"

type Appointment = {
  id: string
  date: string
  time: string
  doctorName: string
  specialty: string
  status: string
  notes: string | null
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    if (user) {
      fetchAppointments()
    }
  }, [user])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/patients/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
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

  const handleCancel = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        setAppointments(appointments.filter((apt) => apt.id !== id))
        toast({
          title: "Success",
          description: "Appointment cancelled successfully.",
        })
      } else {
        throw new Error("Failed to cancel appointment")
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReschedule = (id: string) => {
    router.push(`/book?reschedule=${id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push("/book")} className="mb-4">
          Book New Appointment
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>{appointment.specialty}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  {appointment.status === "BOOKED" && (
                    <>
                      <Button onClick={() => handleReschedule(appointment.id)} className="mr-2">
                        Reschedule
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive">Cancel</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancel Appointment</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to cancel this appointment? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <Button onClick={() => handleCancel(appointment.id)} variant="destructive">
                            Confirm Cancellation
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  {appointment.status === "COMPLETED" && appointment.notes && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Notes</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Appointment Notes</DialogTitle>
                        </DialogHeader>
                        <p>{appointment.notes}</p>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

