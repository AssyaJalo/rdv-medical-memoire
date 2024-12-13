import { Component } from '@angular/core';
import { Specialite } from '../model/specialite';
import { SpecialiteService } from '../service/specialite.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-specialite',
  templateUrl: './specialite.component.html',
  styleUrls: ['./specialite.component.css']
})
export class SpecialiteComponent {
  tabSpecialite:Specialite[]= [];


  constructor(private httpClient : HttpClient,
    private specialiteService : SpecialiteService,

){}
  ngOnInit(): void {
    this.getAllSpecialite();
    
  }

  getAllSpecialite(){
    this.specialiteService.getAllSpecialite().subscribe(
      (data : Specialite[]) => {
        console.log('Specialite reçus:', data); // Affichez les données complètes
        this.tabSpecialite = data;

      },
      (error : any ) =>{
        console.error('Erreur lors de la récupération des Specialite:', error);
      }
    );
  }

  deleteSpecialite(id:any){
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
        this.specialiteService.deleteSpecialite(id).subscribe(
          ()=>{
                this.getAllSpecialite();
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
