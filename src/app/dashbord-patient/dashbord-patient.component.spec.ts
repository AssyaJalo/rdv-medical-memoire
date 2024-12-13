import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordPatientComponent } from './dashbord-patient.component';

describe('DashbordPatientComponent', () => {
  let component: DashbordPatientComponent;
  let fixture: ComponentFixture<DashbordPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbordPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
