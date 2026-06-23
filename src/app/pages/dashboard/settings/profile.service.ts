import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';

export interface Profile {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
}

/**
 * In-memory profile (mirrors the ProductService mock). Swap `update()` for a
 * backend `PATCH /users/me` (or `/auth/profile`) when that endpoint exists.
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly subject = new BehaviorSubject<Profile>(seed());
  readonly profile$: Observable<Profile> = this.subject.asObservable();

  get snapshot(): Profile {
    return this.subject.value;
  }

  update(profile: Profile): Observable<Profile> {
    return of(profile).pipe(
      delay(200),
      tap((p) => this.subject.next(p)),
    );
  }
}

function seed(): Profile {
  return { fullName: 'Asif Khan', dob: '', email: 'asif@example.com', phone: '' };
}
