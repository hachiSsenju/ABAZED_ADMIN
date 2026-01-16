import { api } from "@/api/api";

export const historiqueService = {
  getAll: async () => {
    const response = await api.get("/api/historique");
    return response.data;
  },
};
