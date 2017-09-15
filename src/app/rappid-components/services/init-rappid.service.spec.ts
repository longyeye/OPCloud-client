import { TestBed, inject } from '@angular/core/testing';

import { InitRappidService } from './init-rappid.service';

describe('InitRappidService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitRappidService]
    });
  });

  it('should be created', inject([InitRappidService], (service: InitRappidService) => {
    expect(service).toBeTruthy();
  }));
});
