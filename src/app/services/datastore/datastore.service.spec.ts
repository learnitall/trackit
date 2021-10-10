import { TestBed } from '@angular/core/testing';

import { DataStoreService } from './datastore.service';

describe('DataStoreService', () => {
  let service: DataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
