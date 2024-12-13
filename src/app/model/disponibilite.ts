import { Time } from "@angular/common";
import { Medecin } from "./medecin";

export class Disponibilite {

    id!: number;
    medecin_id!: number;
    HeureDebut!: Time;
    HeureFin!: Time;
    dateDisponible!:Date;
    JourDisponible! : string;
    medecin?: Medecin;
    medecin_nom_prenom!: string;
  
}
