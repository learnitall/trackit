import { TestBed } from '@angular/core/testing';

import { DataStoreGHService } from './datastore-gh.service';

describe('DataStoreGHService', () => {
  let service: DataStoreGHService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataStoreGHService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
