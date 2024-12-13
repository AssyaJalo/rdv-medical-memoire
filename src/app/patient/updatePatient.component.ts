import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import Swal from 'sweetalert2';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient',
  templateUrl: './updatePatient.component.html',
  styleUrls: ['./patient.component.css']
})
export class UpdatePatientComponent implements OnInit{
  veriform = false;
  id : any;
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
      });


  constructor(private httpClient : HttpClient,
              private patientService : PatientService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,

  ){}
  ngOnInit(): void {
    if(this.route.snapshot.params['id']){
      this.id = this.route.snapshot.params['id'];
      this.patientService.getPatientById(this.id).subscribe(
          (data)=>
          {
              this.patientForm.get('nom')?.setValue(""+data.user?.nom);
              this.patientForm.get('prenom')?.setValue(""+data.user?.prenom);
              this.patientForm.get('email')?.setValue(""+data.user?.email);
              this.patientForm.get('telephone')?.setValue(""+data.user?.telephone);
              this.patientForm.get('dateNaiss')?.setValue(""+data.user?.dateNaiss);
              this.patientForm.get('password')?.setValue(""+data.user?.password);

          },
          (error)=>
          {
  
          }
      )

  }
    
  }

  AddPatient() { 
    this.veriform = true;
    if (this.patientForm.invalid) {
        return;
    } else {
        console.log(this.patientForm.value);
        this.patientService.addPatient(this.patientForm.value).subscribe(
            (data) => {
                console.log(data);
                // Affiche une alerte de succès
                Swal.fire({
                    icon: 'success',
                    title: 'Patient ajouté!',
                    text: 'Le patient a été ajouté avec succès.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Redirige vers la page des patients après la confirmation de l'alerte
                    this.router.navigate(['/patient']);
                });
            },
            (error) => {
                console.log(error);
                // Affiche une alerte d'erreur
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de l\'ajout du patient.',
                    confirmButtonText: 'OK'
                });
            }
        );
    }
}

    

  
  



}
