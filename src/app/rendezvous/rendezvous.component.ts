import { Component, OnInit } from '@angular/core';
import { RendezvousService } from '../service/rendezvous.service';
import { HttpClient } from '@angular/common/http';
import { RendezVous } from '../model/rendez-vous';
import { MedecinService } from '../service/medecin.service';
import { PatientService } from '../service/patient.service';
import { forkJoin, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-rendezvous',
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class RendezvousComponent implements OnInit {
  tabRDV: RendezVous[] = [];
  

  constructor(
    private httpClient: HttpClient,
    private rdvService: RendezvousService,
    private medecinService: MedecinService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.getAllRDV();
  }

  getAllRDV() {
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

}
