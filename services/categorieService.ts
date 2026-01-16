import { api } from "@/api/api";
export const categorieService = {
    getAll: async () => {
        const response = await api.get("/categorie");
        return response.data;
    },
    postCategorie: async (nom: string, image: File) => {
        const formData = new FormData();
        formData.append("image", image);

        const response = await api.post(`/api/categorie/addName/${nom}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }
}