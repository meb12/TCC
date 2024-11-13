import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl: string = `${environment.apiUrl}/api/login`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      typeOfApplication: 'web',
    });

    const body = {
      email: email,
      password: password,
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
  postRedefinirSenha(data: any): Observable<HttpResponse<any>> {
    return this.http.post(this.apiUrl + '/send-mail-to-reset', data, {
      observe: 'response',
      responseType: 'text',
    });
  }
  putRedefinirSenha(data: any, token: string): Observable<any> {
    return this.http.put(this.apiUrl + '/reset-password', data, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text' as 'json', // Define o responseType como texto
    });
  }

  // Armazena o token no localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Verifica se o usuário está autenticado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Remove o token ao fazer logout
  logout(): void {
    localStorage.removeItem('token');
  }
}
