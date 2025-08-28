"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Download,
  User,
  Activity,
  Building2,
  Phone,
  Navigation,
  CheckCircle,
  TrendingUp,
  Users,
  ArrowLeft,
  Plus,
  Loader2,
  Bell,
  Check,
  X,
  AlertCircle,
} from "lucide-react"

export default function UserPortal({ onBack }) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [bloodRequests, setBloodRequests] = useState([])
  const [donationRequests, setDonationRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState({
    bankId: "",
    blood_group: "",
    units: "",
    requestedDate: "",
  })

  const nearbyBanks = [
    { id: 1, name: "Main Blood Bank", distance: "0.5 miles", hours: "24/7", phone: "(555) 123-4567" },
    { id: 2, name: "Community Health Center", distance: "1.2 miles", hours: "8AM-6PM", phone: "(555) 234-5678" },
    { id: 3, name: "Regional Medical Center", distance: "2.1 miles", hours: "6AM-10PM", phone: "(555) 345-6789" },
  ]

  const fetchBloodRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:1600/api/blood-bank-user/blood-requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setBloodRequests(data.requests || [])
      } else {
        console.error("Failed to fetch blood requests")
        setBloodRequests([])
      }
    } catch (error) {
      console.error("Error fetching blood requests:", error)
      setBloodRequests([])
    } finally {
      setLoading(false)
    }
  }

  const fetchDonationRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:1600/api/blood-bank-user/donation-requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setDonationRequests(data.donations || [])
      } else {
        console.error("Failed to fetch donation requests")
        setDonationRequests([])
      }
    } catch (error) {
      console.error("Error fetching donation requests:", error)
      setDonationRequests([])
    } finally {
      setLoading(false)
    }
  }

  const submitBloodRequest = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch("http://localhost:1600/api/blood-bank-user/request-blood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bankId: requestForm.bankId,
          blood_group: requestForm.blood_group,
          units: Number.parseInt(requestForm.units),
          requestedDate: requestForm.requestedDate,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Blood request submitted successfully:", data)
        setShowRequestForm(false)
        setRequestForm({
          bankId: "",
          blood_group: "",
          units: "",
          requestedDate: "",
        })
        fetchBloodRequests()
      } else {
        const errorData = await response.json()
        console.error("Failed to submit blood request:", errorData.message)
        alert(errorData.message || "Failed to submit blood request")
      }
    } catch (error) {
      console.error("Error submitting blood request:", error)
      alert("Error submitting blood request")
    } finally {
      setLoading(false)
    }
  }

  const acceptBloodRequest = async (requestId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:1600/api/blood-bank-user/accept-request/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Blood request accepted:", data)
        fetchBloodRequests() // Refresh the list
        // Add notification
        setNotifications((prev) => [
          {
            id: Date.now(),
            type: "blood_request",
            message: "Blood request accepted successfully",
            timestamp: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ])
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to accept blood request")
      }
    } catch (error) {
      console.error("Error accepting blood request:", error)
      alert("Error accepting blood request")
    } finally {
      setLoading(false)
    }
  }

  const rejectBloodRequest = async (requestId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:1600/api/blood-bank-user/reject-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Blood request rejected:", data)
        fetchBloodRequests() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to reject blood request")
      }
    } catch (error) {
      console.error("Error rejecting blood request:", error)
      alert("Error rejecting blood request")
    } finally {
      setLoading(false)
    }
  }

  const acceptDonation = async (donationId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:1600/api/blood-bank-user/accept-donation/${donationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Donation accepted:", data)
        fetchDonationRequests() // Refresh the list
        // Add notification
        setNotifications((prev) => [
          {
            id: Date.now(),
            type: "donation",
            message: "Donation request accepted successfully",
            timestamp: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ])
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to accept donation")
      }
    } catch (error) {
      console.error("Error accepting donation:", error)
      alert("Error accepting donation")
    } finally {
      setLoading(false)
    }
  }

  const rejectDonation = async (donationId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:1600/api/blood-bank-user/reject-donation/${donationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Donation rejected:", data)
        fetchDonationRequests() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to reject donation")
      }
    } catch (error) {
      console.error("Error rejecting donation:", error)
      alert("Error rejecting donation")
    } finally {
      setLoading(false)
    }
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  useEffect(() => {
    fetchBloodRequests()
    fetchDonationRequests()
    // Mock notifications - in real app, fetch from API
    setNotifications([
      {
        id: 1,
        type: "blood_request",
        message: "Your blood request for O+ has been accepted",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: 2,
        type: "donation",
        message: "Thank you for your donation! Lives saved: 3",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: false,
      },
      {
        id: 3,
        type: "reminder",
        message: "You're eligible to donate again in 30 days",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        read: true,
      },
    ])
  }, [])

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold text-primary">{donationRequests.length}</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Requests</p>
                <p className="text-2xl font-bold text-secondary">{bloodRequests.length}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                <p className="text-2xl font-bold text-accent">{notifications.filter((n) => !n.read).length}</p>
              </div>
              <Bell className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                <p className="text-2xl font-bold text-destructive">O+</p>
              </div>
              <Activity className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donationRequests.slice(0, 3).map((donation) => (
                <div key={donation._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{donation.bank_id?.name || "Blood Bank"}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(donation.requested_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">{donation.status}</Badge>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 bg-transparent"
              onClick={() => setActiveSection("donations")}
            >
              View All Donations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    notification.read ? "bg-muted/50" : "bg-accent/10 border border-accent/20"
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p
                      className={`text-sm ${notification.read ? "text-muted-foreground" : "text-foreground font-medium"}`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 bg-transparent"
              onClick={() => setActiveSection("notifications")}
            >
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderDonations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Donation History</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading donations...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {donationRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No donation requests found.</p>
              </CardContent>
            </Card>
          ) : (
            donationRequests.map((donation) => (
              <Card key={donation._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{donation.bank_id?.name || "Blood Bank"}</h3>
                        <p className="text-sm text-muted-foreground">Blood Type: {donation.blood_group}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(donation.requested_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Units: {donation.units_donated}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            donation.status === "accepted"
                              ? "default"
                              : donation.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {donation.status}
                        </Badge>
                        {donation.status === "pending" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acceptDonation(donation._id)}
                              disabled={loading}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectDonation(donation._id)}
                              disabled={loading}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Lives saved: {donation.units_donated * 3}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Blood Requests</h2>
        <Button onClick={() => setShowRequestForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {showRequestForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Blood Request</CardTitle>
            <CardDescription>Fill out the form to request blood from nearby banks</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitBloodRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankId">Blood Bank ID</Label>
                  <Input
                    id="bankId"
                    value={requestForm.bankId}
                    onChange={(e) => setRequestForm({ ...requestForm, bankId: e.target.value })}
                    placeholder="Enter blood bank ID"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="blood_group">Blood Type</Label>
                  <Select
                    value={requestForm.blood_group}
                    onValueChange={(value) => setRequestForm({ ...requestForm, blood_group: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
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
                <div>
                  <Label htmlFor="units">Units Required</Label>
                  <Input
                    id="units"
                    type="number"
                    min="1"
                    value={requestForm.units}
                    onChange={(e) => setRequestForm({ ...requestForm, units: e.target.value })}
                    placeholder="Number of units"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="requestedDate">Required Date</Label>
                  <Input
                    id="requestedDate"
                    type="date"
                    value={requestForm.requestedDate}
                    onChange={(e) => setRequestForm({ ...requestForm, requestedDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Submit Request
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && !showRequestForm ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading blood requests...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {bloodRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No blood requests found. Click "New Request" to submit your first request.
                </p>
              </CardContent>
            </Card>
          ) : (
            bloodRequests.map((request) => (
              <Card key={request._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.bank_id?.name || "Blood Bank"}</h3>
                        <p className="text-sm text-muted-foreground">
                          Blood Type: {request.blood_group} • Units: {request.units_requested}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(request.requested_date).toLocaleDateString()}
                          </span>
                        </div>
                        {request.bank_id?.location && (
                          <p className="text-sm text-muted-foreground mt-1">Location: {request.bank_id.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            request.status === "accepted"
                              ? "default"
                              : request.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {request.status}
                        </Badge>
                        {request.status === "pending" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acceptBloodRequest(request._id)}
                              disabled={loading}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectBloodRequest(request._id)}
                              disabled={loading}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Requested: {new Date(request.createdAt || request.requested_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button variant="outline" onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}>
          Mark All as Read
        </Button>
      </div>

      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No notifications found.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                notification.read ? "opacity-75" : "border-accent/20"
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                      notification.read ? "bg-muted-foreground" : "bg-accent"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {notification.type === "blood_request" && <CheckCircle className="h-4 w-4 text-secondary" />}
                      {notification.type === "donation" && <Heart className="h-4 w-4 text-primary" />}
                      {notification.type === "reminder" && <AlertCircle className="h-4 w-4 text-accent" />}
                      <Badge variant="outline" className="text-xs">
                        {notification.type.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <p className={`${notification.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )

  const renderNearby = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nearby Blood Banks</h2>

      <div className="grid gap-4">
        {nearbyBanks.map((bank) => (
          <Card key={bank.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{bank.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{bank.distance}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{bank.hours}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm">
                    <Navigation className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Manage your account details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <p className="text-muted-foreground">John Doe</p>
            </div>
            <div>
              <label className="text-sm font-medium">Blood Type</label>
              <p className="text-muted-foreground">O+</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-muted-foreground">john.doe@email.com</p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <p className="text-muted-foreground">(555) 123-4567</p>
            </div>
          </div>
          <Button>Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Blood Bank Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={() => setActiveSection("notifications")}>
                <Bell className="h-5 w-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 space-y-2">
            <Button
              variant={activeSection === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("dashboard")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeSection === "donations" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("donations")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Donation History
            </Button>
            <Button
              variant={activeSection === "requests" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("requests")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Blood Requests
            </Button>
            <Button
              variant={activeSection === "notifications" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("notifications")}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notifications.filter((n) => !n.read).length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {notifications.filter((n) => !n.read).length}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeSection === "nearby" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("nearby")}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Nearby Banks
            </Button>
            <Button
              variant={activeSection === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === "dashboard" && renderDashboard()}
            {activeSection === "donations" && renderDonations()}
            {activeSection === "requests" && renderRequests()}
            {activeSection === "notifications" && renderNotifications()}
            {activeSection === "nearby" && renderNearby()}
            {activeSection === "profile" && renderProfile()}
          </div>
        </div>
      </div>
    </div>
  )
}
