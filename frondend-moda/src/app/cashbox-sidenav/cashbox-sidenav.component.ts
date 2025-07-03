import {Component, signal} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {NgForOf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MenuItem} from '../models/MenuItem';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cashbox-sidenav',
  standalone: true,
  imports: [
    MatListModule,
    NgForOf,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './cashbox-sidenav.component.html',
  styleUrl: './cashbox-sidenav.component.css'
})

export class CashboxSidenavComponent {
  menuItems = signal<MenuItem[]>([
    {icon: 'category', label: 'Marcas', route: 'marca'},
    {icon: 'inventory', label: 'Productos', route: 'producto'},
    {icon: 'shopping_cart', label: 'Ventas', route: 'venta'},
  ])
}
