import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Adiciona o token ao header
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = userInfo?.token?.token;
    const authRequest = token
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : request;

    // Gerencia o loader
    this.requests.push(authRequest);
    this.loaderService.show();

    return next.handle(authRequest).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.removeRequest(authRequest);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.removeRequest(authRequest);
        },
      })
    );
  }

  private removeRequest(request: HttpRequest<any>) {
    const index = this.requests.indexOf(request);
    if (index >= 0) {
      this.requests.splice(index, 1);
    }
    if (this.requests.length === 0) {
      this.loaderService.hide();
    }
  }
}
