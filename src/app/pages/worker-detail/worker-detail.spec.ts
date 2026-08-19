import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDetail } from './worker-detail';

describe('WorkerDetail', () => {
  let component: WorkerDetail;
  let fixture: ComponentFixture<WorkerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
