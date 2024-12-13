import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { Patient } from '../model/patient';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient',
  templateUrl: './editPatient.component.html',
  styleUrls: ['./patient.component.css']
})
export class EditePatientComponent implements OnInit {
  veriform = false;
  id: any;
  passwordMatchValidator(form: any): { [key: string]: boolean } | null {
    if (form.controls['password'].value !== form.controls['password_confirmation'].value) {
      return { 'mismatch': true };
    }
    return null;
  }
  patientForm = this.formBuilder.group({
    id: [''],
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    dateNaiss: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
    role_id: [4]
  }, { 
    validator: this.passwordMatchValidator
  });

  constructor(
    private httpClient: HttpClient,
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.id = this.route.snapshot.params['id'];
      this.patientService.getPatientById(this.id).subscribe(
        (data) => {
          if (data.user) {
            const formattedDateNaiss = data.user.dateNaiss
              ? new Date(data.user.dateNaiss).toISOString().split('T')[0] 
              : '';
  
            this.patientForm.patchValue({
              id: this.id,
              nom: data.user.nom,
              prenom: data.user.prenom,
              email: data.user.email,
              telephone: data.user.telephone,
              dateNaiss: formattedDateNaiss,
              role_id: data.user.role_id
            });
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des données du patient:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de charger les informations du patient.',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
  

  // Fonction pour éditer les informations du patient
  editPatient() {
    this.veriform = true;
    if (this.patientForm.invalid) {
      return;
    }
  
    let updatedPatientData = { ...this.patientForm.value };
  
    // Convertir la dateNaiss du format DD/MM/YYYY vers YYYY-MM-DD
    let dateNaissValue = updatedPatientData.dateNaiss;
    if (dateNaissValue) {
      const parts = dateNaissValue.split('/');
      if (parts.length === 3) {
        // Conversion en format YYYY-MM-DD
        dateNaissValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
  
    updatedPatientData = { 
      ...updatedPatientData, 
      dateNaiss: dateNaissValue 
    };
  
    // Supprimer le mot de passe si non modifié
    if (!updatedPatientData.password) {
      delete updatedPatientData.password;
    }
  
    // Adapter l'objet avant l'envoi à l'API
    const patientDataToSend = {
      ...updatedPatientData,
      user: {
        nom: updatedPatientData.nom,
        prenom: updatedPatientData.prenom,
        email: updatedPatientData.email,
        telephone: updatedPatientData.telephone,
        dateNaiss: updatedPatientData.dateNaiss,
        role_id: updatedPatientData.role_id,
        password: updatedPatientData.password // Si le mot de passe est modifié
      }
    };
  
    // Envoi des données au service pour la mise à jour
    this.patientService.updatePatient(this.id, patientDataToSend).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Patient modifié!',
          text: 'Les informations du patient ont été mises à jour avec succès.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/patient']);
        });
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du patient:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour du patient.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  


  
}
