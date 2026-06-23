import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GenerateReplyInput {
  businessName: string;
  comment: string;
  productName?: string;
  productDescription?: string;
  price?: number;
  currency?: string;
  language?: string;
}

/**
 * Talks to the backend AI engine (Gemini). Both routes are JWT-guarded — the
 * auth interceptor attaches the token automatically.
 *
 * Backend contract:
 *   POST {apiUrl}/ai/reply     GenerateReplyInput -> { reply }
 *   POST {apiUrl}/ai/classify  { comment }        -> { category }
 */
@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly http = inject(HttpClient);

  generateReply(input: GenerateReplyInput): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(`${environment.apiUrl}/ai/reply`, input);
  }

  classify(comment: string): Observable<{ category: string }> {
    return this.http.post<{ category: string }>(`${environment.apiUrl}/ai/classify`, { comment });
  }
}
