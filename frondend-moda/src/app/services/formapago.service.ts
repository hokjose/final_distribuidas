import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Formapago} from '../models/formapago';

@Injectable({
  providedIn: 'root'
})
export class FormapagoService {
  API_URL: string = "http://localhost:8080/formapago"
  constructor(private http: HttpClient) { }

  getAll():Observable<Formapago[]> {
    return this.http.get<Formapago[]>(this.API_URL);
  }
}
