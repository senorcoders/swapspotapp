import { TestBed } from '@angular/core/testing';

import { StorageproviderService } from './storageprovider.service';

describe('StorageproviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageproviderService = TestBed.get(StorageproviderService);
    expect(service).toBeTruthy();
  });
});
