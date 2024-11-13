import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoginService } from '../../../../core/services/login.service';

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

  constructor(private toastr: ToastrService, private login: LoginService) {}

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
  ngOnInit(): void {
    this._initEnviarEmailForm();
  }
  enviarEmail() {
    this.login.postRedefinirSenha(this.form.value).subscribe({
      next: (response) => {
        if (response.status === 200) {
          // Verifica se o status é 200
          this.toastr.success('Email de redefinição de senha enviado');
          this.router.navigateByUrl('/login');
        } else {
          this.toastr.error(
            'Erro ao enviar email de redefinição de senha. Tente novamente.'
          );
        }
      },
      error: (error) => {
        console.error('Error details:', error);
        this.toastr.error(
          'Erro ao enviar email de redefinição de senha. Tente novamente.'
        );
      },
    });
  }

  private _initEnviarEmailForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
