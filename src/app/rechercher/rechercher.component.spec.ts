import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercherComponent } from './rechercher.component';

describe('RechercherComponent', () => {
  let component: RechercherComponent;
  let fixture: ComponentFixture<RechercherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechercherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechercherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
