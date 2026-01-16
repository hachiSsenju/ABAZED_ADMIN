import { api } from "@/api/api";

export const AuthService = {
    login : async (username: string, password: string) => {
        const response = await api.post("/api/login", {
            username : username,
            password : password
        });
        return response.data;
    },
    me : async () => {
        const response = await api.get("/api/me");
        return response.data;
    }
}