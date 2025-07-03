import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Cliente} from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  API_URL: string = "http://localhost:8080/cliente"

  constructor(private httpClient: HttpClient) {}

  // Obtener todas las marcas
  getCliente(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.API_URL);
  }

}
