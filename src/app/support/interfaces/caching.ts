import { HttpEvent } from '@angular/common/http';

export interface ICaching {
  value: HttpEvent<unknown>;
  expiresOn: number;
}
