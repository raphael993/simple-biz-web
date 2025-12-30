import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SaleService } from '../../../../services/sale.service';
import { FilterSale } from '../../../../interfaces/sale.interface';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-history-filter-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './history-filter-component.html',
  styleUrl: './history-filter-component.scss',
})
export class HistoryFilterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly saleService = inject(SaleService);
  public filterForm!: FormGroup;

  public ngOnInit(): void {
    this.createFilterForm();
    this.subscribeToFilterChanges();
  }

  public createFilterForm() {
    this.filterForm = this.fb.group({
      startDate: null,
      endDate: null
    });
  }

  public subscribeToFilterChanges() {
    this.filterForm.valueChanges.subscribe((filters: FilterSale) => {
      this.saleService.filterChange.set(filters);
    });
  }

  public clearFilters(): void {
    this.filterForm.reset({
      startDate: null,
      endDate: null
    });
    this.saleService.filterChange.set({ clear: true });
  }
}
