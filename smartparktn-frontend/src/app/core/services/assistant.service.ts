import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'stats' | 'recommendation';
  data?: any;
}

export interface AssistantResponse {
  message: string;
  type: 'text' | 'stats' | 'recommendation';
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  /**
   * Pose une question à l'assistant IA (OpenAI)
   */
  processQuestion(question: string): Observable<AssistantResponse> {
    console.log('🤖 Envoi question à OpenAI:', question);

    return this.http.post<any>(`${this.apiUrl}/assistant/ask`, {
      question: question
    }).pipe(
      map(response => {
        if (response.success) {
          return {
            message: response.answer,
            type: 'text' as const
          };
        } else {
          throw new Error(response.message || 'Erreur lors de la réponse');
        }
      }),
      catchError(error => {
        console.error('❌ Erreur Assistant IA:', error);
        
        let errorMessage = 'Erreur lors de la communication avec l\'assistant IA.';
        
        if (error.status === 429) {
          errorMessage = '⚠️ Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.';
        } else if (error.status === 503) {
          errorMessage = '🌐 Service temporairement indisponible. Vérifiez votre connexion.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        return throwError(() => ({
          message: errorMessage,
          type: 'text' as const
        }));
      })
    );
  }

  /**
   * Obtenir les données du dashboard
   */
  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  /**
   * Obtenir l'historique
   */
  getHistory(params?: any): Observable<any> {
    let url = `${this.apiUrl}/history`;
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      url += `?${queryParams}`;
    }
    return this.http.get(url);
  }
}
