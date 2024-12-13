import { Component, OnInit } from '@angular/core';
import { Assistant } from '../model/assistant';
import { HttpClient } from '@angular/common/http';
import { AssistantService } from '../service/assistant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.css']
})
export class AssistantComponent implements OnInit{

  tabAssistant:Assistant[]= [];


  constructor(private httpClient : HttpClient,
              private assistantService : AssistantService,

  ){}
  ngOnInit(): void {
    this.getAllAssistant();
    
  }

  getAllAssistant(){
    this.assistantService.getAllAssistant().subscribe(
      (data : Assistant[]) => {
        console.log('assistant reçus:', data); // Affichez les données complètes
        this.tabAssistant = data;

      },
      (error : any ) =>{
        console.error('Erreur lors de la récupération des assistants:', error);
      }
    );
  }

  deleteAssistant(id:any){
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
        this.assistantService.deleteAssistant(id).subscribe(
          ()=>{
                this.getAllAssistant();
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
