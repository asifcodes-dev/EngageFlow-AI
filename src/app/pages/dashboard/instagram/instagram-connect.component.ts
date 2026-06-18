import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InstagramService } from '../../../shared/services/instagram.service';

@Component({
  selector: 'app-instagram-connect',
  imports: [CommonModule, PageBreadcrumbComponent, ButtonComponent],
  templateUrl: './instagram-connect.component.html',
  styles: ``,
})
export class InstagramConnectComponent {
  private readonly instagram = inject(InstagramService);
  private readonly route = inject(ActivatedRoute);

  loading = false;
  error = '';
  /** True when Meta has just redirected back after a successful connect. */
  readonly connected = this.route.snapshot.queryParamMap.get('instagram') === 'connected';

  async connect(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      const { url } = await this.instagram.getConnectUrl();
      // Hand off to Meta's consent screen.
      window.location.href = url;
    } catch (err: unknown) {
      this.loading = false;
      this.error =
        err instanceof HttpErrorResponse && err.status === 401
          ? 'Please sign in first, then connect your Instagram account.'
          : 'Could not start the Instagram connection. Please try again.';
    }
  }
}
