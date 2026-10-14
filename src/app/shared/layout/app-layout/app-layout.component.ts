import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { AppSidebarComponent } from '../app-sidebar/app-sidebar.component';
import { BackdropComponent } from '../backdrop/backdrop.component';

/**
 * Aurora authenticated shell: a full-width blue top bar, a fixed 224px sidebar
 * rail on desktop (xl+), and the routed content on the soft-blue gradient
 * canvas. Below xl (tablet + mobile) the rail becomes a hamburger-opened
 * drawer — no pill tabs, no bottom tab bar (per the Aurora handoff).
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, AppHeaderComponent, AppSidebarComponent, BackdropComponent],
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {}
