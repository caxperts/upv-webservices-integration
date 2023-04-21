import { TestBed } from '@angular/core/testing';

import { WebstreamingCreatorService } from './webstreaming-creator.service';

describe('WebstreamingCreatorService', () => {
  let service: WebstreamingCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebstreamingCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
