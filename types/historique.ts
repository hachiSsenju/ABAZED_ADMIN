export interface HistoriqueValueUser {
    id: number;
    email: string;
    nom: string;
    prenom: string;
}

export interface HistoriqueValueCategorie {
    id: number;
    nom: string;
    image: string;
}

export interface HistoriqueValueProduit {
    id: number;
    nom: string;
    slug: string;
    prix: number;
    description: string;
    desc_breve: string;
    note: number;
    status: string;
    prixOriginal: number;
    stock: number;
    images: string[];
}

export interface HistoriqueItem {
    entity: "User" | "Categorie" | "Produit";
    action: "create" | "update" | "delete";
    prevValue: any | null;
    value: HistoriqueValueUser | HistoriqueValueCategorie | HistoriqueValueProduit | any;
    created_at?: string; // Assuming there might be a date field, otherwise we might need to rely on order or add it if available
}
