import { Component, OnInit } from '@angular/core';
import { Assistant } from '../model/assistant';
import { HttpClient } from '@angular/common/http';
import { AssistantService } from '../service/assistant.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistantUpdate.component.html',
  styleUrls: ['./assistant.component.css']
})
export class AssistantUpdateComponent implements OnInit{
  isAddAssistantModalOpen = false;
  veriform = false;
  id : any;
  assistantForm = this.formBuilder.group({
          id: [''],
          nom: ['', Validators.required],
          prenom: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          telephone: ['', Validators.required],
          dateNaiss: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(8)]],
          password_confirmation: ['', Validators.required],
          role_id: [3]
      });


  constructor(private httpClient : HttpClient,
              private assistantService : AssistantService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,

  ){}
  ngOnInit(): void {
    if(this.route.snapshot.params['id']){
      this.id = this.route.snapshot.params['id'];
      this.assistantService.getAssistantById(this.id).subscribe(
          (data)=>
          {
              this.assistantForm.get('nom')?.setValue(""+data.user?.nom);
              this.assistantForm.get('prenom')?.setValue(""+data.user?.prenom);
              this.assistantForm.get('email')?.setValue(""+data.user?.email);
              this.assistantForm.get('telephone')?.setValue(""+data.user?.telephone);
              this.assistantForm.get('dateNaiss')?.setValue(""+data.user?.dateNaiss);
              this.assistantForm.get('password')?.setValue(""+data.user?.password);

          },
          (error)=>
          {
  
          }
      )

  }
    
  }

  AddAssistant(){
    this.veriform=true;
    if(this.assistantForm.invalid){
      return;
    }
    else{
      console.log(this.assistantForm.value)
      this.assistantService.addAssistant(this.assistantForm.value).subscribe(
          (data)=>{
              console.log(data);
              Swal.fire('Succès', 'assistant créé avec succès', 'success');
              this.router.navigate(['/dashbord']);
          },
      
      (error)=>{
          console.log(error);
      }
  )

  }
  }


  openAddAssistantModal(): void {
    this.isAddAssistantModalOpen = true;
  }

  // Méthode pour fermer la modal (si besoin)
  closeAddAssistantModal(): void {
    this.isAddAssistantModalOpen = false;
  }
}
