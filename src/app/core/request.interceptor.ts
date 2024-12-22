import { HttpErrorResponse, HttpInterceptorFn, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { of } from 'rxjs';
import { Product } from '../products/shared/product.model';
import { PRODUCTS } from '../shared/consts/mocks';

const validator = (obj: object, classToCompare: any, keysToOmit: string[] = []): boolean => {
  const modelKeys = Object.keys(new classToCompare()).filter(i => !keysToOmit.includes(i));
  const objKeys = Object.keys(obj);
  return modelKeys.every(i => objKeys.includes(i));
};

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const isGeneralProductsApiCall = req.url === 'api/products';

  if (isGeneralProductsApiCall && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: JSON.parse(JSON.stringify(PRODUCTS)) }));
  }

  if (isGeneralProductsApiCall && req.method === 'POST') {
    const body = req.body as object;
    const isValid = validator(body, Product, ['id'])

    if (isValid) {
      const product = { ...body, id: Math.max(...PRODUCTS.map((i: Product) => +i.id)) + 1 } as Product;
      PRODUCTS.push(product);
      return of(new HttpResponse({ status: HttpStatusCode.Ok, body: product }));
    } else {
      throw new HttpErrorResponse({ status: HttpStatusCode.BadRequest })
    }
  }

  const isSpecificProductRequest = req.url.match(/api\/products\/\d+/);

  if (isSpecificProductRequest) {
    const productId = +req.url.split('/').pop();
    const productIndex = PRODUCTS.findIndex((i: Product) => i.id === productId);
    const product = JSON.parse(JSON.stringify(PRODUCTS[productIndex]));
    const doesProductExist = productIndex !== -1;

    switch (req.method) {
      case 'GET':
        if (doesProductExist) {
          return of(new HttpResponse({ status: HttpStatusCode.Ok, body: product }));
        } else {
          throw new HttpErrorResponse({ status: HttpStatusCode.NotFound });
        }

      case 'DELETE':
        if (doesProductExist) {
          PRODUCTS.splice(productIndex, 1);
          return of(new HttpResponse({ status: HttpStatusCode.Ok, body: product }));
        } else {
          throw new HttpErrorResponse({ status: HttpStatusCode.NotFound });
        }

      case 'PUT':
        const body = req.body as object;
        const isValid = validator(body, Product);
        if (isValid) {
          if (doesProductExist) {
            PRODUCTS[productIndex] = JSON.parse(JSON.stringify(req.body)) as Product;
            return of(new HttpResponse({ status: HttpStatusCode.Ok, body: req.body }));
          } else {
            throw new HttpErrorResponse({ status: HttpStatusCode.NotFound });
          }
        } else {
          throw new HttpErrorResponse({ status: HttpStatusCode.BadRequest });
        }
      default:
        return of(new HttpResponse({ status: HttpStatusCode.NotImplemented }));
    }

  }
  return of(new HttpResponse({ status: HttpStatusCode.ImATeapot }));
};
