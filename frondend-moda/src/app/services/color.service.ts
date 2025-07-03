import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Color} from '../models/color';


@Injectable({
  providedIn: 'root'
})
export class ColorService {
  API_URL: string = "http://localhost:8082/color"

  constructor(private httpClient: HttpClient) {}

  // Obtener todas las marcas
  getColor(): Observable<Color[]> {
    return this.httpClient.get<Color[]>(this.API_URL);
  }


}



