import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private subscription$ = new Subscription();
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(): void {
    // this.subscription$.add(
    //   this.autenticarService
    //     .autenticar(this.form.value as AutenticarRequestBody)
    //     .subscribe({
    //       next: (response: any) => {
    //         if (response.Success) {
    //           this.router.navigate(['/']);
    //           setTimeout(() => {
    //             window.location.reload();
    //           }, 100);
    //         } else {
    //           this.toastr.error('Credenciais inválidas. Tente novamente!');
    //         }
    //       },
    //       error: (error: any) => {
    //         error.error.Errors.forEach((errorMessage: any) => {
    //           this.toastr.error(errorMessage);
    //         });
    //       },
    //     })
    // );
  }
  private _initLoginForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      senha: ['', Validators.required],
    });
  }
  private _validacaoToken() {
    // if (this.autenticarService.isAuthenticatedAndTokenValid()) {
    //   this.router.navigate(['']);
    // }
  }
  ngOnInit(): void {
    this._initLoginForm();
    this._validacaoToken();

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isChrome = /chrome/.test(userAgent) && !/edge/.test(userAgent); // Verifica se é Chrome
    const isFirefox = /firefox/.test(userAgent); // Verifica se é Firefox
    const isEdge = /edg/.test(userAgent); // Verifica se é Edge
    const isOpera = /opr/.test(userAgent); // Verifica se é Opera

    // Exibir mensagem apenas se não for Chrome, Firefox ou Edge
    if ((!isChrome && !isFirefox) || isEdge || isOpera) {
      // this.toastr.info(
      //   'Para assegurar a segurança do sistema, acesse o portal pelo Chrome ou Firefox no computador!',
      //   'Segurança do Sistema',
      //   {
      //     closeButton: true,
      //     disableTimeOut: true,
      //     positionClass: 'toast-top-center',
      //   }
      // );
    }
  }
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
  get fc() {
    return this.form.controls;
  }
}
