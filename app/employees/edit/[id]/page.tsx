"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {number} from "zod";

interface Employee {
    id: number,
    firstName: string
    lastName: string
    mail: string
    password?: string
}

export default function EditEmployeePage() {
    const router = useRouter()
    const params = useParams()
    const { id } = useParams(); // Récupère l'identifiant depuis l'URL
    const numericId = Number(id); // Conversion explicite en number
    const { toast } = useToast()
    const [formData, setFormData] = useState<Employee>({
        id:numericId,
        firstName: "",
        lastName: "",
        mail: "",
        password: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        // Check authentication
        // const token = localStorage.getItem("authToken")
        // if (!token) {
        //     router.push("/login")
        //     return
        // }

        const employeeId = params.id
        if (employeeId) {
            fetchEmployee(Number(employeeId))
        }
    }, [params.id, router])
    const idEmployee = Number(params.id)

    const fetchEmployee = async (id: number) => {
        try {
            // Use the specific API endpoint to fetch a single employee by ID
            const response = await fetch(`http://localhost:9000/employee/${id}`)
            if (!response.ok) {
                throw new Error("Failed to fetch employee")
            }

            const employee = await response.json()


            setFormData({
                id:numericId,
                firstName: employee.firstName,
                lastName: employee.lastName,
                mail: employee.mail,
                password: employee.password,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load employee data",
                variant: "destructive",
            })
            router.push("/employees")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = await fetch(`http://localhost:9000/employee/update/${numericId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error("Failed to update employee")
            }

            toast({
                title: "Success",
                description: "Employee updated successfully",
            })
            router.push("/employees")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update employee",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="container mx-auto py-8 px-4 text-center">Loading employee data...</div>
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/employees")} className="mr-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle>Edit Employee</CardTitle>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mail">Email</Label>
                            <Input id="mail" name="mail" type="email" value={formData.mail} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password }
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
