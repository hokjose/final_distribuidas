import {Routes} from '@angular/router';
import {MainMarcaComponent} from './main-marca/main-marca.component';
import {MainProductoComponent} from './main-producto/main-producto.component';
import {MainVentasComponent} from './main-ventas/main-ventas.component';
export const routes: Routes = [
  {path:'marca', component:MainMarcaComponent},
  {path:'producto', component:MainProductoComponent},
  {path:'venta', component:MainVentasComponent},
];
