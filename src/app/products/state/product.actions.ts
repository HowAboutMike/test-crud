import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Update, EntityMap, EntityMapOne, Predicate } from '@ngrx/entity';
import { Product } from '../shared/product.model';


export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: HttpErrorResponse }>(),

    'Create Product': props<{ product: Omit<Product, 'id'> }>(),
    'Create Product Success': props<{ product: Product }>(),
    'Create Product Failure': props<{ error: HttpErrorResponse }>(),

    'Update Product': props<{ product: Product }>(),
    'Update Product Success': props<{ product: Product }>(),
    'Update Product Failure': props<{ error: HttpErrorResponse }>(),

    'Delete Product': props<{ productId: number }>(),
    'Delete Product Success': props<{ product: Product }>(),
    'Delete Product Failure': props<{ error: HttpErrorResponse }>(),
  }
});
