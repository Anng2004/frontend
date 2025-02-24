import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, Brain, Baby, Bone, Search } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to HealthCare Clinic</h1>
        <p className="text-xl mb-6">Your trusted healthcare provider</p>
        <Link href="/book">
          <Button size="lg">Book Appointment</Button>
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Specialties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpecialtyCard icon={<Heart />} title="Cardiology" description="Expert care for your heart" />
          <SpecialtyCard icon={<Brain />} title="Neurology" description="Specialized brain and nervous system care" />
          <SpecialtyCard icon={<Baby />} title="Pediatrics" description="Compassionate care for children" />
          <SpecialtyCard icon={<Bone />} title="Orthopedics" description="Specialized bone and joint treatment" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Find a Doctor</h2>
        <div className="flex items-center space-x-2">
          <Input type="text" placeholder="Search by name or specialty" className="flex-grow" />
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </section>
    </div>
  )
}

const SpecialtyCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>{description}</p>
    </CardContent>
  </Card>
)

