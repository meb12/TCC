import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private baseURL: string = `${environment.apiUrl}/api/pacients`;
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  postData(data: any): Observable<any> {
    return this.http.post(this.baseURL, data);
  }

  getData(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  getDataId(id: any): Observable<any> {
    return this.http.get(this.baseURL + '/' + id);
  }

  putData(data: any): Observable<any> {
    return this.http.put(this.baseURL, data);
  }
}
