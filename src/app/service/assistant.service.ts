import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assistant } from '../model/assistant';
import { catchError, map, Observable, throwError } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssistantUpdateComponent } from '../assistant/assistantUpdate.component';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  private baseUrl = 'http://127.0.0.1:8000/api/assistant';
  private apiUrl = 'http://localhost:8000/api/assistant/info/{id}'; 

  constructor(private httpClient : HttpClient,
    private modalService: NgbModal
  ) { }


  openAssistantModal() {
    this.modalService.open(AssistantUpdateComponent);
  }

  getAllAssistant(page: number = 1){
    return this.httpClient.get<Assistant[]>("http://127.0.0.1:8000/api/assistant");
  }
  
  addAssistant(assistant:any){
    return this.httpClient.post("http://127.0.0.1:8000/api/assistant/",assistant);
  }

  getAssistantById(id: number) {
    return this.httpClient.get<Assistant>(`http://127.0.0.1:8000/api/assistant/${id}`);
  }
  updateAssistant(id: any, assistantData: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, assistantData);
  }
  

 


  deleteAssistant(id:number){
    return this.httpClient.delete("http://127.0.0.1:8000/api/assistant/"+id);
  }

  getAssistantInfo(): Observable<{ nom: string; prenom: string }> {
    const token = localStorage.getItem('access_token'); // Récupérer le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.httpClient.get<{ nom: string; prenom: string }>(this.apiUrl, { headers });
  }
}
