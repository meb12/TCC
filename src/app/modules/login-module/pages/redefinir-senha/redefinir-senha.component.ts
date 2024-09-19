import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css'],
})
export class RedefinirSenhaComponent implements OnInit {
  private subscription$ = new Subscription();
  form!: FormGroup;
  fb = inject(FormBuilder);
  // autenticarService = inject(AutenticarService);
  router = inject(Router);

  constructor(private toastr: ToastrService) {}

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
  ngOnInit(): void {
    this._initEnviarEmailForm();
  }

  protected enviarEmail() {
    // this.subscription$.add(
    //   this.autenticarService
    //     .enviarEmailRedefinicao(this.form.value.email as string)
    //     .subscribe({
    //       next: (res: any) => {
    //         this.router.navigate(['/login']);
    //         this.toastr.success(res.Data.Message);
    //       },
    //       error: (error) => {
    //         error.error.Errors.forEach((errorMessage: any) => {
    //           this.toastr.error(errorMessage);
    //         });
    //       },
    //     })
    // );
  }
  private _initEnviarEmailForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
