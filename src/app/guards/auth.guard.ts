import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    if (token && role) {
      return true; // Si l'utilisateur est authentifié, permet l'accès
    } else {
      this.router.navigate(['/login']); // Si non authentifié, redirige vers la page de login
      return false;
    }
  }
}
