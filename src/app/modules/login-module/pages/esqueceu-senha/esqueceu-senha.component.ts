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
  constructor(private toastr: ToastrService) {}
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
  ngOnInit(): void {
    console.log('EsqueceuSenhaComponent carregado');
    this._initForm();
  }
  private _initForm() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (!queryParams['token']) {
      // this.router.navigate(['/login']);
    }
    this.form = this.fb.group(
      {
        codUsuario: [queryParams['codUsuario']],
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

  toggleHide(): void {
    this.hide = !this.hide;
  }

  toggleHideSenha(): void {
    this.hideSenha = !this.hideSenha;
  }

  protected mudarSenha(): void {
    const redefinir = {
      guidResetSenha: this.form.value.token,
      novaSenha: this.form.value.senha,
    };
    this.subscription$
      .add
      // this.autenticarService.redefinirSenha(redefinir).subscribe({
      //   next: () => {
      //     this.toastr.success('Senha redefinida com sucesso');
      //     this.router.navigate(['/login']);
      //   },
      //   error: (error) => {
      //     error.error.Errors.forEach((errorMessage: any) => {
      //       this.toastr.error(errorMessage);
      //     });
      //   },
      // })
      ();
  }
}
