import {Cliente} from './cliente';
import {Tipoventa} from './tipoventa';
import {Formapago} from './formapago';

export interface Venta {
  id?:number|null;
  cliente:Cliente;
  tipoventa:Tipoventa;
  formapago:Formapago;
  fechaventa?:string;
  subtotal:number;
  igv:number;
  total:number;
}
