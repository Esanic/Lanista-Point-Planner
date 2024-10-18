import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CachingService } from '../services/caching.service';
import { inject } from '@angular/core';

const cache = new Map<string, HttpEvent<unknown>>();

export const cachingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const cache = inject(CachingService);

  const cached = cache.get(req.url);

  if (cached) {
    return of(cached);
  }

  return next(req).pipe(tap((response) => cache.set(req.url, response)));
};
