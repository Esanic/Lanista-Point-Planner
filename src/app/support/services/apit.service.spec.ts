import { TestBed } from '@angular/core/testing';

import { ApitService } from './apit.service';

describe('ApitService', () => {
  let service: ApitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
