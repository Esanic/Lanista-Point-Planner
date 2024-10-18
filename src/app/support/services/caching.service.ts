import { Injectable } from '@angular/core';
import { ICaching } from '../interfaces/caching';
import { HttpEvent } from '@angular/common/http';

// 3 days
const TTL = 1000 * 60 * 60 * 24 * 3;

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  readonly #cache = new Map<string, ICaching>();

  get(key: string): HttpEvent<unknown> | undefined {
    const cached = this.#cache.get(key);

    if (!cached) {
      return undefined;
    }

    if (cached.expiresOn < Date.now()) {
      this.#cache.delete(key);
      return undefined;
    }

    return cached.value;
  }

  set(key: string, value: HttpEvent<unknown>): void {
    this.#cache.set(key, {
      value,
      expiresOn: Date.now() + TTL,
    });
  }

  constructor() {}
}
