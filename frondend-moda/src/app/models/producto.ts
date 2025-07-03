import {Marca} from './marca';
import {Genero} from './genero';
import {Color} from './color';

export interface Producto {
  id: string;
  producto: string;
  marca:Marca;
  genero:Genero;
  color:Color;
  stock:number;
  precioventa:number;
  costocompra:number;
}
