import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url: string = 'https://beta.lanista.se/api';

  constructor(private http: HttpClient) {}

  getRaces(): Observable<any> {
    return this.http.get<any>(`${this.url}/config`);
  }

  getWeapons() {
    return this.http.get<any>(`${this.url}/external/items/weapons/all`);
  }

  getArmors() {
    return this.http.get<any>(`${this.url}/external/items/armors/all`);
  }

  getConsumables() {
    return this.http.get<any>(`${this.url}/external/items/consumables/all`);
  }

  getEnchants() {
    return this.http.get<any>(`${this.url}/external/items/enchants/all`);
  }
}
