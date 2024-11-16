import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { confirmarSenhaValidator } from '../../../../core/validators/confirmarSenhaValidator';
import { LoginService } from '../../../../core/services/login.service';

@Component({
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.css'],
})
export class EsqueceuSenhaComponent implements OnInit {
  private subscription$ = new Subscription();
  form!: FormGroup;
  fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  // autenticarService = inject(AutenticarService);
  router = inject(Router);
  mensagem: any;
  hide = true;
  hideSenha = true;

  isLengthValid = false;
  hasNumber = false;
  hasLowercase = false;
  hasUppercase = false;
  hasSpecialChar = false;
  passwordsMatch = false;
  isValid = false;

  constructor(private toastr: ToastrService, private login: LoginService) {}
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
  ngOnInit(): void {
    localStorage.clear();
    this._initForm();
  }
  private _initForm() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (!queryParams['token']) {
      this.router.navigate(['/login']);
    }
    this.form = this.fb.group(
      {
        token: [queryParams['token']],
        senha: ['', [Validators.required, this.senhaValidator]],
        confirmarSenha: ['', [Validators.required]],
      },
      {
        validators: confirmarSenhaValidator('senha', 'confirmarSenha'),
      }
    );
  }

  private senhaValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.value;
    if (!senha) {
      return null; // Se não houver senha, a validação será tratada pelo Validators.required
    }
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasLowerCase = /[a-z]/.test(senha);
    const hasDigit = /\d/.test(senha);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    const isLongEnough = senha.length >= 8; // Exemplo: senha deve ter pelo menos 8 caracteres

    if (
      !(
        hasUpperCase &&
        hasLowerCase &&
        hasDigit &&
        hasSpecialChar &&
        isLongEnough
      )
    ) {
      return { senhaFraca: true }; // Retorna um erro se a senha não atender aos critérios
    }

    return null; // Retorna null se a senha atender aos critérios de segurança
  }

  private senhaIgualValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const senha = control.value;
    const confirmarSenha = this.form.value.confirmarSenha;
    if (senha != confirmarSenha) {
      return { senhaDiferente: true };
    }
    return null;
  }

  // ErroSenha() {
  //   const valorSenha: string = this.form.value.senha;
  //   const valorConfirmarSenha: string = this.form.value.confirmarSenha;
  //   if (valorSenha != valorConfirmarSenha) {
  //     return 'As senhas não conferem.';
  //   }
  //   return null;
  // }

  validatePassword() {
    const senha = this.form.value.senha;
    const novaSenha = this.form.value.confirmarSenha;

    this.isLengthValid = senha.length >= 8;
    this.hasNumber = /\d/.test(senha);
    this.hasLowercase = /[a-z]/.test(senha);
    this.hasUppercase = /[A-Z]/.test(senha);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    this.passwordsMatch = senha === novaSenha && senha != '' && novaSenha != '';

    if (
      this.isLengthValid &&
      this.hasNumber &&
      this.hasLowercase &&
      this.hasUppercase &&
      this.hasSpecialChar &&
      this.passwordsMatch
    ) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  toggleHide(): void {
    this.hide = !this.hide;
  }

  toggleHideSenha(): void {
    this.hideSenha = !this.hideSenha;
  }
  protected mudarSenha(): void {
    const redefinir = {
      newPassword: this.form.value.senha,
    };

    const token = this.form.value.token; // Extrai o token do formulário

    this.subscription$.add(
      this.login.putRedefinirSenha(redefinir, token).subscribe({
        next: (response) => {
          this.toastr.success('Senha redefinida com sucesso');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Detalhes do erro:', error);
          this.toastr.error('Erro ao redefinir senha. Tente novamente.');
        },
      })
    );
  }
}
