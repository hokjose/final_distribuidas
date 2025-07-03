import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Marca} from '../models/marca';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  API_URL: string = "http://localhost:8082/marca"

  constructor(private httpClient: HttpClient) {}

  // Obtener todas las marcas
  getMarcas(): Observable<Marca[]> {
    return this.httpClient.get<Marca[]>(this.API_URL);
  }

  // Registrar una marca
  createMarca(objMarca: Marca): Observable<Marca> {
    return this.httpClient.post<Marca>(this.API_URL, objMarca);
  }

  // Actualizar una marca
  updateMarca(id: number, marca: Marca): Observable<Marca> {
    return this.httpClient.put<Marca>(`${this.API_URL}/${id}`, marca);
  }

  // Eliminar una marca
  deleteMarca(id: number): Observable<Marca> {
    return this.httpClient.delete<Marca>(`${this.API_URL}/${id}`);
  }
}
