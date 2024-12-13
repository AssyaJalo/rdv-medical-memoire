import { User } from "./user";

export class Medecin {
    id!: number;
    user_id!: number;
    user!: User;  // L'objet User
    code_Medecin!: string;
    photo!: File;
    assistant_id!: number;
    specialite_id!: number;
    specialite?: { Nom_Specialite: string };
    assistant?: User;
    assistant_nom_prenom?: string;
}
