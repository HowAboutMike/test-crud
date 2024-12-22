import { Component, inject, OnInit } from '@angular/core';
import { ProductsTableComponent } from './components/products-table/products-table.component';
import { ProductEditModalComponent } from './components/product-edit-modal/product-edit-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from './shared/product.model';
import { Store } from '@ngrx/store';
import { ProductsActions } from './state/product.actions';

@Component({
  selector: 'app-products',
  imports: [ProductsTableComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private modalService = inject(NgbModal);
  private store = inject(Store);

  public ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadProducts())
  }

  public createProduct(): void {
    const modalRef = this.modalService.open(ProductEditModalComponent);
    modalRef.result.then((product: Product) => {
      if (!product) return;
      this.store.dispatch(ProductsActions.createProduct({ product }))
    });
  }
}
