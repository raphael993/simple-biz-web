import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHistoryTableComponent } from './sales-history-table-component';

describe('SalesHistoryTableComponent', () => {
  let component: SalesHistoryTableComponent;
  let fixture: ComponentFixture<SalesHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesHistoryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
