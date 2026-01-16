"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { categorieService } from "@/services/categorieService"
import { useToast } from "@/hooks/use-toast"

export default function NewCategoryPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [nom, setNom] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0]
            if (file.type.startsWith("image/")) {
                setImage(file)
            }
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0])
        }
    }

    const removeImage = () => {
        setImage(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!image) {
            toast({
                title: "Error",
                description: "Please select an image for the category",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            await categorieService.postCategorie(nom, image)
            toast({
                title: "Success",
                description: "Category created successfully",
            })
            router.push("/admin/categories")
        } catch (error) {
            console.error("Error creating category:", error)
            toast({
                title: "Error",
                description: "Failed to create category",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Category</h1>
                    <p className="text-muted-foreground mt-1">Add a new product category</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="nom">Category Name</Label>
                                <Input
                                    id="nom"
                                    placeholder="Enter category name"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Category Image</Label>
                                {image ? (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Category preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className={`flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors relative ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
                                            }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            onChange={handleImageChange}
                                            title=""
                                        />
                                        <div className="text-center pointer-events-none">
                                            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                            <span className="mt-2 block text-sm font-medium text-muted-foreground">
                                                {isDragging ? "Drop image here" : "Click or drag to upload image"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Category"}
                                </Button>
                                <Link href="/admin/categories" className="w-full">
                                    <Button type="button" variant="outline" className="w-full bg-transparent">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}
