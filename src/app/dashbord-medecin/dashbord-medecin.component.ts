import { Component, OnInit, ViewChild } from '@angular/core';
import { RendezvousService } from '../service/rendezvous.service';
import { PatientService } from '../service/patient.service';
import { RendezVous } from '../model/rendez-vous';
import { forkJoin, Observable, of, catchError, tap } from 'rxjs';
import { MedecinService } from '../service/medecin.service';
import { CalendarOptions, formatDate } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Disponibilite } from '../model/disponibilite';
import { DisponibiliteService } from '../service/disponibilite.service';
@Component({
  selector: 'app-dashbord-medecin',
  templateUrl: './dashbord-medecin.component.html',
  styleUrls: ['./dashbord-medecin.component.css']
})
export class DashbordMedecinComponent implements OnInit {
  isModalOpen: boolean = false;

  showDisponibilite: boolean = false;
  tabDisponibilite: Disponibilite[] = []; 
  tabRDV: RendezVous[] = [];
  medecinId: number = 1; // À remplacer par l'ID du médecin connecté (via Auth)
  showRDV: boolean = false;
  doctorId: number | null = null;
  nom!: string;
  prenom!: string;
  specialite!: string;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // Vue du calendrier (dayGridMonth pour une vue mensuelle)
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Assurez-vous que les plugins sont listés ici
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: ''
    },
    editable: true,
    selectable: true,
    events: [
     
    ],
    dateClick: this.handleDateClick.bind(this),
    
  };
  selected: Date | null = null;
  errorMessage: string | null = null;
  medecin: { nom: string; prenom: string } | null = null;
  dateClass = (date: Date): string => {
    const formattedDate = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    const rdvDates = this.tabRDV.map((rdv) =>
      new Date(rdv.DateRdv).toISOString().split('T')[0]
    );
    return rdvDates.includes(formattedDate) ? 'selected-date' : '';
  };
  private resetSections() {
 
    this.showDisponibilite = false;
    this.showRDV = false;
  }
  @ViewChild('addDisponibiliteModal') addDisponibiliteModal: any;
  
  constructor(
    private rendezvousService: RendezvousService,
    private patientService: PatientService,
    private medecinService : MedecinService,
    private authService: AuthService,
    private router : Router,
    private disponibiliteService: DisponibiliteService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.medecinService.getMedecinId().subscribe({
      next: (response) => {
        this.medecinId = response.medecin_id; // Récupération de l'ID du médecin connecté
        this.loadRendezvousWithDetails(); // Charger les rendez-vous après avoir l'ID
        this.loadMedecinInfo(); // Charger les informations du médecin
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'ID du médecin connecté:', error);
      }
    });
    this.loadDoctorInfo();
    this.showDisponibiliteSection();
  }
  
  openModal(): void {
    this.isModalOpen = true;
  }
  

  loadRendezvousWithDetails(): void {
    this.rendezvousService.getRendezvousByMedecin(this.medecinId).subscribe(
      (response: any) => {
        console.log('Réponse complète:', response); // Ajout du log
        const rdvs = Array.isArray(response) ? response : response?.data; // Vérification du format des données
        if (Array.isArray(rdvs)) {
          const detailRequests = rdvs.map((rdv) => {
            const patientRequest = this.patientService.getPatientById(rdv.patient_id).pipe(
              catchError((error) => {
                console.error(`Erreur récupération patient ID ${rdv.patient_id}`, error);
                return of(null); // Retourne null si une erreur se produit
              })
            );
            return forkJoin({ rdv: of(rdv), patient: patientRequest });
          });
  
          forkJoin(detailRequests).subscribe(
            (results) => {
              this.tabRDV = results.map((res) => {
                const rendezvous = res.rdv;
                if (res.patient && res.patient.user) {
                  rendezvous.patient_nom_prenom = `${res.patient.user.prenom} ${res.patient.user.nom}`;
                }
                rendezvous.DateRdv = new Date(rendezvous.DateRdv).toISOString().split('T')[0];
                return rendezvous;
              });
              console.log('Données des rendez-vous après ajout des détails:', this.tabRDV);
            },
            (error) => {
              console.error('Erreur lors du traitement des détails des rendez-vous:', error);
            }
          );
        } else {
          console.error('Les données retournées ne sont pas un tableau:', rdvs);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
      }
    );
  }
  loadDisponibiliteWithDetails(){
    this.disponibiliteService.getAllDisponibilite().subscribe((disponibilites) => {
      const disponibiliteRequests = disponibilites.map((disponibilite) => {
        return this.disponibiliteService.getMedecinById(disponibilite.medecin_id).pipe(
          tap((medecin) => {
            disponibilite.medecin = medecin;
            if (medecin.user) {
              disponibilite.medecin_nom_prenom = `${medecin.user.prenom} ${medecin.user.nom}`;
            }
          })
        );
      });
  
      forkJoin(disponibiliteRequests).subscribe(() => {
        this.tabDisponibilite = disponibilites;
  
        this.calendarOptions.events = this.tabDisponibilite.map((disponibilite) => ({
          title: disponibilite.medecin_nom_prenom,
          start: `${disponibilite.JourDisponible}T${disponibilite.HeureDebut}`,
          end: `${disponibilite.JourDisponible}T${disponibilite.HeureFin}`,
          className: 'blue-event',
          extendedProps: {
            medecinDetails: disponibilite.medecin,
            disponibiliteId: disponibilite.id
          }
        }));
      });
    });
  }
  getDoctorId(): void {
    this.medecinService.getDoctorId().subscribe({
      next: (response) => {
        this.doctorId = response.doctor_id;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'ID du médecin:', error);
      }
    });
  }


  showRDVSection() {
   this.showRDV = true;
   this.loadRendezvousWithDetails();
}
showDisponibiliteSection() {
  this.showDisponibilite = true;
  this.loadDisponibiliteWithDetails();
}


