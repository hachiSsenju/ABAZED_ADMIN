export interface Product {
  id: string
  nom: string
  slug: string
  prix: number
  prixOriginal?: number
  description: string
  descBreve: string
  images: string[]
  note: number
  stock: number
  nouveau: boolean
  categorie : string
  status : "active" | "inactive" | "draft"
//featured: boolean
//   tags: string[]
//   category: string
//   categoryName: string
//   reviewCount: number
}