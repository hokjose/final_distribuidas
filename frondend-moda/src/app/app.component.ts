import {Component, computed, signal} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterLink, RouterOutlet} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatButtonModule} from '@angular/material/button';
import {CashboxSidenavComponent} from './cashbox-sidenav/cashbox-sidenav.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSlideToggleModule, MatToolbarModule, MatIconModule, MatSidenavModule, RouterOutlet, MatButtonModule, RouterLink, CashboxSidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('transform', [
      state('start', style({
        transform: 'scale(1)'
      })),
      transition('start => end', animate('200ms', style({
        transform: 'scale(1.2)'
      })))
    ])
  ]
})
export class AppComponent {
  collapsed = signal(false)
  sidenavWidth=computed(()=>this.collapsed() ? '65px' : '250px')

}
