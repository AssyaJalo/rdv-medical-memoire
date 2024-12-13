import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { Patient } from '../model/patient';
import Swal from 'sweetalert2';
import { MedecinService } from '../service/medecin.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Specialite } from '../model/specialite';
import { Assistant } from '../model/assistant';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient',
  templateUrl: './medecinUpdate.component.html',
  styleUrls: ['./medecin.component.css']
})
export class MedecinUpdateComponent implements OnInit{

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
    photo: [null, Validators.required],
    specialite_id: ['', Validators.required],
    assistant_id: ['', Validators.required],
  })

  constructor(private httpClient : HttpClient,
              private medecinService : MedecinService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              public activeModal: NgbActiveModal,

  ){}
    ngOnInit(): void {

      this.loadAssistant();
      this.loadSpecialite();

      if(this.route.snapshot.params['id']){
        this.id = this.route.snapshot.params['id'];
        this.medecinService.getMedecinById(this.id).subscribe(
          (data)=>{
            this.medecinForm.get('nom')?.setValue(""+data.user?.nom);
              this.medecinForm.get('prenom')?.setValue(""+data.user?.prenom);
              this.medecinForm.get('email')?.setValue(""+data.user?.email);
              this.medecinForm.get('telephone')?.setValue(""+data.user?.telephone);
              this.medecinForm.get('dateNaiss')?.setValue(""+data.user?.dateNaiss);
              this.medecinForm.get('password')?.setValue(""+data.user?.password);
          }
        )
      }
        
    }
    openModal(content: any): void {
      this.modalService.open(content, { centered: true, size: 'lg' });
    }
    openAddModal() {
      this.medecinService.openMedecinModal(); // Appel de la méthode pour ouvrir le modal
    }
    closeModal() {
      this.activeModal.dismiss();
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
    addMedecin() {
      if (this.medecinForm.invalid) {
        return;
      }
    
      // Récupère les valeurs avec une valeur par défaut pour éviter les erreurs
      const email = this.medecinForm.get('email')?.value ?? '';
      const assistant_id = parseInt(this.medecinForm.get('assistant_id')?.value ?? '0');
    
      // Vérification de l'unicité de l'email
      this.medecinService.checkEmailUnique(email).subscribe(emailResponse => {
        if (!emailResponse.unique) {
          Swal.fire('Erreur', 'Cet email est déjà utilisé.', 'error');
          return;
        }
    
        // Vérification si l'assistant est déjà assigné
        this.medecinService.checkAssistantAssigned(assistant_id).subscribe(assistantResponse => {
          if (assistantResponse.assigned) {
            Swal.fire('Erreur', 'Cet assistant est déjà assigné à un autre médecin.', 'error');
            return;
          }
    
          // Si tout est valide, préparez les données du formulaire
          const formData = new FormData();
          Object.keys(this.medecinForm.controls).forEach(key => {
            const control = this.medecinForm.get(key);
            if (control && control.value !== null) {
              formData.append(key, control.value);
            }
          });
    
          if (this.selectedFile) {
            formData.append('photo', this.selectedFile, this.selectedFile.name);
          }
    
          // Soumettre le formulaire après vérifications
          this.medecinService.addMedecin(formData).subscribe(
            (response) => {
              Swal.fire('Succès', 'Médecin créé avec succès', 'success');
              this.router.navigate(['/dashbord']);
            },
            (error) => {
              Swal.fire('Erreur', 'Une erreur est survenue lors de la création du médecin', 'error');
            }
          );
        });
      });
    }

    
    
    
    }
    

  
  




