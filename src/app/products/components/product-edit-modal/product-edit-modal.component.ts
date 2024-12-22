import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../shared/product.model';

@Component({
  selector: 'app-product-edit-modal',
  imports: [ReactiveFormsModule, NgbModule],
  templateUrl: './product-edit-modal.component.html',
  styleUrl: './product-edit-modal.component.scss'
})
export class ProductEditModalComponent {
  public activeModal = inject(NgbActiveModal);
  private formBuilder = inject(FormBuilder);

  public form = this.formBuilder.group({
    name: this.formBuilder.control<string>(null, Validators.required),
    cost: this.formBuilder.control<number>(null, Validators.required),
    category: this.formBuilder.control<string>(null, Validators.required),
    sku: this.formBuilder.control<string>(null, Validators.required),
    stockQuantity: this.formBuilder.control<number>(null, Validators.required),
    rating: this.formBuilder.control<number>(null, Validators.required),
    id: this.formBuilder.control<number>(null),
  });

  constructor() { }

  public initModal(product: Product): void {
    this.form.patchValue(product);
  }

  public get isEdit(): boolean {
    return !!this.form.value.id;
  }

  public onSubmit(): void {
    this.activeModal.close(this.form.value);
  }
}
