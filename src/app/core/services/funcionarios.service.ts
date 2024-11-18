import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  private baseURL: string = `${environment.apiUrl}/api/generic-users`;
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  postData(data: any): Observable<any> {
    return this.http.post(this.baseURL, data);
  }

  getData(): Observable<any> {
    return this.http.get(this.baseURL + '/only-general-employees');
  }

  getDataId(id: any): Observable<any> {
    return this.http.get(this.baseURL + '/' + id);
  }

  putData(data: any): Observable<any> {
    return this.http.put(this.baseURL, data);
  }
  putFoto(id: any, formData: FormData): Observable<any> {
    // Enviando a requisição PATCH com ID na URL e FormData no corpo
    return this.http.patch(`${this.baseURL}/${id}/user-photo`, formData);
  }
}
