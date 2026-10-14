import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LogoComponent } from '../../components/common/logo/logo.component';
import { NotificationDropdownComponent } from '../../components/header/notification-dropdown/notification-dropdown.component';
import { UserDropdownComponent } from '../../components/header/user-dropdown/user-dropdown.component';
import { ThemeToggleButtonComponent } from '../../components/common/theme-toggle/theme-toggle-button.component';
import { SidebarService } from '../../services/sidebar.service';

/**
 * Aurora top bar — a full-width 56px blue gradient bar: logo + admin badge
 * (left), command search (center, desktop), theme toggle + bell + user (right).
 * The hamburger opens the mobile drawer (mobile only; tablet uses the pill-nav).
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LogoComponent,
    ThemeToggleButtonComponent,
    NotificationDropdownComponent,
    UserDropdownComponent,
  ],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  readonly sidebarService = inject(SidebarService);
  readonly isMobileOpen$ = this.sidebarService.isMobileOpen$;

  /** Show the "Admin" chip while on an /dashboard/admin route. */
  readonly isAdminRoute$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    map(() => this.router.url.startsWith('/dashboard/admin')),
    startWith(this.router.url.startsWith('/dashboard/admin')),
  );

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  toggleMobile(): void {
    this.sidebarService.toggleMobileOpen();
  }

  ngAfterViewInit(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  };
}
