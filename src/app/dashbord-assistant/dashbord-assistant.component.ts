import { Component, OnInit } from '@angular/core';
import { RendezVous } from '../model/rendez-vous';
import { RendezvousService } from '../service/rendezvous.service';
import { AuthService } from '../service/auth.service';
import { AssistantService } from '../service/assistant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashbord-assistant',
  templateUrl: './dashbord-assistant.component.html',
  styleUrls: ['./dashbord-assistant.component.css']
})
export class DashbordAssistantComponent implements OnInit {
  tabRDV: RendezVous[] = [];
  showRDV: boolean = false;
  assistantId: number = 2;  // Initialisez à 0 pour vérifier si l'assistant est bien connecté
  errorMessage: string | null = null;
  assistant: { nom: string; prenom: string } | null = null;
  
  constructor(  
    private rendezvousService: RendezvousService,
    private authService: AuthService,
    private assistantService : AssistantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRendezvous();
    this.loadAssistantInfo();
   
  }
  getRendezvous(): void {
    this.rendezvousService.getRendezvousByAssistant(this.assistantId).subscribe({
      next: (response) => {
        console.log('API Response:', response);  // Vérifiez la réponse brute
  
        const collection = response?.rendezvous;
        if (collection && collection.length > 0) {
          this.tabRDV = collection.map((rdv: any) => ({
            id: rdv.id,
            medecin_nom_prenom: rdv.medecin?.user ? `${rdv.medecin.user.nom} ${rdv.medecin.user.prenom}` : 'Inconnu',
            medecin_specialite: rdv.medecin?.specialite?.Nom_Specialite || 'Non défini',
            patient_nom_prenom: rdv.patient?.user ? `${rdv.patient.user.nom} ${rdv.patient.user.prenom}` : 'Inconnu',
            DateRdv: rdv.DateRdv,
            isValided: rdv.isValided,
          }));
          console.log('Processed Rendezvous:', this.tabRDV);
        } else {
          this.errorMessage = 'Aucun rendez-vous trouvé';
        }
      },
      error: (error) => {
        console.error('Error fetching appointments:', error);
        this.errorMessage = error.error?.message || 'Unknown error occurred.';
      }
    });
  }
  
  loadAssistantInfo(): void {
    this.assistantService.getAssistantInfo().subscribe(
      (data) => {
        this.assistant = data;
        this.errorMessage = null; // Réinitialiser les erreurs
      },
      (error) => {
        this.assistant = null;
        this.errorMessage = error.error.message || 'Une erreur est survenue.';
      }
    );
  }







  logout(): void {
    this.authService.logout().subscribe(
      () => {
        localStorage.removeItem('access_token'); // Supprimer le token
        this.router.navigate(['/login']); // Rediriger vers la page de login
      },
      (error) => {
        console.error('Erreur lors de la déconnexion :', error);
      }
    );
  }











  // loadRendezvous(): void {
  //   this.rendezvousService.getRendezvousForAssistant(this.assistantId).subscribe(
  //     (response: any) => {
  //       console.log('Réponse complète:', response);  // Débogage des données retournées

  //       const rdvs = Array.isArray(response) ? response : response?.data;

  //       if (Array.isArray(rdvs)) {
  //         this.tabRDV = rdvs.map((rdv) => {
  //           return {
  //             ...rdv, // Copie de l'objet original pour ne pas le modifier directement
  //             medecin_nom_prenom: this.getMedecinNomPrenom(rdv.medecin),
  //             medecin_specialite: this.getMedecinSpecialite(rdv.medecin),
  //             patient_nom_prenom: this.getPatientNomPrenom(rdv.patient),
  //           };
  //         });

  //         console.log('Données des rendez-vous après traitement:', this.tabRDV);
  //       } else {
  //         console.error('Les données retournées ne sont pas un tableau:', rdvs);
  //       }
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération des rendez-vous:', error);
  //     }
  //   );
  // }

  // // Méthodes pour obtenir le nom et prénom du médecin et du patient (identiques à votre code original)
  // private getMedecinNomPrenom(medecin: any): string {
  //   return medecin?.user ? `${medecin.user.prenom} ${medecin.user.nom}` : 'Médecin non spécifié';
  // }
  
  // private getMedecinSpecialite(medecin: any): string {
  //   return medecin?.specialite ? medecin.specialite.Nom_Specialite : 'Spécialité non spécifiée';
  // }
  
  // private getPatientNomPrenom(patient: any): string {
  //   return patient?.user ? `${patient.user.prenom} ${patient.user.nom}` : 'Patient non spécifié';
  // }
}
