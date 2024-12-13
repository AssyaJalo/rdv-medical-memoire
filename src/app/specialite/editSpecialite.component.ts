import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SpecialiteService } from '../service/specialite.service';

@Component({
  selector: 'app-specialite',
  templateUrl: './editSpecialite.component.html',
  styleUrls: ['./specialite.component.css']
})
export class EditeSpecialiteComponent implements OnInit {

  veriform = false;
  id: any;
  
  specialiteForm = this.formBuilder.group({
    id: [''],
    Nom_Specialite: ['', Validators.required],
    Experience_Specialite: ['', Validators.required]
  });

  constructor(
    private httpClient: HttpClient,
    private specialiteService: SpecialiteService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.specialiteService.getSpecialiteById(this.id).subscribe(
        (data) => {
          this.specialiteForm.patchValue({
            id: this.id,
            Nom_Specialite: data.Nom_Specialite,
            Experience_Specialite: data.Experience_Specialite
          });
        },
        (error) => {
          console.error('Error fetching specialite:', error);
        }
      );
    }
  }

  EditSpecialite() {
    this.veriform = true;
    if (this.specialiteForm.invalid) {
      return;
    }

    const specialiteData = { id: this.id, ...this.specialiteForm.value };
    
    this.specialiteService.updateSpecialite(specialiteData).subscribe(
      (data) => {
        console.log('Specialite updated:', data);
        this.router.navigate(['/specialite']);
      },
      (error) => {
        console.error('Error updating specialite:', error);
      }
    );
  }
}
