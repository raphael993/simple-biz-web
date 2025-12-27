import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../interfaces/product.interface';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-edit-product-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxCurrencyDirective
  ],
  templateUrl: './edit-product-component.html',
  styleUrl: './edit-product-component.scss',
})
export class EditProductComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  public productForm!: FormGroup;
  public selectedProduct = this.productService.selectedProduct;
  public cancel = output();
  public save = output<Product>();

  public ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.productForm = this.fb.group({
      id: [this.selectedProduct()?.id],
      name: [this.selectedProduct()?.name, [Validators.required, Validators.minLength(3)]],
      description: [this.selectedProduct()?.description],
      costPrice: [this.selectedProduct()?.costPrice],
      price: [this.selectedProduct()?.price, [Validators.required]],
      type: [this.selectedProduct()?.type, [Validators.required]],
      isActive: [this.selectedProduct()?.isActive, [Validators.required]],
      quantity: [this.selectedProduct()?.quantity],
      createAt: [this.selectedProduct()?.createAt]
    });
  }

  public editProductAction() {
    if (!this.productForm.valid) {
      return;
    }
    const payload: Product = this.productForm.getRawValue();
    this.save.emit(payload);
  }

  public cancelAction() {
    this.cancel.emit();
  }
}
