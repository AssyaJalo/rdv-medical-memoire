import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Specialite } from '../model/specialite';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialiteService {
  private baseUrl = "http://127.0.0.1:8000/api/specialite";
  constructor(private httpClient : HttpClient) { }


  getAllSpecialite(): Observable<any> {
    return this.httpClient.get<any>("http://127.0.0.1:8000/api/specialite");
  }
  
  addSpecialite(specialite:any){
    return this.httpClient.post("http://127.0.0.1:8000/api/specialite/",specialite);
  }

  getSpecialiteById(id:number):Observable<Specialite>{
    return this.httpClient.get<Specialite>("http://127.0.0.1:8000/api/specialite/"+id);
  }

  updateSpecialite(specialite: any) {
    return this.httpClient.put(`http://127.0.0.1:8000/api/specialite/${specialite.id}`, specialite);
  }
  
  deleteSpecialite(id:number){
    return this.httpClient.delete("http://127.0.0.1:8000/api/specialite/"+id);
  }
  
  
}
