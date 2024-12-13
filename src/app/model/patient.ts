import { User } from "./user";


export class Patient {

    id!: number;
    user_id! : number;
    user!: User
    nom!: string;
    prenom!: string;
    email!: string;
    password!: string;
    telephone!: string;
    dateNaiss!: Date;
    role_id!:number;
    code_Patient! : string;
}
