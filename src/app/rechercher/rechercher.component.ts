import { Component, OnInit } from '@angular/core';
import { MedecinService } from '../service/medecin.service';
import { AuthService } from '../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RendezvousService } from '../service/rendezvous.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rechercher',
  templateUrl: './rechercher.component.html',
  styleUrls: ['./rechercher.component.css']
})
export class RechercherComponent implements OnInit{
  query: string = '';
  medecins: any[] = [];
  errorMessage: string = '';

  constructor(private medecinService: MedecinService,
              private authService:AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private rendrzvouservice: RendezvousService,
              private http: HttpClient,
  ) {}
  ngOnInit(): void {
    // if (!this.authService.isLoggedIn()) {
    //   this.router.navigate(['/login']);
    // }
  }

  rechercher() {
    if (!this.query) {
        this.errorMessage = 'Veuillez entrer un terme de recherche.';
        return;
    }

    this.medecinService.rechercherMedecin(this.query).subscribe({
        next: (data) => {
            console.log('Data received:', data); // Debug log
            this.medecins = data;
            this.errorMessage = '';
        },
        error: (err) => {
            console.error(err);
            this.errorMessage = 'Aucun médecin trouvé.';
            this.medecins = [];
        }
    });
}
getImageUrl(photo: string): string {
  return `http://127.0.0.1:8000/images/${photo}`;
}

prendreRendezVous(medecin: any, dispo: any): void {
  // Vérifiez si l'utilisateur est connecté
  if (!this.authService.isLoggedIn()) {
    // Si non connecté, afficher une alerte et rediriger vers la page de connexion
    Swal.fire({
      title: 'Non connecté',
      text: 'Veuillez vous connecter avant de prendre un rendez-vous.',
      icon: 'warning',
      confirmButtonText: 'Ok',
    }).then(() => {
      // Redirigez vers la page de connexion si nécessaire
      this.router.navigate(['/login']);
    });
    return; // Terminer l'exécution ici, car l'utilisateur n'est pas connecté
  }

  // Vérifier si les données sont valides
  if (!medecin || !dispo) {
    Swal.fire({
      title: 'Erreur',
      text: 'Les informations du médecin ou de la disponibilité sont incorrectes.',
      icon: 'error',
      confirmButtonText: 'Ok',
    });
    return;
  }

  // Création de l'objet de données pour le rendez-vous
  const rdvData = {
    medecin_id: medecin.id, // ID du médecin
    DateRdv: dispo.dateDisponible, // La date du rendez-vous choisie
    isValided: false, // Le rendez-vous est initialement non validé
  };

  // Appel du service pour prendre un rendez-vous
  this.rendrzvouservice.prendreRendezVous(rdvData).subscribe({
    next: (response) => {
      // Si le rendez-vous est pris avec succès
      Swal.fire({
        title: 'Rendez-vous confirmé!',
        text: 'Votre rendez-vous a été enregistrer avec succès.',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then(() => {
        // Rediriger vers le tableau de bord du patient après le succès
        this.router.navigate(['/dashbord-patient']);
      });
    },
    error: (err) => {
      // Gestion des erreurs
      console.error(err);
      const errorMessage =
        err?.error?.message || 'Une erreur est survenue lors de la prise du rendez-vous.';
      Swal.fire({
        title: 'Erreur',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Essayer à nouveau',
      });
    },
  });
}








}
