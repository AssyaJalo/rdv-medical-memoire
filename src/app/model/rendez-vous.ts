import { User } from "./user";

export class RendezVous {
    id!: number;
    medecin_id!: number;
    patient_id!: number;
    DateRdv!: Date;
    isValided!: boolean;
    medecin?: User;
    medecin_nom_prenom?: string;
    patient?: User;
    patient_nom_prenom?: string;
    medecin_specialite?: string;
    user!: User

}
