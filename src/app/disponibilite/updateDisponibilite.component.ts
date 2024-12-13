import { Component, OnInit } from '@angular/core';
import { Disponibilite } from '../model/disponibilite';
import { DisponibiliteService } from '../service/disponibilite.service';
import { MedecinService } from '../service/medecin.service';
import { AuthService } from '../service/auth.service';  // Ajoutez le service d'authentification
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-disponibilite',
  templateUrl: './updateDisponibilite.component.html',
  styleUrls: ['./disponibilite.component.css']
})
export class UpdateDisponibiliteComponent implements OnInit {
  disponibiliteForm: FormGroup;
  medecins: any[] = [];
  selectedDate: string | null = null;
  medecinIdConnecte: number | null = null;  // Variable pour stocker l'ID du médecin connecté
  isMedecinDisabled: boolean = true;
  isModalOpen: boolean = false;

  constructor(
    private disponibiliteService: DisponibiliteService,
    private medecinService: MedecinService,
    private authService: AuthService,  // Injection du service d'authentification
    private fb: FormBuilder
  ) {
    this.disponibiliteForm = this.fb.group({
      medecin_id: ['', Validators.required],
      HeureDebut: ['', Validators.required],
      HeureFin: ['', Validators.required],
      dateDisponible: ['', Validators.required],
      JourDisponible: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMedecins();
    this.getMedecinIdConnecte();  // Récupération de l'ID du médecin connecté
    this.isModalOpen = true;
  }
  openModal(): void {
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Fonction pour récupérer l'ID du médecin connecté depuis le service d'authentification
  getMedecinIdConnecte(): void {
    this.medecinService.getMedecinId().subscribe(
      (id) => {
        this.medecinIdConnecte = id;
        this.disponibiliteForm.patchValue({ medecin_id: this.medecinIdConnecte });
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'ID du médecin connecté', error);
      }
    );
  }

  loadMedecins(): void {
    this.disponibiliteService.getMedecins().subscribe(medecins => {
      this.medecins = medecins;
      this.isMedecinDisabled = false;
    });
  }

  onSubmit(): void {
    if (this.disponibiliteForm.invalid) {
      return;
    }

    const disponibilite: Disponibilite = {
      id: 0,
      medecin_id: this.disponibiliteForm.value.medecin_id,
      HeureDebut: this.disponibiliteForm.value.HeureDebut,
      HeureFin: this.disponibiliteForm.value.HeureFin,
      JourDisponible: this.disponibiliteForm.value.JourDisponible,
      dateDisponible: this.disponibiliteForm.value.dateDisponible,
      medecin_nom_prenom: '',
    };

    this.disponibiliteService.addDisponibilite(disponibilite).subscribe(
      (response) => {
        Swal.fire('Succès', 'Disponibilité ajoutée avec succès', 'success');
      },
      (error) => {
        Swal.fire('Erreur', 'Erreur lors de l\'ajout de la disponibilité', 'error');
      }
    );
  }

  handleDateClick(arg: any): void {
    const selectedDate = arg.dateStr;
    this.disponibiliteForm.patchValue({
      JourDisponible: selectedDate
    });
    this.selectedDate = selectedDate;
  }

  handleEventClick(arg: any): void {
    const event = arg.event;
    Swal.fire({
      title: `Événement: ${event.title}`,
      text: `Date: ${event.start}`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
    this.disponibiliteForm.patchValue({
      medecin_id: event.extendedProps.medecin_id,
      HeureDebut: event.start.toISOString().split('T')[1].substring(0, 5),
      HeureFin: event.end.toISOString().split('T')[1].substring(0, 5),
      JourDisponible: event.start.toISOString().split('T')[0],
    });
  }

  onCalendarViewChange(arg: any): void {
    if (this.selectedDate) {
      const calendarApi = arg.view.calendar;
      calendarApi.gotoDate(this.selectedDate);
    }
  }
}
