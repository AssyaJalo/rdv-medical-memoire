import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordMedecinComponent } from './dashbord-medecin.component';

describe('DashbordMedecinComponent', () => {
  let component: DashbordMedecinComponent;
  let fixture: ComponentFixture<DashbordMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbordMedecinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
