import { User } from "@/types/user";

export const sessionService = {
    setSessionToken: (token: string) => {
        if (typeof window !== "undefined" && sessionStorage) {
            sessionStorage.setItem("access_token", token);
        }},
    setUser : (user : User) => {
        if (typeof window !== "undefined" && sessionStorage) {
            sessionStorage.setItem("user", JSON.stringify(user));
        }
       
    },
    getUser : () => {
        if (typeof window !== "undefined" && sessionStorage) {
            const user = sessionStorage.getItem("user");
            if(user){
                return JSON.parse(user);
            }
            return null;
        }
       
    },
    isLoggedIn: () => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("access_token");
    }
    return false;
  },
  
    }