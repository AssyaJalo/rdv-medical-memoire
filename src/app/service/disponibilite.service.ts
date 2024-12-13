import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Disponibilite } from '../model/disponibilite';
import { Observable } from 'rxjs';
import { Medecin } from '../model/medecin';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateDisponibiliteComponent } from '../disponibilite/updateDisponibilite.component';


@Injectable({
  providedIn: 'root'
})
export class DisponibiliteService {
 private baseUrl = "http://127.0.0.1:8000/api/agenda";
 private apiUrl = "http://127.0.0.1:8000/api";
 private url = "http://127.0.0.1:8000/api/medecin";
  constructor(private httpClient : HttpClient,
    private modalService: NgbModal,
    
  ) { }

  getAllDisponibilite(page: number = 1){
    return this.httpClient.get<Disponibilite[]>("http://127.0.0.1:8000/api/agenda");
  }
  openDisponibiliteModal() {
    this.modalService.open(UpdateDisponibiliteComponent);
  }
  addDisponibilite(disponibilite:any){
    const token = localStorage.getItem('auth_token');

    // Définir les en-têtes avec le token d'authentification
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.post("http://127.0.0.1:8000/api/agenda/",disponibilite,{headers});
  }

  deleteDisponibilite(id:number){
    return this.httpClient.delete("http://127.0.0.1:8000/api/agenda"+id);
  }

  getDisponibiliteById(id: number) {
    return this.httpClient.get<Disponibilite>(`http://127.0.0.1:8000/api/agenda/${id}`);
  }

  updateDisponibilite(id: any, disponibiliteData: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, disponibiliteData);
  }

  getMedecinById(medecinId: number): Observable<Medecin> {
    return this.httpClient.get<Medecin>(`${this.apiUrl}/medecin/${medecinId}`);
  }


  getMedecins(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url);  // Adjust the type if needed
  }
}
