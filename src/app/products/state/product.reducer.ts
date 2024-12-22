import { createReducer, createSelector, on } from '@ngrx/store';
import { ProductsActions } from './product.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../shared/product.model';

export const PRODUCTS_FEATURE_KEY = 'products';

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

export const initialProductsState: EntityState<Product> = adapter.getInitialState();

export const productsReducer = createReducer(
  initialProductsState,
  on(ProductsActions.createProductSuccess, (state, { product }) => adapter.addOne(product, state)),
  on(ProductsActions.loadProductsSuccess, (state, { products }) => adapter.setAll(products, state)),
  on(ProductsActions.updateProductSuccess, (state, { product }) => adapter.setOne(product, state)),
  on(ProductsActions.deleteProductSuccess, (state, { product: { id } }) => adapter.removeOne(id, state)),
)


export const productSelectors = adapter.getSelectors((state: any) => state[PRODUCTS_FEATURE_KEY]);

export const selectMaxId = createSelector(productSelectors.selectIds, (ids) => Math.max(...ids.map(i => +i)));

