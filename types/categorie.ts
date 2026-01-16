import { Product } from "./produit"

export interface categorie {
    id: number
    nom: string
    totalProduits?: number
    image?: string
    produits?: Product[]
    categorie?: number | null
}