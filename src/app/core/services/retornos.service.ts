import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class RetornosService {
  private baseURL: string = `${environment.apiUrl}/api/appointments-return`;
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  postData(data: any): Observable<any> {
    return this.http.post(this.baseURL, data);
  }

  getData(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  getDataPacienteId(id: number): Observable<any> {
    return this.http.get(this.baseURL + '?pacientUserId=' + id);
  }

  getDataId(id: any): Observable<any> {
    return this.http.get(this.baseURL + '/' + id);
  }

  getHorarios(id: any, date: any): Observable<any> {
    return this.http.get(
      this.baseURL + '/unavailable-times?doctorUserId=' + id + '&date=' + date
    );
  }

  putData(data: any): Observable<any> {
    return this.http.put(this.baseURL, data);
  }
}
