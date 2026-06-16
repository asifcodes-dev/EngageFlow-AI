import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Presentational iPhone-style frame. Project the screen content via <ng-content>.
 * Used by the AI-replies and moderation sections (which pass a scrollable comment feed).
 */
@Component({
  selector: 'app-phone-frame',
  templateUrl: './phone-frame.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneFrameComponent {}
