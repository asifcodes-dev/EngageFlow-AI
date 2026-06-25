import { Injectable } from '@angular/core';

// Minimal typings for Google Identity Services (loaded lazily from Google's CDN).
interface GsiCredentialResponse {
  credential?: string;
}
interface GsiPromptNotification {
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
}
interface GsiId {
  initialize(config: {
    client_id: string;
    callback: (response: GsiCredentialResponse) => void;
  }): void;
  prompt(listener?: (notification: GsiPromptNotification) => void): void;
  cancel(): void;
}
interface GsiWindow {
  google?: { accounts?: { id?: GsiId } };
}

const GSI_SRC = 'https://accounts.google.com/gsi/client';

/**
 * Thin wrapper over Google Identity Services (Phase 10). Lazily loads the GIS
 * script and returns a verified ID-token credential via the One Tap prompt, which
 * the backend (`POST /auth/google`) verifies server-side. Only used when a
 * `googleClientId` is configured.
 */
@Injectable({ providedIn: 'root' })
export class GoogleIdentityService {
  private scriptLoaded?: Promise<void>;

  private load(): Promise<void> {
    if (this.scriptLoaded) return this.scriptLoaded;
    this.scriptLoaded = new Promise<void>((resolve, reject) => {
      const w = window as unknown as GsiWindow;
      if (w.google?.accounts?.id) return resolve();
      const script = document.createElement('script');
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google sign-in.'));
      document.head.appendChild(script);
    });
    return this.scriptLoaded;
  }

  /** Prompt the user and resolve with the Google ID token credential. */
  async getCredential(clientId: string): Promise<string> {
    await this.load();
    const id = (window as unknown as GsiWindow).google?.accounts?.id;
    if (!id) throw new Error('Google sign-in is unavailable.');

    return new Promise<string>((resolve, reject) => {
      id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) resolve(response.credential);
          else reject(new Error('Google did not return a credential.'));
        },
      });
      id.prompt((notification) => {
        if (
          notification.isNotDisplayed?.() ||
          notification.isSkippedMoment?.()
        ) {
          reject(new Error('Google sign-in was dismissed.'));
        }
      });
    });
  }
}
