import { TestBed } from '@angular/core/testing';

import { BackendGhService } from './backend-gh.service';

describe('BackendGhService', () => {
  let service: BackendGhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendGhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
