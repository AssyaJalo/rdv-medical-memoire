import { Component } from '@angular/core';
import { Medecin } from '../model/medecin';
import { HttpClient } from '@angular/common/http';
import { MedecinService } from '../service/medecin.service';
import Swal from 'sweetalert2';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-medecin',
  templateUrl: './medecin.component.html',
  styleUrls: ['./medecin.component.css']
})
export class MedecinComponent {
  tabMedecin:Medecin[]= [];


  constructor(private httpClient : HttpClient,
    private medecinService : MedecinService,

){}
ngOnInit() {
  this.medecinService.getAllMedecin().subscribe(medecins => {
    // Utiliser un tableau de Promesses pour récupérer tous les assistants et spécialités
    const medecinRequests = medecins.map(medecin => {
      // Récupérer l'assistant
      const assistant$ = this.medecinService.getAssistantById(medecin.assistant_id).pipe(
        // Après avoir récupéré l'assistant, associer son nom et prénom au médecin
        tap(assistant => {
          medecin.assistant = assistant;
          if (assistant.user) {
            medecin.assistant_nom_prenom = `${assistant.user.prenom} ${assistant.user.nom}`;
          }
        })
      );

      // Récupérer la spécialité
      const specialite$ = this.medecinService.getSpecialiteName(medecin.specialite_id).pipe(
        // Après avoir récupéré la spécialité, l'associer au médecin
        tap(specialite => {
          medecin.specialite = specialite;
        })
      );

      // Retourner un tableau avec les deux observables pour chaque médecin
      return forkJoin([assistant$, specialite$]);
    });

    // Attendre que toutes les requêtes soient terminées
    forkJoin(medecinRequests).subscribe(() => {
      // Une fois que toutes les données sont récupérées et associées, mettre à jour la liste
      this.tabMedecin = medecins;
    });
  });
}


  getAllMedecin(){
    this.medecinService.getAllMedecin().subscribe(
      (data : Medecin[]) => {
        console.log('medecin reçus:', data); // Affichez les données complètes
        this.tabMedecin = data;

      },
      (error : any ) =>{
        console.error('Erreur lors de la récupération des medecins:', error);
      }
    );
  }
  deleteMedecin(id:any){
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
        this.medecinService.deleteMedecin(id).subscribe(
          ()=>{
                this.getAllMedecin();
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
