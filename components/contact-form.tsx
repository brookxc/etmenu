"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", message: "" })
    // Show success message
    alert("Message sent successfully!")
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-1">
          Name
        </label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email"
          className="w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-amber-800 mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        ></textarea>
      </div>
      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
        Send Message
      </Button>
    </form>
  )
}
