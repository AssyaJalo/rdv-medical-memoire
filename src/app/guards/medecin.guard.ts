import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MedecinGuard implements CanActivate {
  constructor( private authService: AuthService, 
    private router: Router){}
  
  
    canActivate(): boolean {
      if (this.authService.isMedecin()) {
        return true;
      }
      this.router.navigate(['/access-denied']); // Redirection si accès refusé
      return false;
    }
}
