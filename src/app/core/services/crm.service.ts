import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CrmService {
  private apiUrl = 'https://www.consultacrm.com.br/'; // URL base do site ConsultaCRM

  constructor(private http: HttpClient) {}

  // Método para validar o CRM usando a API do ConsultaCRM
  validateCrm(crm: string, uf?: string): Observable<boolean> {
    // Constroi a URL de consulta com os parâmetros CRM e UF
    const params = `?fonte=&q_tipo=crm&uf=&q=${crm}`;
    return this.http
      .get(`${this.apiUrl}${params}`, { responseType: 'text' }) // Pega o HTML como texto
      .pipe(
        map((response) => this.extractValidityFromResponse(response)), // Mapeia a resposta para determinar se é válida
        catchError(() => of(false)) // Se houver erro na requisição, assume que o CRM é inválido
      );
  }

  // Método privado para extrair a validade do CRM a partir da resposta HTML
  private extractValidityFromResponse(response: string): boolean {
    // Aqui estamos verificando se o texto "Nenhum resultado encontrado" aparece na página,
    // o que indicaria que o CRM não é válido
    if (response.includes('Nenhum resultado encontrado')) {
      return false;
    }
    return true;
  }
}
