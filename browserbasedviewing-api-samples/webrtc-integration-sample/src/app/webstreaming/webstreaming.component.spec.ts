import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebstreamingComponent } from './webstreaming.component';

describe('WebstreamingComponent', () => {
  let component: WebstreamingComponent;
  let fixture: ComponentFixture<WebstreamingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebstreamingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebstreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
