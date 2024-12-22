import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ProductEffects } from './products/state/product.effects';
import { PRODUCTS_FEATURE_KEY, productsReducer } from './products/state/product.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { requestInterceptor } from './core/request.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideState({ name: PRODUCTS_FEATURE_KEY, reducer: productsReducer }),
    provideEffects(ProductEffects),
    provideHttpClient(
      withInterceptors([requestInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStoreDevtools({ logOnly: !isDevMode() }),
  ]
};
