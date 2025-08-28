"use client"

import { useState } from "react"
import { Button } from "./../../ui/button"
import { Input } from "./../../ui/input"
import { Label } from "./../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../../ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./../../ui/dialog"
import { Heart } from "lucide-react"

export default function DonationRequest({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    bankId: "",
    units: "",
    blood_group: "",
    requestedDate: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch("http://localhost:1600/api/blood-bank-user/donation-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include session cookies
        body: JSON.stringify({
          bankId: formData.bankId,
          units: Number.parseInt(formData.units),
          blood_group: formData.blood_group,
          requestedDate: formData.requestedDate,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage("Donation request submitted successfully!")
        setFormData({ bankId: "", units: "", blood_group: "", requestedDate: "" })
        setTimeout(() => {
          onClose()
          setSubmitMessage("")
        }, 2000)
      } else {
        setSubmitMessage(data.message || "Failed to submit donation request")
      }
    } catch (error) {
      console.error("Error submitting donation:", error)
      setSubmitMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Schedule Blood Donation
          </DialogTitle>
          <DialogDescription>Fill out the form below to schedule your blood donation appointment.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankId">Blood Bank ID</Label>
            <Input
              id="bankId"
              placeholder="Enter blood bank ID"
              value={formData.bankId}
              onChange={(e) => handleInputChange("bankId", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blood_group">Blood Group</Label>
            <Select
              value={formData.blood_group}
              onValueChange={(value) => handleInputChange("blood_group", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="units">Units to Donate</Label>
            <Input
              id="units"
              type="number"
              min="1"
              max="4"
              placeholder="Number of units (1-4)"
              value={formData.units}
              onChange={(e) => handleInputChange("units", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedDate">Preferred Date</Label>
            <Input
              id="requestedDate"
              type="date"
              value={formData.requestedDate}
              onChange={(e) => handleInputChange("requestedDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {submitMessage && (
            <div
              className={`p-3 rounded-md text-sm ${
                submitMessage.includes("successfully")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Schedule Donation"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
