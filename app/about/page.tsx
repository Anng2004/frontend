import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutUs() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>About Clinical Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Clinical Booking is a state-of-the-art healthcare appointment booking platform designed to streamline the
            process of connecting patients with healthcare providers. Our mission is to make healthcare more accessible
            and efficient for everyone.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Founded in 2020, Clinical Booking has quickly grown to become a trusted platform for both patients and
            healthcare providers. We started with a simple idea: to make booking medical appointments as easy as booking
            a hotel room or a flight. Today, we serve thousands of patients and work with hundreds of healthcare
            providers across the country.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Our mission is to revolutionize the healthcare booking experience by providing a user-friendly, efficient,
            and reliable platform that connects patients with the right healthcare providers at the right time. We
            strive to improve healthcare accessibility, reduce wait times, and enhance the overall patient experience
            through innovative technology and exceptional customer service.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Dr. Jane Smith - Founder and CEO</h3>
              <p>
                Dr. Smith is a board-certified physician with over 15 years of experience in healthcare management. She
                founded Clinical Booking with the vision of transforming the healthcare booking experience.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">John Doe - Chief Technology Officer</h3>
              <p>
                John brings over a decade of experience in developing healthcare technology solutions. He leads our
                engineering team in building and maintaining our cutting-edge booking platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Sarah Johnson - Head of Customer Experience</h3>
              <p>
                Sarah ensures that both patients and healthcare providers have a seamless experience using our platform.
                Her team is dedicated to providing top-notch support and continuously improving our services based on
                user feedback.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Awards and Recognition</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>2023 Healthcare Technology Innovator of the Year</li>
            <li>2022 Best Patient Booking Platform - HealthTech Awards</li>
            <li>2021 Top 10 Healthcare Startups to Watch - TechCrunch</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

