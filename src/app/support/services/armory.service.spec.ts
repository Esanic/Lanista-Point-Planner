import { TestBed } from '@angular/core/testing';

import { ArmoryService } from './armory.service';

describe('ArmoryService', () => {
  let service: ArmoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArmoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
