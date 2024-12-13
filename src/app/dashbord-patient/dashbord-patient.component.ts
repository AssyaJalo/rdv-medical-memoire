import { Component } from '@angular/core';
import { RendezVous } from '../model/rendez-vous';
import { RendezvousService } from '../service/rendezvous.service';
import { PatientService } from '../service/patient.service';
import { MedecinService } from '../service/medecin.service';
import { catchError, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-dashbord-patient',
  templateUrl: './dashbord-patient.component.html',
  styleUrls: ['./dashbord-patient.component.css']
})
export class DashbordPatientComponent {


  tabRDV: RendezVous[] = [];
  patientId: number = 2; // À remplacer par l'ID du médecin connecté (via Auth)
  showRDV: boolean = false;
  errorMessage: string | null = null;
  patient: { nom: string; prenom: string } | null = null;

  constructor(
    private rendezvousService: RendezvousService,
    private patientService: PatientService,
    private medecinService: MedecinService,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRendezvousWithDetails();
    this.loadPatientInfo();
  }

  loadRendezvousWithDetails(): void {
    this.rendezvousService.getRendezvousByPatient(this.patientId).subscribe(
      (response: any) => {
        console.log('Réponse complète:', response); // Log pour vérifier la réponse de l'API
        const rdvs = Array.isArray(response) ? response : response?.data; // Vérification du format des données
  
        if (Array.isArray(rdvs)) {
          this.tabRDV = rdvs.map((rdv) => {
            if (rdv.medecin && rdv.medecin.user) {
             rdv.medecin_nom_prenom = `${rdv.medecin.user.prenom} ${rdv.medecin.user.nom}`
            }
            if (rdv.medecin && rdv.medecin.specialite) {
              rdv.medecin_specialite = rdv.medecin.specialite.Nom_Specialite || 'Spécialité non spécifiée';
            } else {
              rdv.medecin_specialite = 'Spécialité non spécifiée';
            }
            return rdv;
          });
          console.log('Données des rendez-vous après ajout des détails:', this.tabRDV);
        } else {
          console.error('Les données retournées ne sont pas un tableau:', rdvs);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
      }
    );
  }



  loadPatientInfo(): void {
    this.patientService.getPatientInfo().subscribe(
      (data) => {
        this.patient = data;
        this.errorMessage = null; // Réinitialiser les erreurs
      },
      (error) => {
        this.patient = null;
        this.errorMessage = error.error.message || 'Une erreur est survenue.';
      }
    );
  }
  
  
  
  logout(): void {
    this.authService.logout().subscribe(
      () => {
        localStorage.removeItem('access_token'); // Supprimer le token
        this.router.navigate(['/accueil']); // Rediriger vers la page de login
      },
      (error) => {
        console.error('Erreur lors de la déconnexion :', error);
      }
    );
  }
  

  showRDVSection() {
   this.showRDV = true;
   this.loadRendezvousWithDetails();
}
  
  
  
}
