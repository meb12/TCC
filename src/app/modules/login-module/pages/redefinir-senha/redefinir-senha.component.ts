import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute
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
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute); // Injeta ActivatedRoute

  primeiroAcesso: boolean = true; // Define como true por padrão

  constructor(private toastr: ToastrService, private login: LoginService) {}

  ngOnDestroy(): void {
    localStorage.clear();
    this.subscription$.unsubscribe();
  }

  ngOnInit(): void {
    this._initEnviarEmailForm();
    this._checkRoute(); // Chama o método para verificar a rota
  }

  enviarEmail() {
    this.login.postRedefinirSenha(this.form.value).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.toastr.success(
            'Se o e-mail informado for encontrado em nosso sistema, um link para redefinir sua senha será enviado. Não se esqueça de conferir sua caixa de entrada.'
          );
          this.router.navigateByUrl('/login');
        } else {
          this.toastr.success(
            'Se o e-mail informado for encontrado em nosso sistema, um link para redefinir sua senha será enviado. Não se esqueça de conferir sua caixa de entrada.'
          );
          this.router.navigateByUrl('/login');
        }
      },
      error: (error) => {
        this.toastr.success(
          'Se o e-mail informado for encontrado em nosso sistema, um link para redefinir sua senha será enviado. Não se esqueça de conferir sua caixa de entrada.'
        );
        this.router.navigateByUrl('/login');
      },
    });
  }

  private _initEnviarEmailForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private _checkRoute() {
    const currentRoute = this.activatedRoute.snapshot.routeConfig?.path;

    if (currentRoute === 'solicitarRedefinicaoSenha/esqueceuSenha') {
      this.primeiroAcesso = false;
    }
  }
}
