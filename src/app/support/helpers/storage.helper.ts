import { Injectable } from '@angular/core';
import { IBuild } from '../interfaces/build';

@Injectable({
  providedIn: 'root',
})
export class StorageHelper {
  constructor() {}

  public getBuilds(): IBuild[] {
    return JSON.parse(localStorage.getItem('builds')!);
  }

  public setBuilds(builds: IBuild[]): void {
    localStorage.setItem('builds', JSON.stringify(builds));
  }
}
