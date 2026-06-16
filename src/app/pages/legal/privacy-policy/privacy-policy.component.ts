import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegalLayoutComponent } from '../legal-layout/legal-layout.component';

@Component({
  selector: 'app-privacy-policy',
  imports: [LegalLayoutComponent],
  templateUrl: './privacy-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent {}
