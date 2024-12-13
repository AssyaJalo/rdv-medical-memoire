import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpecialiteService } from './service/specialite.service';
import { Specialite } from './model/specialite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Memoire_Angular';
  tabSpecialite: Specialite[] = [
    
    {
      id: 1, 
      Nom_Specialite: 'Gynécologie', 
      Experience_Specialite:'',
      imageUrl: 'assets/images/gg.jpeg' 
    }
    ,
    { 
      id: 2, 
      Nom_Specialite: 'Pédiatrie', 
      Experience_Specialite:'',
      imageUrl: 'assets/images/pp.png' 
    },
    { 
      id: 3, 
      Nom_Specialite: 'Radiothérapie', 
      Experience_Specialite:'',
      imageUrl: 'assets/images/rr.jpg' 
    },
    { 
      id: 4, 
      Nom_Specialite: 'Chirurgie générale', 
      Experience_Specialite:'',
      imageUrl: 'assets/images/cc.jpg' 
    },
    { 
      id: 5, 
      Nom_Specialite: 'Labo Hématologie', 
      Experience_Specialite:'',
      imageUrl: 'assets/images/hh.jpeg' 
    },
    { 
      id: 6, 
      Nom_Specialite: 'Médecine Interne', 
      Experience_Specialite:'',
      imageUrl: 'assets/images/ii.jpeg' 
    },
  
  ];
  currentPage: number = 1;
  totalPages: number = 0;
  isAuthPage: boolean = false;
  showNavbar: boolean = true;
  isSectionVisible: boolean = false;
  constructor(private router: Router,
    private httpClient : HttpClient,
    private specialiteService : SpecialiteService,
  ) {
    // Écouter les changements de route
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      // Vérifier si l'utilisateur est sur /login ou /register
      this.isAuthPage = currentUrl === '/login' || currentUrl === '/register' ;
      this.showNavbar = currentUrl !=='/dashbord'  && 
      currentUrl !=='/assistant' && 
      currentUrl !== '/addAssistant' && 
      currentUrl !== '/patient' && 
      currentUrl !== '/medecin' && 
      currentUrl !== '/specialite' && 
      currentUrl !== '/addSpecialite' && 
      currentUrl !== '/addPatient' &&
      currentUrl !== '/addMedecin' &&
      currentUrl !== '/disponibilite' &&
      currentUrl !== '/addDisponibilite' &&
      currentUrl !== '/rendezvous' &&
      currentUrl !== '/addRDV' &&
      currentUrl !== '/accueil' &&
      currentUrl !== '/dashbord-medecin' &&
      currentUrl !== '/dashbord-assistant' &&
      currentUrl !== '/dashbord-patient' &&
      currentUrl !== '/rdv' &&
      !currentUrl.includes('/editAssistant') &&
      !currentUrl.includes('/editSpecialite') && 
      !currentUrl.includes('/editMedecin') && 
      !currentUrl.includes('/editPatient')
      ;
      

      
    });
  }
  ngOnInit(): void {
    
  }

 
}
