import { TestBed } from '@angular/core/testing';

import { MedecinGuard } from './medecin.guard';

describe('MedecinGuard', () => {
  let guard: MedecinGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MedecinGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
