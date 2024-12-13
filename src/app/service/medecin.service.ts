import { Injectable } from '@angular/core';
import { Medecin } from '../model/medecin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Assistant } from '../model/assistant';
import { Specialite } from '../model/specialite';
import { User } from '../model/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MedecinUpdateComponent } from '../medecin/medecinUpdate.component';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private bpiUrl = 'http://localhost:8000/api/medecins/recherche';
  private  baseUrl = "http://127.0.0.1:8000/api/medecin";
 private apiUrl = "http://127.0.0.1:8000/api" ;
 private aiUrl = 'http://localhost:8000/api/medecin/info/{id}';
 private aUrl = 'http://127.0.0.1:8000/api/medecins/stats';
 ;
  constructor(private httpClient : HttpClient,
    private modalService: NgbModal
  ) { }



  openModal(content: any): void {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  openMedecinModal() {
    this.modalService.open(MedecinUpdateComponent);
  }

  
  getAllMedecin(page: number = 1){
    return this.httpClient.get<Medecin[]>("http://127.0.0.1:8000/api/medecin");
  }
  
  addMedecin(data: FormData): Observable<any>{
    return this.httpClient.post("http://127.0.0.1:8000/api/medecin/",data);
  }

  deleteMedecin(id:number){
    return this.httpClient.delete("http://127.0.0.1:8000/api/medecin/"+id);
  }

  getMedecinById(id:number):Observable<Medecin>{
    return this.httpClient.get<Medecin>("http://127.0.0.1:8000/api/medecin/"+id);
  }
  checkEmailUnique(email: string) {
    return this.httpClient.get<{ unique: boolean }>(`${this.baseUrl}/check-email?email=${email}`);
  }

  // Méthode pour vérifier si l'assistant est déjà assigné
  checkAssistantAssigned(assistant_id: number) {
    return this.httpClient.get<{ assigned: boolean }>(`${this.baseUrl}/check-assistant?assistant_id=${assistant_id}`);
  }

  updateMedecin(id: any, medecinData: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, medecinData);
  }

  getAssistantById(assistantId: number): Observable<Assistant> {
    return this.httpClient.get<Assistant>(`${this.apiUrl}/assistant/${assistantId}`);
  }


  getSpecialiteName(specialiteId: number): Observable<{ Nom_Specialite: string }> {
    return this.httpClient.get<{ Nom_Specialite: string }>(`${this.apiUrl}/specialite/${specialiteId}`);
  }

  rechercherMedecin(query: string): Observable<any> {
    return this.httpClient.get(`${this.bpiUrl}?query=${query}`);
  }

  getDoctorId(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/doctorId`);
  }
  getMedecinInfo(id: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/medecin/${id}`);
  }
  

  getMedecinId(): Observable<any> {
    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.httpClient.get<any>('http://localhost:8000/api/medecin/medecinId', { headers });
  }
  
  
  getdoctorInfo(): Observable<{ nom: string; prenom: string }> {
    const token = localStorage.getItem('access_token'); // Récupérer le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.httpClient.get<{ nom: string; prenom: string }>(this.aiUrl, { headers });
  }


  getMedecinsStats(): Observable<any> {
    return this.httpClient.get(this.aUrl);
  }
}


  

