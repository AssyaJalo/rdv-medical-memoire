import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AssistantService } from '../service/assistant.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Assistant } from '../model/assistant';

@Component({
  selector: 'app-assistant',
  templateUrl: './edit_assistant.component.html',
  styleUrls: ['./assistant.component.css']
})
export class AssistantEditComponent implements OnInit {
  veriform = false;
  id: any;
  assistant: any;
  assistantForm = this.formBuilder.group({
    id: [''],
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    dateNaiss: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
    role_id: [3],
    
  });

  constructor(
    private httpClient: HttpClient,
    private assistantService: AssistantService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.id = this.route.snapshot.params['id'];
      this.assistantService.getAssistantById(this.id).subscribe(
        (data) => {
          if (data.user) {
            const formattedDateNaiss = data.user.dateNaiss
              ? new Date(data.user.dateNaiss).toISOString().split('T')[0]
              : '';
    
            this.assistantForm.patchValue({
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
  
  

  editAssistant() {
    this.veriform = true;
    if (this.assistantForm.invalid) {
      return;
    }
  
    let updatedAssistantData = { ...this.assistantForm.value };
  
    // Convertir la dateNaiss du format DD/MM/YYYY vers YYYY-MM-DD
    let dateNaissValue = updatedAssistantData.dateNaiss;
    if (dateNaissValue) {
      const parts = dateNaissValue.split('/');
      if (parts.length === 3) {
        // Conversion en format YYYY-MM-DD
        dateNaissValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
  
    updatedAssistantData = { 
      ...updatedAssistantData, 
      dateNaiss: dateNaissValue 
    };
  
    // Supprimer le mot de passe si non modifié
    if (!updatedAssistantData.password) {
      delete updatedAssistantData.password;
    }
  
    // Adapter l'objet avant l'envoi à l'API
    const assistantDataToSend = {
      ...updatedAssistantData,
      user: {
        nom: updatedAssistantData.nom,
        prenom: updatedAssistantData.prenom,
        email: updatedAssistantData.email,
        telephone: updatedAssistantData.telephone,
        dateNaiss: updatedAssistantData.dateNaiss,
        role_id: updatedAssistantData.role_id,
        password: updatedAssistantData.password // Si le mot de passe est modifié
      }
    };
  
    // Envoi des données au service pour la mise à jour
    this.assistantService.updateAssistant(this.id, assistantDataToSend).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Patient modifié!',
          text: 'Les informations du assistant ont été mises à jour avec succès.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/assistant']);
        });
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du assistant:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour du assistant.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  
}
