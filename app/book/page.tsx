"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/AuthProvider"

type Specialty = {
  id: string
  name: string
}

type Doctor = {
  id: string
  name: string
  specialty: string
  bio: string
  photoUrl: string
}

type TimeSlot = {
  id: string
  time: string
}

export default function BookAppointment() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [patientName, setPatientName] = useState(user?.name || "")
  const [patientEmail, setPatientEmail] = useState(user?.email || "")
  const [patientPhone, setPatientPhone] = useState("")

  useEffect(() => {
    fetchSpecialties()
  }, [])

  useEffect(() => {
    if (selectedSpecialty) {
      fetchDoctors(selectedSpecialty)
    }
  }, [selectedSpecialty])

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchTimeSlots(selectedDoctor, selectedDate)
    }
  }, [selectedDoctor, selectedDate])

  const fetchSpecialties = async () => {
    try {
      const response = await fetch("/api/specialties")
      const data = await response.json()
      setSpecialties(data)
    } catch (error) {
      console.error("Error fetching specialties:", error)
      toast({
        title: "Error",
        description: "Failed to fetch specialties. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchDoctors = async (specialty: string) => {
    try {
      const response = await fetch(`/api/doctors?specialty=${specialty}`)
      const data = await response.json()
      setDoctors(data)
    } catch (error) {
      console.error("Error fetching doctors:", error)
      toast({
        title: "Error",
        description: "Failed to fetch doctors. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchTimeSlots = async (doctorId: string, date: Date) => {
    try {
      const response = await fetch(`/api/slots?doctor=${doctorId}&date=${date.toISOString().split("T")[0]}`)
      const data = await response.json()
      setTimeSlots(data)
    } catch (error) {
      console.error("Error fetching time slots:", error)
      toast({
        title: "Error",
        description: "Failed to fetch time slots. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please complete all steps before booking.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          date: selectedDate.toISOString(),
          timeSlotId: selectedTimeSlot,
          patientName,
          patientEmail,
          patientPhone,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/confirmation/${data.bookingId}`)
      } else {
        throw new Error("Failed to book appointment")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <Label htmlFor="specialty">Select a Specialty</Label>
            <Select
              onValueChange={(value) => {
                setSelectedSpecialty(value)
                setStep(2)
              }}
              value={selectedSpecialty}
            >
              <SelectTrigger id="specialty">
                <SelectValue placeholder="Select a specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 2:
        return (
          <div>
            <Label>Choose a Doctor</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={`cursor-pointer ${selectedDoctor === doctor.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => {
                    setSelectedDoctor(doctor.id)
                    setStep(3)
                  }}
                >
                  <CardHeader>
                    <CardTitle>{doctor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={doctor.photoUrl || "/placeholder.svg"}
                      alt={doctor.name}
                      className="w-full h-48 object-cover mb-2"
                    />
                    <p>{doctor.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <Label>Select a Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date)
                setStep(4)
              }}
              className="rounded-md border"
              disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            />
          </div>
        )
      case 4:
        return (
          <div>
            <Label htmlFor="timeslot">Select a Time Slot</Label>
            <Select
              onValueChange={(value) => {
                setSelectedTimeSlot(value)
                setStep(5)
              }}
              value={selectedTimeSlot}
            >
              <SelectTrigger id="timeslot">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.id} value={slot.id}>
                    {slot.time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientName">Name</Label>
              <Input id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="patientEmail">Email</Label>
              <Input
                id="patientEmail"
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="patientPhone">Phone</Label>
              <Input
                id="patientPhone"
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                required
              />
            </div>
            <Button onClick={handleBookAppointment} className="w-full">
              Book Appointment
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  )
}

