import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Marca} from '../models/marca';
import {Genero} from '../models/genero';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {
  API_URL: string = "http://localhost:8082/genero"

  constructor(private httpClient: HttpClient) {}

  // Obtener todas las marcas
  getGenero(): Observable<Genero[]> {
    return this.httpClient.get<Genero[]>(this.API_URL);
  }
}
