import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from './core/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.loginService.isLoggedIn()) {
      // Se estiver logado, permite o acesso à rota solicitada ou redireciona para a página não encontrada
      return true;
    } else {
      // Redireciona para login se não estiver logado
      this.router.navigate(['/login']);
      return false;
    }
  }
}
