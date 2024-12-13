import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RendezVous } from '../model/rendez-vous';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {

  private baseUrl = "http://127.0.0.1:8000/api/rendezvous";
  private api = "http://127.0.0.1:8000/api";
  private errorMessage = '';

  constructor(private httpClient : HttpClient) { }


  getAllRDV(page: number = 1){
    return this.httpClient.get<RendezVous[]>("http://127.0.0.1:8000/api/rendez-vous");
  }

  addRDV(rdv:any){
    return this.httpClient.post("http://127.0.0.1:8000/api/rendezvous/",rdv);
  }

  deleteRDV(id:number){
    return this.httpClient.delete("http://127.0.0.1:8000/api/rendezvous"+id);
  }

  getRDVById(id: number) {
    return this.httpClient.get<RendezVous>(`http://127.0.0.1:8000/api/rendezvous/${id}`);
  }

  updateRDV(id: any, rdvData: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, rdvData);
  }

  getRendezvousByMedecin(medecinId: number): Observable<RendezVous[]> {
    return this.httpClient.get<RendezVous[]>(`http://127.0.0.1:8000/api/medecins/${medecinId}/rendezvous`);
  }

  getRendezvousByPatient(patientId: number): Observable<RendezVous[]> {
    const token = localStorage.getItem('auth_token');

    // Définir les en-têtes avec le token d'authentification
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<RendezVous[]>(`http://127.0.0.1:8000/api/patients/${patientId}/rendezvous`, {headers});
  }

  


getRendezvousForAssistant(assistantId: number): Observable<RendezVous[]> {
  return this.httpClient.get<RendezVous[]>(`http://127.0.0.1:8000/api/assistant/${assistantId}/rendezvous`);
}

prendreRendezVous(rdvData: any): Observable<any> {
  const token = localStorage.getItem('token');
  
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.httpClient.post<any>('http://localhost:8000/api/rendezvous', rdvData, { headers });
}
validateRdv(rdvId: number): Observable<any> {
  return this.httpClient.post<any>(`${this.api}/validate-rdv`, { id: rdvId });
}
annulerRdv(rdvId: number): Observable<any> {
  return this.httpClient.post<any>(`${this.api}/annuler-rdv`, { id: rdvId });
}
reporterRdv(rdvId: number): Observable<any> {
  return this.httpClient.post<any>(`${this.api}/reporter-rdv`, { id: rdvId });
}

getRendezvousByAssistant(assistantId: number): Observable<any> {
  const token = localStorage.getItem('token'); // Récupérer le token JWT
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.httpClient.get<any>(`http://localhost:8000/api/assistant/rendezvous/${assistantId}`, { headers });
}



  
}
