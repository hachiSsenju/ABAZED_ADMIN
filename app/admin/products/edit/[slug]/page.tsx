"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ProduitsService } from "@/services/produitsServices"
import { categorieService } from "@/services/categorieService"
import { useToast } from "@/hooks/use-toast"
import { categorie } from "@/types/categorie"
import { Product } from "@/types/produit"
import { IMAGE_URL } from "@/api/api"

export default function NewProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState<Product>()
  const [categories, setCategories] = useState<categorie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    nom: "",
    prix: "",
    prixOriginal: "",
    stock: "",
    description: "",
    descBreve: "",
    status: "active",
    categorie: "",
    note: "",
    images: [] as (File | string)[],
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categorieService.getAll()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories", error)
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      }
    }
    fetchCategories()
  }, [toast])


  const fetchProducts = async () => {
    try {
      const response = await ProduitsService.getBySlug(params.slug);
      if (response) {
        console.log(response);
        setProduct(response);
        setFormData({
          nom: response.nom || "",
          categorie: response.categorie ? String(response.categorie) : "",
          prix: response.prix ? String(response.prix) : "",
          prixOriginal: response.prixOriginal ? String(response.prixOriginal) : "",
          stock: response.stock ? String(response.stock) : "",
          description: response.description || "",
          descBreve: response.descBreve || "",
          status: response.status || "active",
          note: response.note ? String(response.note) : "4",
          // categorie_id : response.categorie_id ? String(response.categorie_id) : "",
          images: response.images || [],
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
    finally {
      setIsLoading(false);
    }
    setIsLoading(false)

  }
  useEffect(() => {
    fetchProducts();
  }, [params.slug])

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
    if (e.dataTransfer.files) {
      const newImages = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare payload excluding images (as they are passed separately)
      const { images, ...rest } = formData

      const payload = {
        ...rest,
        prix: Number(formData.prix),
        prixOriginal: formData.prixOriginal ? Number(formData.prixOriginal) : 0,
        stock: Number(formData.stock),
        note: Number(formData.note),
        categorie: Number(formData.categorie),
      }

      await ProduitsService.editProduit(product?.id as string, payload, images)

      toast({
        title: "Success",
        description: "Product updated successfully",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground mt-1">Add a new product to your inventory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Product Name</Label>
                  <Input
                    id="nom"
                    placeholder="Enter product name"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descBreve">Short Description</Label>
                  <Input
                    id="descBreve"
                    placeholder="Enter short description"
                    value={formData.descBreve}
                    onChange={(e) => setFormData({ ...formData, descBreve: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                      <img
                        src={
                          typeof image === "string"
                            ? IMAGE_URL + image
                            : URL.createObjectURL(image)
                        }
                        key={index}
                        alt={`Product ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div
                    className={`flex items-center justify-center aspect-square rounded-md border-2 border-dashed transition-colors relative ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      onChange={handleImageChange}
                      title=""
                    />
                    <div className="text-center pointer-events-none">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <span className="mt-2 block text-sm font-medium text-muted-foreground">
                        {isDragging ? "Drop images here" : "Add Images"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="prix">Price</Label>
                    <Input
                      id="prix"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.prix}
                      onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prixOriginal">Original Price</Label>
                    <Input
                      id="prixOriginal"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.prixOriginal}
                      onChange={(e) => setFormData({ ...formData, prixOriginal: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Rating (Note)</Label>
                    <Input
                      id="note"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="4"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categorie">Category</Label>
                  <Select
                    value={formData.categorie}
                    onValueChange={(value) => setFormData({ ...formData, categorie: value })}
                  >
                    <SelectTrigger id="categorie">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
              <Link href="/admin/products">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
