import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordAssistantComponent } from './dashbord-assistant.component';

describe('DashbordAssistantComponent', () => {
  let component: DashbordAssistantComponent;
  let fixture: ComponentFixture<DashbordAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbordAssistantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
