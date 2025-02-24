"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/AuthProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

const Navbar = () => {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          HealthCare Clinic
        </Link>
        <div className="space-x-4">
          <NavLink href="/" active={pathname === "/"}>
            Home
          </NavLink>
          <NavLink href="/book" active={pathname === "/book"}>
            Book Appointment
          </NavLink>
          <NavLink href="/doctors" active={pathname === "/doctors"}>
            Our Doctors
          </NavLink>
          <NavLink href="/contact" active={pathname === "/contact"}>
            Contact
          </NavLink>
          <NavLink href="/about" active={pathname === "/about"}>
            About Us
          </NavLink>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  <User className="mr-2 h-4 w-4" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavLink href="/login" active={pathname === "/login"}>
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}

const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) => (
  <Link href={href} className={`hover:underline ${active ? "font-bold" : ""}`}>
    {children}
  </Link>
)

export default Navbar

