import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../model/patient';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl = 'http://localhost:8000/api/patient';
  private apiUrl = 'http://localhost:8000/api/patient/info/{id}'; 

  constructor(private httpClient : HttpClient) { }


  getAllPatient(page: number = 1){
    return this.httpClient.get<Patient[]>("http://127.0.0.1:8000/api/patient");
  }
  
  addPatient(patient:any){
    return this.httpClient.post("http://127.0.0.1:8000/api/patient/",patient);
  }

  deletePatient(id:number){
    return this.httpClient.delete("http://127.0.0.1:8000/api/patient/"+id);
  }

  getPatientById(id: number) {
    return this.httpClient.get<Patient>(`http://127.0.0.1:8000/api/patient/${id}`);
  }

  updatePatient(id: any, patientData: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, patientData);
  }


  getPatientInfo(): Observable<{ nom: string; prenom: string }> {
    const token = localStorage.getItem('access_token'); // Récupérer le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.httpClient.get<{ nom: string; prenom: string }>(this.apiUrl, { headers });
  }
}
