import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import { FilterProduct } from '../../../../interfaces/product.interface';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-product-filter-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule
  ],
  templateUrl: './product-filter-component.html',
  styleUrl: './product-filter-component.scss',
})
export class ProductFilterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  public filterForm!: FormGroup;

  public ngOnInit(): void {
    this.createFilterForm();
    this.subscribeToFilterChanges();
  }

  public createFilterForm() {
    this.filterForm = this.fb.group({
      stockRange: [null],
      type: [null],
      isActive: [null]
    });
  }

  public subscribeToFilterChanges() {
    this.filterForm.valueChanges.subscribe((filters: FilterProduct) => {
      this.productService.filterChange.set(filters);
    });
  }

  public clearFilters(): void {
    this.filterForm.reset({
      stockRange: null,
      type: null,
      isActive: null,
      clear: false
    });
    this.productService.filterChange.set({ clear: true });
  }
}
