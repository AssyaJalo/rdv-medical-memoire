import { Component, OnInit } from '@angular/core';
import { RendezvousService } from '../service/rendezvous.service';
import { HttpClient } from '@angular/common/http';
import { RendezVous } from '../model/rendez-vous';
import { MedecinService } from '../service/medecin.service';
import { PatientService } from '../service/patient.service';
import { forkJoin, tap } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rendezvous',
  templateUrl: './updateRDV.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class UpdateRendezvousComponent implements OnInit {
  tabRDV: RendezVous[] = [];
  veriform = false;
  id : any;
  medecins: any[] = [];
  patients: any[] = [];
  rdvForm = this.formBuilder.group({
    id: [''],
    DateRdv: ['', Validators.required],
    // isValided: ['', Validators.required],
    medecin_id: ['', Validators.required],
    patient_id: ['', Validators.required],

  })
  constructor(
    private httpClient: HttpClient,
    private rdvService: RendezvousService,
    private medecinService: MedecinService,
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.loadMedecin();
    this.loadPatient();
  
    // Vérifier si un ID est présent dans l'URL
    if (this.route.snapshot.params['id']) {
      this.id = this.route.snapshot.params['id'];
      this.rdvService.getRDVById(this.id).subscribe((data: RendezVous) => {
        // Pré-remplir le formulaire avec les données récupérées
        this.rdvForm.get('DateRdv')?.setValue(new Date(data.DateRdv).toISOString().substring(0, 10)); // Format 'YYYY-MM-DD'
        // this.rdvForm.get('isValided')?.setValue(data.isValided ? 'true' : 'false');
        this.rdvForm.get('medecin_id')?.setValue(data.medecin_id.toString());
        this.rdvForm.get('patient_id')?.setValue(data.patient_id.toString());
      }, (error) => {
        console.error('Erreur lors de la récupération du rendez-vous:', error);
      });
    }
  }
  

  loadMedecin(): void {
    this.httpClient.get<any[]>('http://127.0.0.1:8000/api/medecin').subscribe(
      data => {
        this.medecins = data;
        console.log('medecins:', this.medecins); // Ajoutez cette ligne pour vérifier les données
      },
      error => {
        console.log(error);
      }
    );
  }
  loadPatient(): void {
    this.httpClient.get<any[]>('http://127.0.0.1:8000/api/patient').subscribe(
      data => {
        this.patients = data;
        console.log('patients:', this.patients); // Ajoutez cette ligne pour vérifier les données
      },
      error => {
        console.log(error);
      }
    );
  }
  addRDV() {
    if (this.rdvForm.valid) {
      const rdvData = this.rdvForm.value;
  
      if (this.id) {
        // Si un ID est présent, il s'agit d'une mise à jour
        this.rdvService.updateRDV(this.id, rdvData).subscribe(
          (response) => {
            console.log('Rendez-vous mis à jour:', response);
            // Affichage d'une alerte de succès
            Swal.fire({
              title: 'Rendez-vous mis à jour!',
              text: 'Le rendez-vous a été mis à jour avec succès.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/rendezvous']); // Rediriger vers la liste des rendez-vous après la confirmation
            });
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du rendez-vous:', error);
            // Affichage d'une alerte d'erreur
            Swal.fire({
              title: 'Erreur!',
              text: 'Il y a eu un problème lors de la mise à jour du rendez-vous.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        // Sinon, c'est un nouvel ajout
        this.rdvService.addRDV(rdvData).subscribe(
          (response) => {
            console.log('Rendez-vous ajouté:', response);
            // Affichage d'une alerte de succès
            Swal.fire({
              title: 'Rendez-vous ajouté!',
              text: 'Le rendez-vous a été ajouté avec succès.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/rendezvous']); // Rediriger vers la liste des rendez-vous après la confirmation
            });
          },
          (error) => {
            console.error('Erreur lors de l\'ajout du rendez-vous:', error);
            // Affichage d'une alerte d'erreur
            Swal.fire({
              title: 'Erreur!',
              text: 'Il y a eu un problème lors de l\'ajout du rendez-vous.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    } else {
      // Si le formulaire n'est pas valide, afficher une alerte
      Swal.fire({
        title: 'Formulaire invalide',
        text: 'Veuillez remplir tous les champs requis.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
  

}
