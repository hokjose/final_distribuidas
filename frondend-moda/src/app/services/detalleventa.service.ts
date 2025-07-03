import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DetalleVenta} from '../models/detalleventa';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {
  private API_URL: string = 'http://localhost:8080/detalleventa';

  constructor(private httpClient: HttpClient) {}

  // Crear un detalle de venta
  create(detalleVenta: DetalleVenta): Observable<any> {
    console.log('Service: Creating DetalleVenta:', detalleVenta);
    return this.httpClient.post(this.API_URL, detalleVenta);
  }

  // Listar todos los detalles
  get(): Observable<DetalleVenta[]> {
    console.log('Service: Fetching all DetallesVenta...');
    return this.httpClient.get<DetalleVenta[]>(this.API_URL);
  }
}
