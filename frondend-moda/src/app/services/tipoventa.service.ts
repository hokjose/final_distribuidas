import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Tipoventa} from '../models/tipoventa';

@Injectable({
  providedIn: 'root'
})
export class TipoventaService {
  API_URL: string = "http://localhost:8080/tipoventa"
  constructor(private http: HttpClient) { }

  getAll():Observable<Tipoventa[]> {
    return this.http.get<Tipoventa[]>(this.API_URL);
  }
}
