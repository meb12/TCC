import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CepService {
  private viacepUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  getAddressByCep(cep: string): Observable<any> {
    return this.http.get(`${this.viacepUrl}/${cep}/json/`);
  }
}
