import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../../core/services/login.service';

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
    private toastr: ToastrService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this._initLoginForm();
    this._validacaoToken();
  }

  private _initLoginForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      senha: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { email, senha } = this.form.value;

    this.subscription$ = this.loginService.login(email, senha).subscribe({
      next: (response) => {
        //response.token.token
        this.loginService.setToken('1234');
        // Se a resposta for 200, assumimos que o usuário tem permissão
        this.router.navigate(['/home']);
      },
      error: (err) => {
        // Exibe a mensagem de erro se a requisição falhar
        const errorMessage = err?.error || 'Erro ao realizar login';
        this.toastr.error(errorMessage, 'Erro');
      },
    });
  }

  private _validacaoToken() {
    // Implementar validação de token se necessário
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
