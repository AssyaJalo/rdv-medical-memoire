import { Component, OnInit } from '@angular/core';
import { Disponibilite } from '../model/disponibilite';
import { DisponibiliteService } from '../service/disponibilite.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, tap } from 'rxjs';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';  // Import de SweetAlert2

@Component({
  selector: 'app-disponibilite',
  templateUrl: './disponibilite.component.html',
  styleUrls: ['./disponibilite.component.css']
})
export class DisponibiliteComponent implements OnInit {
  tabDisponibilite: Disponibilite[] = [];
  showDisponibilite: boolean = false;
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

  private resetSections() {
 
    this.showDisponibilite = false;
    
  }

  constructor(
    private httpClient: HttpClient,
    private disponibiliteService: DisponibiliteService
  ) {}

  ngOnInit(): void {
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

  showDisponibiliteSection() {
    this.resetSections();  // Cette méthode cache d'autres sections si nécessaire
    this.showDisponibilite = true; // Affiche la section de disponibilité
    this.loadDisponibiliteWithDetails(); // Charge les données de disponibilité
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
}
