import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ProductsActions } from './product.actions';
import { ProductsService } from '../shared/products.service';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productsService = inject(ProductsService);

  createProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsActions.createProduct),
      switchMap(({ product }) => this.productsService.createProduct(product).pipe(
        map(product => ProductsActions.createProductSuccess({ product })),
        catchError((e) => of(ProductsActions.createProductFailure(e))),
      )),
    );
  });

  getProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(() => this.productsService.getProducts().pipe(
        map(products => ProductsActions.loadProductsSuccess({ products })),
        catchError((e) => of(ProductsActions.loadProductsFailure(e))),
      )),
    );
  });

  deleteProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsActions.deleteProduct),
      switchMap(({ productId }) => this.productsService.deleteProduct(productId).pipe(
        map(product => ProductsActions.deleteProductSuccess({ product })),
        catchError((e) => { console.log(e); return of(ProductsActions.deleteProductFailure(e)) }),
      )),
    );
  });

  updateProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsActions.updateProduct),
      switchMap(({ product }) => this.productsService.updateProduct(product).pipe(
        map((product) => ProductsActions.updateProductSuccess({ product })),
        catchError((e) => of(ProductsActions.updateProductFailure(e))),
      )),
    );
  });
}