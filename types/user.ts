export interface User{
    nom : string;
    prenom : string;
    email : string; 
    password : string;
    avatar: string;
    createdAt : string;
    datas : {
        produitsCount: number;
        usersCount: number;
    }
}