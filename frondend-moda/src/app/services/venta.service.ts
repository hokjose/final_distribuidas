import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Venta} from '../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  API_URL: string = 'http://localhost:8080/venta';

  constructor(private httpClient: HttpClient) {}

  get(): Observable<Venta[]> {
    console.log('Service: Fetching all...');
    return this.httpClient.get<Venta[]>(this.API_URL);
  }

  create(producto: Venta): Observable<Venta> {
    console.log('Service: Creating :', producto);
    return this.httpClient.post<Venta>(this.API_URL, producto);
  }
}
