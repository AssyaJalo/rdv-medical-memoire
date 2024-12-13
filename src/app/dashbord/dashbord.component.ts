import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Medecin } from '../model/medecin';
import { MedecinService } from '../service/medecin.service';
import Swal from 'sweetalert2';
import { forkJoin, tap } from 'rxjs';
import { AssistantService } from '../service/assistant.service';
import { Assistant } from '../model/assistant';
import { Patient } from '../model/patient';
import { PatientService } from '../service/patient.service';
import { Disponibilite } from '../model/disponibilite';
import { DisponibiliteService } from '../service/disponibilite.service';
import { RendezvousService } from '../service/rendezvous.service';
import { RendezVous } from '../model/rendez-vous';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MedecinComponent } from '../medecin/medecin.component';
import { MedecinUpdateComponent } from '../medecin/medecinUpdate.component';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
  showMedecins: boolean = false;
  tabMedecin: Medecin[] = [];
  showAssistant: boolean = false;
  tabAssistant: Assistant[] = []; 
  showPatient: boolean = false;
  tabPatient: Patient[] = []; 
  showDisponibilite: boolean = false;
  tabDisponibilite: Disponibilite[] = []; 
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventColor: 'blue',

    // Personnalisation du contenu de chaque événement
    eventContent: (arg) => {
      const eventTitle = document.createElement('div');
      eventTitle.classList.add('event-title');
      eventTitle.textContent = `Dr. ${arg.event.title}`;
    
      const eventTime = document.createElement('div');
      eventTime.classList.add('event-time');
    
      if (arg.event.start && arg.event.end) {
        eventTime.textContent = `${arg.event.start.toLocaleTimeString()} - ${arg.event.end.toLocaleTimeString()}`;
      } else {
        eventTime.textContent = "Heure non définie";
      }
    
      eventTime.style.maxWidth = '120px';
      eventTime.style.overflow = 'hidden';
      eventTime.style.textOverflow = 'ellipsis';
    
      const arrayOfDomNodes = [eventTitle, eventTime];
      return { domNodes: arrayOfDomNodes };
    }
  };
  showRDV: boolean = false;
  tabRDV: RendezVous[] = [];

  showModal: boolean = false;
  medecinToEdit: Medecin = {} as Medecin;

  private resetSections() {
    this.showMedecins = false;
    this.showAssistant = false;
    this.showPatient = false;
    this.showDisponibilite = false;
    this.showRDV = false;
  }
  role: string | null = null;

 
  @ViewChild('addMedecinModal') addMedecinModal: any;
  userRole: string = ''; 
  currentUser: any;
  constructor(private medecinService: MedecinService,
              private assistantservice: AssistantService,
              private patientService: PatientService,
              private disponibiliteService: DisponibiliteService,
              private rdvService: RendezvousService,
              private modalService: NgbModal,
              private authService: AuthService,
              private router: Router
  ){ this.authService.getUserRole()}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.currentUser = this.authService.getUserDetails();
    // this.userRole = this.authService.getRoleUser();
  }
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isMedecin(): boolean {
    return this.authService.isMedecin();
  }
  openModal() {
    this.showModal = true;
  }
  // Method to display the medecins section and load the data
  showMedecinsSection() {
    this.resetSections();
    this.showMedecins = true;
    this.loadMedecinsWithDetails();
  }
   // Method to display the assistants section and load the data
  showAssistantSection() {
    this.resetSections();
    this.showAssistant = true;
    this.loadAssistantWithDetails();
  }
  // Method to display the patient section and load the data
  showPatientSection() {
    this.resetSections();
    this.showPatient = true;
    this.loadPatientWithDetails();
  }
    // Method to display the disponibilite section and load the data
    showDisponibiliteSection() {
      this.resetSections();
      this.showDisponibilite = true;
      this.loadDisponibiliteWithDetails();
    }

        // Method to display the disponibilite section and load the data
     showRDVSection() {
         this.resetSections();
          this.showRDV = true;
          this.loadRDVWithDetails();
    }


  // Method to load medecin data with assistant and specialite details
  loadMedecinsWithDetails() {
    this.medecinService.getAllMedecin().subscribe(medecins => {
      const medecinRequests = medecins.map(medecin => {
        // Fetch assistant data
        const assistant$ = this.medecinService.getAssistantById(medecin.assistant_id).pipe(
          tap(assistant => {
            medecin.assistant = assistant;
            medecin.assistant_nom_prenom = `${assistant.user?.prenom || ''} ${assistant.user?.nom || ''}`;
          })
        );

        // Fetch specialite data
        const specialite$ = this.medecinService.getSpecialiteName(medecin.specialite_id).pipe(
          tap(specialite => {
            medecin.specialite = specialite;
          })
        );

        return forkJoin([assistant$, specialite$]);
      });

      forkJoin(medecinRequests).subscribe(() => {
        // After all data is loaded, update the list
        this.tabMedecin = medecins;
      });
    });
  }
  deleteMedecin(id: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then(result => {
      if (result.isConfirmed) {
        this.medecinService.deleteMedecin(id).subscribe(() => {
          this.loadMedecinsWithDetails(); // Reload the list after deletion
        });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }
  


  loadAssistantWithDetails(){
    this.assistantservice.getAllAssistant().subscribe(
      (data : Assistant[]) => {
        console.log('assistant reçus:', data); // Affichez les données complètes
        this.tabAssistant = data;

      },
      (error : any ) =>{
        console.error('Erreur lors de la récupération des assistants:', error);
      }
    );

  }
  deleteAssistant(id:any){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.assistantservice.deleteAssistant(id).subscribe(
          ()=>{
                this.loadAssistantWithDetails();
          },
          ()=>{
    
          }
        )
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    })
  }

  loadPatientWithDetails(){
    this.patientService.getAllPatient().subscribe(
      (data : Patient[]) => {
        console.log('patient reçus:', data); // Affichez les données complètes
        this.tabPatient = data;

      },
      (error : any ) =>{
        console.error('Erreur lors de la récupération des patients:', error);
      }
    );
  }
  deletePatient(id:any){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.deletePatient(id).subscribe(
          ()=>{
                this.loadPatientWithDetails();
          },
          ()=>{
    
          }
        )
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    })
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
  handleEventClick(arg: any) {
    const medecinDetails = arg.event.extendedProps.medecinDetails;

    // Affichage de l'alerte SweetAlert2 avec deux boutons
    Swal.fire({
      title: `Disponibilité de Dr. ${medecinDetails.user.prenom} ${medecinDetails.user.nom}`,
      html: `
        <p>Date: ${arg.event.start.toLocaleDateString()}</p>
        <p>Heure: ${arg.event.start.toLocaleTimeString()} - ${arg.event.end.toLocaleTimeString()}</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Accepter',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        // Action si "Accepter" est cliqué
        Swal.fire('Confirmé', 'Vous avez accepté la disponibilité.', 'success');
      } else if (result.isDismissed) {
        // Action si "Annuler" est cliqué
        Swal.fire('Annulé', 'Vous avez annulé la disponibilité.', 'error');
      }
    });
  }

  getAllDisponibilite() {
    this.disponibiliteService.getAllDisponibilite().subscribe(
      (data: Disponibilite[]) => {
        console.log('Disponibilités reçues:', data);
        this.tabDisponibilite = data;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des disponibilités:', error);
      }
    );
  }

  loadRDVWithDetails(){
    this.rdvService.getAllRDV().subscribe((rdvs: RendezVous[]) => {
      // Utiliser un tableau de Promesses pour récupérer tous les médecins et patients
      const medecinRequests = rdvs.map((rendezvous) => {
        const medecin$ = this.medecinService.getMedecinById(rendezvous.medecin_id).pipe(
          tap((medecin) => {
            if (medecin.user) {
              rendezvous.medecin_nom_prenom = `${medecin.user.prenom} ${medecin.user.nom}`;
            }
          })
        );

        const patient$ = this.patientService.getPatientById(rendezvous.patient_id).pipe(
          tap((patient) => {
            if (patient.user) {
              rendezvous.patient_nom_prenom = `${patient.user.prenom} ${patient.user.nom}`;
            }
          })
        );

        // Retourner un tableau avec les deux observables pour chaque rendez-vous
        return forkJoin([medecin$, patient$]);
      });

      // Attendre que toutes les requêtes soient terminées
      forkJoin(medecinRequests).subscribe(() => {
        // Une fois que toutes les données sont récupérées et associées, mettre à jour la liste
        this.tabRDV = rdvs;
        console.log('Rendez-vous avec médecins et patients:', this.tabRDV);
      });
    }, (error: any) => {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
    });

  }
  

// Utilisez le service pour ouvrir le modal
  

  openAddModal() {
    this.medecinService.openMedecinModal();  // Appel du service pour ouvrir le modal
  }
  

  openAddAssistantModal() {
    this.assistantservice.openAssistantModal();  // Appel du service pour ouvrir le modal
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
}
