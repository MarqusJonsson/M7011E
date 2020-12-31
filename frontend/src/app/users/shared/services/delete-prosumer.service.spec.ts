import { TestBed } from '@angular/core/testing';

import { DeleteProsumerService } from './delete-prosumer.service';

describe('DeleteProsumerService', () => {
  let service: DeleteProsumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteProsumerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
