import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { Patient } from '../model/patient';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit{
    

  tabPatient:Patient[]= [];


  constructor(private httpClient : HttpClient,
    private patientService : PatientService,

){}
  ngOnInit(): void {
    this.getAllPatient();
    
  }

  getAllPatient(){
    this.patientService.getAllPatient().subscribe(
      (data : Patient[]) => {
        console.log('patient reçus:', data); // Affichez les données complètes
        this.tabPatient = data;

      },
      (error : any ) =>{
        console.error('Erreur lors de la récupération des patients:', error);
      }
    );
  }

  deletePatient(id:any){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.deletePatient(id).subscribe(
          ()=>{
                this.getAllPatient();
          },
          ()=>{
    
          }
        )
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    })
  }



}
