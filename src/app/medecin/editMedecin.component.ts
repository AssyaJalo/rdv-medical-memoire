import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { Patient } from '../model/patient';
import Swal from 'sweetalert2';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MedecinService } from '../service/medecin.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient',
  templateUrl: './editMedecin.component.html',
  styleUrls: ['./medecin.component.css']
})
export class EditeMedecinComponent implements OnInit{

  
  showModal: boolean = false;
  veriform = false;
  id : any;
  selectedFile: File | null = null;
  specialites: any[] = []; // Liste des spécialités
  assistants: any[] = []; // Liste des assistants
  medecinForm = this.formBuilder.group({
    id: [''],
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    dateNaiss: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
    role_id: [2],
    photo: [null],
    specialite_id: [''],
    assistant_id: [''],
  })

  constructor(private httpClient : HttpClient,
    private medecinService : MedecinService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    

){}
ngOnInit(): void {

  this.loadAssistant();
  this.loadSpecialite();

  if(this.route.snapshot.params['id']){
    this.id = this.route.snapshot.params['id'];
    this.medecinService.getMedecinById(this.id).subscribe(
      (data)=>{
        if(data.user) {
          const formattedDateNaiss = data.user.dateNaiss
          ? new Date(data.user.dateNaiss).toISOString().split('T')[0] 
          : '';
        this.medecinForm.patchValue({
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


onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    this.medecinForm.patchValue({ photo: file });
  }
}
loadSpecialite(): void {
  this.httpClient.get<any[]>('http://127.0.0.1:8000/api/specialite').subscribe(
    data => {
      this.specialites = data;
      console.log('specialite:', this.specialites); // Ajoutez cette ligne pour vérifier les données
    },
    error => {
      console.log(error);
    }
  );
}

loadAssistant(): void {
  this.httpClient.get<any[]>('http://127.0.0.1:8000/api/assistant').subscribe(
    data => {
      this.assistants = data;
      console.log('assistants:', this.assistants); // Ajoutez cette ligne pour vérifier les données
    },
    error => {
      console.log(error);
    }
  );
}

updateMedecin() {
  this.veriform = true;
  if (this.medecinForm.invalid) {
    return;
  }
  let updatedMedecinData = { ...this.medecinForm.value };
  
    // Convertir la dateNaiss du format DD/MM/YYYY vers YYYY-MM-DD
    let dateNaissValue = updatedMedecinData.dateNaiss;
    if (dateNaissValue) {
      const parts = dateNaissValue.split('/');
      if (parts.length === 3) {
        // Conversion en format YYYY-MM-DD
        dateNaissValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
  
    updatedMedecinData = { 
      ...updatedMedecinData, 
      dateNaiss: dateNaissValue 
    };
  
    // Supprimer le mot de passe si non modifié
    if (!updatedMedecinData.password) {
      delete updatedMedecinData.password;
    }
  
    // Adapter l'objet avant l'envoi à l'API
    const medecinDataToSend = {
      ...updatedMedecinData,
      user: {
        nom: updatedMedecinData.nom,
        prenom: updatedMedecinData.prenom,
        email: updatedMedecinData.email,
        telephone: updatedMedecinData.telephone,
        dateNaiss: updatedMedecinData.dateNaiss,
        role_id: updatedMedecinData.role_id,
        password: updatedMedecinData.password // Si le mot de passe est modifié
      }
    };
  
    // Envoi des données au service pour la mise à jour
    this.medecinService.updateMedecin(this.id, medecinDataToSend).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'medecin modifié!',
          text: 'Les informations du patient ont été mises à jour avec succès.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/medecin']);
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
