import { Injectable } from '@angular/core';
import { IBuild } from '../interfaces/build';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public getBuilds(): IBuild[] {
    return JSON.parse(localStorage.getItem('builds')!);
  }

  public setBuilds(builds: IBuild[]): void {
    localStorage.setItem('builds', JSON.stringify(builds));
  }
}
