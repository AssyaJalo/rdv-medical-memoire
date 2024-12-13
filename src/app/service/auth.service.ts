import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Assistant } from '../model/assistant';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: string = '';
  private apiUrl = 'http://127.0.0.1:8000/api'; // Your API URL
 

  constructor(private http: HttpClient,
    
    private route: ActivatedRoute,
    public router: Router
  ) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // login(credentials: { email: string; password: string }): Observable<any> {
  //   return this.http.post<any>('http://localhost:8000/api/login', credentials).pipe(
  //     tap((response) => {
  //       console.log('Réponse reçue du backend:', response); // Ajoutez un log pour vérifier la réponse
  //       if (response && response.access_token) {
  //         this.saveToken(response.access_token);
  //         localStorage.setItem('userRole', response.role);  // Enregistrer le rôle de l'utilisateur
  //         localStorage.setItem('userDetails', JSON.stringify(response.user || {}));  // Enregistrer les détails de l'utilisateur (optionnel)
         
  //       }
  //     }),
  //     catchError((err) => {
  //       console.error('Erreur:', err);  // Log des erreurs si nécessaire
  //       return throwError(err);
  //     })
  //   );
  // }
  
  
  
  
  
  
  getUserRole(): number {
    return Number(localStorage.getItem('userRole'));
  }
  
  
  getUserId(): Observable<any> {
    const token = this.getToken(); // Récupérer le token d'authentification
    return this.http.get('http://127.0.0.1:8000/api/user', {
      headers: {
        Authorization: `Bearer ${token}` // Ajouter le token dans les en-têtes
      }
    });
  }

  
  isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

 
  
  

  logout(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        this.removeToken();
        localStorage.removeItem('role_id'); // Remove role on logout
      })
    );
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }



  

  removeToken(): void {
    localStorage.removeItem('access_token');
  }

  


  isAdmin(): boolean {
    const role = this.getUserRole();
    const isAdmin = role === 1;
    console.log('User Role in isAdmin:', role); // Debugging
    console.log('Is Manager:', isAdmin); // Debugging
    return isAdmin;
  }

  isMedecin(): boolean {
    const role = this.getUserRole();
    const isMedecin = role === 2;
    console.log('User Role in isMedecin:', role); // Debugging
    console.log('Is Medecin:',  isMedecin); // Debugging
    return isMedecin;
  }

  isAssistant(): boolean {
    const role = this.getUserRole();
    const isAssistant = role === 3;
    console.log('User Role in isAssistant:', role); // Debugging
    console.log('Is assistant:', isAssistant); // Debugging
    return isAssistant;
  }
  isPatient(): boolean {
    const role = this.getUserRole();
    const isPatient = role === 4;
    console.log('User Role in isPatient:', role); // Debugging
    console.log('Is patient:', isPatient); // Debugging
    return isPatient;
  }

 
  AssistantId(): number {
    const user = this.getUser();  // Vous récupérez l'utilisateur connecté
    console.log('Utilisateur connecté:', user);  // Vérifiez ici que vous obtenez l'utilisateur
    if (user && user.role_id === 3) {  // Vérifiez que l'utilisateur a bien le rôle "assistant"
      return user.id;  // Retourne l'ID de l'assistant
    } else {
      return 0;  // Si l'utilisateur n'est pas un assistant, retournez 0
    }
  }
  private getUser(): any {
    // Implémentation pour récupérer les informations de l'utilisateur connecté, par exemple depuis le localStorage ou un token
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

getAssistantId(): Observable<any> {
  const token = localStorage.getItem('access_token');

  if (!token) {
    console.error('Token non trouvé dans localStorage');
    return throwError(() => new Error('Token non trouvé'));
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any>(`${this.apiUrl}/assistantId`, { headers }).pipe(
    catchError((error) => {
      console.error('Erreur lors de la récupération de l\'assistant ID:', error);
      return throwError(() => error);
    })
  );
}

getUserDetails(): any {
  const userDetails = localStorage.getItem('userDetails');
  return userDetails ? JSON.parse(userDetails) : null;
}
login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post<any>('http://localhost:8000/api/login', credentials).pipe(
    tap((response) => {
      console.log('Réponse reçue du backend:', response);

      // Vérifiez si les données attendues sont présentes dans la réponse
      if (response && response.access_token && response.role && response.user) {
        this.saveToken(response.access_token);
        localStorage.setItem('userRole', response.role);  
        localStorage.setItem('userDetails', JSON.stringify(response.user)); 
      } else {
        console.error('Réponse invalide : données manquantes.');
      }
    }),
    catchError((err) => {
      console.error('Erreur lors de la connexion:', err.message || err);
      alert('Connexion échouée. Veuillez vérifier vos identifiants.');
      return throwError(err);
    })
  );
}







  
  
  
  
  

}
