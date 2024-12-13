import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  user = {
    email: '',
    password: ''
  };
  loginForm: FormGroup;
  veriform = false;
  errorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit(){
    const token = localStorage.getItem('token');
    if (!token) {
    this.router.navigate(['/login']);
    
    
  }
}

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = "Veuillez remplir correctement le formulaire.";
      return;
    }
  
    const credentials = this.loginForm.value; // Extraire les données du formulaire
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response);
  
        // Vérifiez que le token est dans la réponse
        if (response.access_token) {
          localStorage.setItem('token', response.access_token); // Sauvegarder le token
          console.log('Token sauvegardé dans localStorage');
  
          const role = response.role; // Récupérer le rôle utilisateur
          this.redirectUser(role); // Rediriger en fonction du rôle
        } else {
          console.error('Aucun token trouvé dans la réponse du serveur');
          this.errorMessage = "Erreur : Aucun token trouvé.";
        }
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
  
        if (err.status === 0) {
          // Erreur réseau, le backend est inaccessible
          this.errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.';
        } else if (err.status === 403) {
          // Erreur de droits (ex. : mauvaise combinaison email/mot de passe)
          this.errorMessage = 'Email ou mot de passe invalide.';
        } else {
          // Autres erreurs
          this.errorMessage = 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.';
        }
      }
    });
  }
  
  
  

  redirectUser(role: number) {
    console.log('Rôle utilisateur:', role);
  
    switch (role) {
      case 1:
        this.router.navigate(['/dashbord']);
        break;
      case 2:
        this.router.navigate(['/dashbord-medecin']);
        break;
      case 3:
        this.router.navigate(['/dashbord-assistant']);
        break;
      case 4:
        this.router.navigate(['/accueil']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
  
  
  
  
}
  
  
  
  
  
  
  
  
  


