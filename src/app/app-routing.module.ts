import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AssistantComponent } from './assistant/assistant.component';
import { AssistantUpdateComponent } from './assistant/assistantUpdate.component';
import { AssistantEditComponent } from './assistant/edit_assistant.component';
import { PatientComponent } from './patient/patient.component';
import { MedecinComponent } from './medecin/medecin.component';
import { SpecialiteComponent } from './specialite/specialite.component';
import { SpecialiteUpadateComponent } from './specialite/updateSpecialite.component';
import { EditeSpecialiteComponent } from './specialite/editSpecialite.component';
import { UpdatePatientComponent } from './patient/updatePatient.component';
import { EditePatientComponent } from './patient/editPatient.component';
import { MedecinUpdateComponent } from './medecin/medecinUpdate.component';
import { EditeMedecinComponent } from './medecin/editMedecin.component';
import { DisponibiliteComponent } from './disponibilite/disponibilite.component';
import { UpdateDisponibiliteComponent } from './disponibilite/updateDisponibilite.component';
import { RendezvousComponent } from './rendezvous/rendezvous.component';
import { UpdateRendezvousComponent } from './rendezvous/updateRDV.component';
import { RechercherComponent } from './rechercher/rechercher.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AuthGuard } from './guards/auth.guard';
import { DashbordMedecinComponent } from './dashbord-medecin/dashbord-medecin.component';
import { MedecinGuard } from './guards/medecin.guard';
import { RoleGuard } from './guards/role.guard';
import { DashbordPatientComponent } from './dashbord-patient/dashbord-patient.component';
import { DashbordAssistantComponent } from './dashbord-assistant/dashbord-assistant.component';
import { RdvComponent } from './rechercher/rdv.compnent';


const routes: Routes = [
  // { path: '**', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashbord', component: DashbordComponent},
  { path: 'accueil', component: RechercherComponent,},
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'rdv', component: RdvComponent },


  // assistant
  { path: 'assistant', component: AssistantComponent },
  { path: 'addAssistant', component: AssistantUpdateComponent },
  { path: 'editAssistant/:id', component: AssistantEditComponent },
  { path: 'dashbord-assistant', component: DashbordAssistantComponent},


   // patient
  { path: 'patient', component: PatientComponent },
  { path: 'addPatient', component: UpdatePatientComponent },
  { path: 'editPatient/:id', component: EditePatientComponent },
  { path: 'dashbord-patient', component: DashbordPatientComponent },

  // medecin
  { path: 'medecin', component: MedecinComponent },
  { path: 'addMedecin', component: MedecinUpdateComponent },
  { path: 'editMedecin/:id', component: EditeMedecinComponent },
  { path: 'dashbord-medecin', component: DashbordMedecinComponent},

  // specialite
  { path: 'specialite', component: SpecialiteComponent },
  { path: 'addSpecialite', component: SpecialiteUpadateComponent },
  { path: 'editSpecialite/:id', component: EditeSpecialiteComponent },

  // disponibilite
  { path: 'disponibilite', component: DisponibiliteComponent },
  { path: 'addDisponibilite', component: UpdateDisponibiliteComponent },

  // rendez vous
  { path: 'rendezvous', component: RendezvousComponent },
  { path: 'addRDV', component: UpdateRendezvousComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
