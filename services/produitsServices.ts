import { api } from "@/api/api";

export const ProduitsService = {
  getAll: async () => {
    const response = await api.get('/produit');
    return response.data;
  },
  delete : async (id: string) => {
    const response = await api.delete(`/api/produits/delete/${id}`);
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await api.get(`/produit/${slug}`);
    return response.data;
  },
  postProduit: async (data: any, images: File[]): Promise<any> => {
    const formData = new FormData();

    // Ajouter les champs du logement au FormData
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value != null ? String(value) : "");
    });

    // Ajouter les fichiers image au FormData
    images.forEach((image) => {
      formData.append('images[]', image);
    });

    try {
      const response = await api.post('/api/produit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du Produit :', error.response?.data || error.message);
      throw error;
    }
  },
  editProduit: async (id: string, data: any, images: (string | File)[]): Promise<any> => {
    const formData = new FormData();

    // Ajouter les champs du logement au FormData
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value != null ? String(value) : "");
    });

    // Ajouter les fichiers image au FormData
    images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images[]', image);
      }
    });

    try {
      const response = await api.post(`/api/produit/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la modification du Produit :', error.response?.data || error.message);
      throw error;
    }
  }

}