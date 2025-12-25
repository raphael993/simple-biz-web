import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClientConfirmationDialogComponent } from './delete-client-confirmation-dialog-component';

describe('DeleteClientConfirmationDialogComponent', () => {
  let component: DeleteClientConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteClientConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteClientConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteClientConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
