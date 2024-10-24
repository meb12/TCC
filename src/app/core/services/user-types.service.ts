import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class TiposUsuariosService {
  private baseURL: string = `${environment.apiUrl}/api/user-types`;
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getUserTypes(): Observable<any> {
    return this.http.get(this.baseURL);
  }
}
