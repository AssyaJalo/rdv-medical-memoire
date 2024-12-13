import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SpecialiteService } from '../service/specialite.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-specialite',
  templateUrl: './updateSpecialite.component.html',
  styleUrls: ['./specialite.component.css']
})
export class SpecialiteUpadateComponent implements OnInit {

    veriform = false;
    id : any; 
     specialiteForm = this.formBuilder.group ({
        id : [''],
        Nom_Specialite: ['', Validators.required],
        Experience_Specialite: ['', Validators.required]

     });

     constructor(private httpClient : HttpClient,
        private specialiteService : SpecialiteService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
     ){}
    ngOnInit(): void {

      if(this.route.snapshot.params['id']){
        this.id = this.route.snapshot.params['id'];
        this.specialiteService.getSpecialiteById(this.id).subscribe(
            (data)=>
            {
                this.specialiteForm.get('Nom_Specialite')?.setValue(""+data.Nom_Specialite);
                this.specialiteForm.get('Experience_Specialite')?.setValue(""+data.Experience_Specialite);
                
            },
            (error)=>
            {
    
            }
        )

    }
        
    }

    AddSpecialite(){
        this.veriform=true;
        if(this.specialiteForm.invalid){
          return;
        }
        else{
          console.log(this.specialiteForm.value)
          this.specialiteService.addSpecialite(this.specialiteForm.value).subscribe(
              (data)=>{
                  console.log(data);
                  this.router.navigate(['/specialite']);
              },
          
          (error)=>{
              console.log(error);
          }
      )
    
      }
      }

  



}
