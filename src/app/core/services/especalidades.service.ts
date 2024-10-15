import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadeService {
  private baseURL: string = `${environment.apiUrl}/api/specialties`;
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  postData(data: any): Observable<any> {
    return this.http.post(this.baseURL, data);
  }

  getData(): Observable<any> {
    return this.http.get(this.baseURL);
  }
}
