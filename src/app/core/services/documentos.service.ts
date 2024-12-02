import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private baseURL: string = `${environment.apiUrl}/api/files`;
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  postFile(
    appointmentId: any,
    examOrPrescription: string,
    file: File
  ): Observable<any> {
    const url = `${this.baseURL}/${appointmentId}?examOrPrescription=${examOrPrescription}`; // URL dinâmica com appointmentId
    const formData = new FormData();

    // Adiciona o arquivo e os dados no formData
    formData.append('file', file);
    formData.append('examOrPrescription', examOrPrescription);

    return this.http.post(url, formData);
  }
  getData(id: string, examOrPrescription: string): Observable<Blob> {
    const url = `${this.baseURL}/download/${id}?examOrPrescription=${examOrPrescription}`; // Adapte a URL conforme necessário
    return this.http.get(url, {
      responseType: 'blob', // Define o tipo de resposta como 'blob' para arquivos
    });
  }

  deleteData(id: any, examOrPrescription: string): Observable<any> {
    const url = `${this.baseURL}/${id}?examOrPrescription=${examOrPrescription}`; // URL dinâmica
    return this.http.delete(url);
  }
  putData(
    id: any,
    examOrPrescription: string,
    body: string,
    headers: any
  ): Observable<any> {
    const url = `${this.baseURL}/rename/${id}?examOrPrescription=${examOrPrescription}`;
    return this.http.put(url, body, { headers, responseType: 'text' });
  }
}
