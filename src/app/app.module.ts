import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { EditePatientComponent } from './patient/editPatient.component';
import { UpdatePatientComponent } from './patient/updatePatient.component';
import { EditeMedecinComponent } from './medecin/editMedecin.component';
import { MedecinUpdateComponent } from './medecin/medecinUpdate.component';
import { DisponibiliteComponent } from './disponibilite/disponibilite.component';
import { UpdateDisponibiliteComponent } from './disponibilite/updateDisponibilite.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RendezvousComponent } from './rendezvous/rendezvous.component';
import { UpdateRendezvousComponent } from './rendezvous/updateRDV.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RechercherComponent } from './rechercher/rechercher.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { DashbordMedecinComponent } from './dashbord-medecin/dashbord-medecin.component';
import { DashbordAssistantComponent } from './dashbord-assistant/dashbord-assistant.component';
import { DashbordPatientComponent } from './dashbord-patient/dashbord-patient.component';
import { IonicModule } from '@ionic/angular';
import { RdvComponent } from './rechercher/rdv.compnent';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCalendarBody } from '@angular/material/datepicker';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AssistantComponent,
    AssistantUpdateComponent,
    AssistantEditComponent,
    PatientComponent,
    MedecinComponent,
    SpecialiteComponent,
    SpecialiteUpadateComponent,
    EditeSpecialiteComponent,
    EditePatientComponent,
    UpdatePatientComponent,
    MedecinUpdateComponent,
    EditeMedecinComponent,
    DisponibiliteComponent,
    UpdateDisponibiliteComponent,
    RendezvousComponent,
    UpdateRendezvousComponent,
    DashbordComponent,
    RechercherComponent,
    AccessDeniedComponent,
    DashbordMedecinComponent,
    DashbordAssistantComponent,
    DashbordPatientComponent,
    RdvComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    NgbModalModule,
    IonicModule,
    CalendarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    CalendarModule,
  
    
  
  
    

    
  ],
  providers: [
    {
       provide: HTTP_INTERCEPTORS,
       useClass: AuthInterceptor, 
       multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
