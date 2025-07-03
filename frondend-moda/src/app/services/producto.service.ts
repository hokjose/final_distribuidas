import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Producto} from '../models/producto';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  API_URL: string = 'http://localhost:8082/producto';

  constructor(private httpClient: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    console.log('ProductoService: Fetching all productos...');
    return this.httpClient.get<Producto[]>(this.API_URL);
  }

  createProducto(producto: Producto): Observable<Producto> {
    console.log('ProductoService: Creating producto:', producto);
    return this.httpClient.post<Producto>(this.API_URL, producto);
  }

  updateProducto(id: string, producto: Producto): Observable<Producto> {
    console.log(`ProductoService: Updating producto with ID ${id}:`, producto);
    return this.httpClient.put<Producto>(`${this.API_URL}/${id}`, producto);
  }

  deleteProducto(id: string): Observable<void> {
    console.log(`ProductoService: Deleting producto with ID ${id}`);
    return this.httpClient.delete<void>(`${this.API_URL}/${id}`);
  }
}
