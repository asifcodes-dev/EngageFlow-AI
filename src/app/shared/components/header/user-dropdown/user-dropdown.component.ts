import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AuthService, AuthUser } from '../../../services/auth.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent, DropdownItemTwoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDropdownComponent implements OnInit {
  isOpen = false;

  private auth = inject(AuthService);
  private router = inject(Router);

  /** The signed-in user (real name/email); null until loaded. */
  readonly user$ = this.auth.currentUser$;

  ngOnInit(): void {
    // On a page refresh the in-memory user is empty; rehydrate it from the
    // stored token so the header shows the real account, not a placeholder.
    if (this.auth.isAuthenticated() && !this.auth.currentUser) {
      this.auth.loadCurrentUser().subscribe({ error: () => undefined });
    }
  }

  /** Full display name for the dropdown panel (falls back to email). */
  displayName(user: AuthUser | null): string {
    return user?.name?.trim() || user?.email || 'Account';
  }

  /** First name (or email handle) for the compact header label. */
  firstName(user: AuthUser | null): string {
    const name = user?.name?.trim();
    if (name) return name.split(/\s+/)[0];
    return user?.email?.split('@')[0] ?? 'Account';
  }

  /** Initials for the avatar circle (no photo is stored server-side). */
  initials(user: AuthUser | null): string {
    const name = user?.name?.trim();
    if (name) {
      const parts = name.split(/\s+/).filter(Boolean);
      const ini = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
      return (ini || name[0]).toUpperCase();
    }
    return (user?.email?.[0] ?? 'U').toUpperCase();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout() {
    this.closeDropdown();
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}
