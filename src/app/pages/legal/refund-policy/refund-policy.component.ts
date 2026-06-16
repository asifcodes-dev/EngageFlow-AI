import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LegalLayoutComponent } from '../legal-layout/legal-layout.component';

@Component({
  selector: 'app-refund-policy',
  imports: [LegalLayoutComponent, RouterModule],
  templateUrl: './refund-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundPolicyComponent {}
