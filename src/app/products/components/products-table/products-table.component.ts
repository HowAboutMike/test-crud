import { Component, inject } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../shared/product.model';
import { ProductEditModalComponent } from '../product-edit-modal/product-edit-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { Store } from '@ngrx/store';
import { ProductsActions } from '../../state/product.actions';
import { productSelectors } from '../../state/product.reducer';
import { PushPipe } from '@ngrx/component';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-products-table',
  imports: [
    CommonModule,
    NgbDropdownModule,
    PushPipe,
  ],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent {
  private modalService = inject(NgbModal);
  private store = inject(Store);

  public products$ = this.store.select(productSelectors.selectAll);

  constructor() { }

  public editProduct(product: Product): void {
    const modalRef = this.modalService.open(ProductEditModalComponent);
    (modalRef.componentInstance as ProductEditModalComponent).initModal(product);
    modalRef.result.then((product: Product) => {
      if (!product) return;
      this.store.dispatch(ProductsActions.updateProduct({ product }))
    });
  }

  public deleteProduct(productId: number): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    (modalRef.componentInstance as ConfirmModalComponent).message = 'Are you sure about this?';
    modalRef.result.then((res) => {
      if (!res) return;
      this.store.dispatch(ProductsActions.deleteProduct({ productId }))
    })
  }
}