loadMedecinInfo() {
  const id = this.route.snapshot.params['id']; // Retrieve ID from the route if applicable
  this.medecinService.getMedecinInfo(id).subscribe(
    (data) => {
      console.log('Medecin Info:', data);
    },
    (error) => {
      console.error('Erreur lors de la récupération des informations du médecin:', error);
    }
  );
}


handleDateClick(arg: any): void {
  alert('Date sélectionnée : ' + arg.dateStr); // Exemple d'action
}
  

validateRdv(rdvId: number) {
  this.rendezvousService.validateRdv(rdvId).subscribe((response) => {
    if (response.success) {
      alert('Rendez-vous validé et email envoyé.');
      this.loadRendezvousWithDetails(); // Refresh the RDV data after validation
    } else {
      alert('Erreur lors de la validation.');
    }
  });
}

annulerRdv(rdvId: number) {
  this.rendezvousService.annulerRdv(rdvId).subscribe((response) => {
    if (response.success) {
      alert('Rendez-vous annuler et email envoyé.');
      this.loadRendezvousWithDetails(); // Refresh the RDV data after validation
    } else {
      alert('Erreur lors de la validation.');
    }
  });
}
reporterRdv(rdvId: number) {
  this.rendezvousService.reporterRdv(rdvId).subscribe((response) => {
    if (response.success) {
      alert('Rendez-vous reporter et email envoyé.');
      this.loadRendezvousWithDetails(); // Refresh the RDV data after validation
    } else {
      alert('Erreur lors de la validation.');
    }
  });
}

loadDoctorInfo(): void {
  this.medecinService.getdoctorInfo().subscribe(
    (data) => {
      this.medecin = data;
      this.errorMessage = null; // Réinitialiser les erreurs
    },
    (error) => {
      this.medecin = null;
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


openDisponibiliteModal() {
  this.disponibiliteService.openDisponibiliteModal();  // Appel du service pour ouvrir le modal
}



}
