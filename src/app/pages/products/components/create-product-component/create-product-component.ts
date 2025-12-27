import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../interfaces/product.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-create-product-component',
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
  templateUrl: './create-product-component.html',
  styleUrl: './create-product-component.scss',
})
export class CreateProductComponent {
  private readonly fb = inject(FormBuilder);
  public showProductForm = output<boolean>(); 
  public createProduct = output<Product>();

  public productForm!: FormGroup;
  public isProduct = signal<boolean>(true);

  public ngOnInit(): void {
    this.createForm();
    this.subscribeTochangeType();
  }

  public subscribeTochangeType() {
    this.productForm.get('type')?.valueChanges.subscribe((data: any) => {
      this.isProduct.set(data === 'product');
    })
  }

  private createForm(): void {
    this.productForm = this.fb.group({
      id: [crypto.randomUUID()],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null],
      costPrice: [null],
      price: [null, [Validators.required]],
      type: ['product', [Validators.required]],
      isActive: [true, [Validators.required]],
      quantity: [null],
      createAt: [new Date()],
    });
  }

  public createProductAction() {
    if (!this.productForm.valid) {
      return;
    }
    const payload: Product = this.productForm.getRawValue();
    this.createProduct.emit(payload);
    this.showProductForm.emit(false);
  }

  public clearForm() {
    this.productForm.reset();
  }
}
