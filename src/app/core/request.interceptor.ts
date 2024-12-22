import { HttpErrorResponse, HttpInterceptorFn, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { filter, map, of, take } from 'rxjs';
import { PRODUCTS } from '../shared/consts/mocks';
import { Product } from '../products/shared/product.model';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { productSelectors, selectMaxId } from '../products/state/product.reducer';

const validator = (obj: object, classToCompare: any, keysToOmit: string[] = []): boolean => {
  const modelKeys = Object.keys(new classToCompare()).filter(i => !keysToOmit.includes(i));
  const objKeys = Object.keys(obj);
  return modelKeys.every(i => objKeys.includes(i));
};

export const requestInterceptor: HttpInterceptorFn = (req, next) => {

  const store = inject(Store);

  const isGeneralProductsApiCall = req.url === 'api/products';

  if (isGeneralProductsApiCall && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: PRODUCTS }));
  }

  if (isGeneralProductsApiCall && req.method === 'POST') {
    const body = req.body as object;
    const isValid = validator(body, Product, ['id'])

    if (isValid) {
      return store.select(selectMaxId)
        .pipe(
          take(1),
          map(id => new HttpResponse({ status: HttpStatusCode.Ok, body: { ...body, id: id + 1 } }))
        );
    } else {
      throw new HttpErrorResponse({ status: HttpStatusCode.BadRequest })
    }
  }

  const isSpecificProductRequest = req.url.match(/api\/products\/\d+/);

  if (isSpecificProductRequest) {
    const productId = +req.url.split('/').pop();

    switch (req.method) {
      case 'GET':
        return store.select(productSelectors.selectEntities).pipe(
          take(1),
          map((entities) => {
            const doesProductExist = entities[productId];
            if (doesProductExist) {
              return new HttpResponse({ status: HttpStatusCode.Ok, body: req.body })
            } else {
              throw new HttpErrorResponse({ status: HttpStatusCode.NotFound })
            }
          })
        );

      case 'DELETE':
        return store.select(productSelectors.selectEntities).pipe(
          take(1),
          map((entities) => {
            const product = entities[productId];
            if (product) {
              return new HttpResponse({ status: HttpStatusCode.Ok, body: product })
            } else {
              throw new HttpErrorResponse({ status: HttpStatusCode.NotFound })
            }
          })
        );

      case 'PUT':
        const body = req.body as object;
        const isValid = validator(body, Product);
        if (isValid) {
          return store.select(productSelectors.selectEntities).pipe(
            take(1),
            map((entities) => {
              const doesProductExist = entities[productId];
              if (doesProductExist) {
                return new HttpResponse({ status: HttpStatusCode.Ok, body: req.body })
              } else {
                throw new HttpErrorResponse({ status: HttpStatusCode.NotFound })
              }
            })
          );
        } else {
          throw new HttpErrorResponse({ status: HttpStatusCode.BadRequest })
        }
      default:
        return of(new HttpResponse({ status: HttpStatusCode.NotImplemented }));
    }

  }
  return of(new HttpResponse({ status: HttpStatusCode.ImATeapot }));
};
