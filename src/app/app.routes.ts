import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaNaoEncontradaComponent } from './modules/main-module/pages/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login-module/login.module').then((m) => m.LoginModule),
  },

  // Rota catch-all para verificar o login e redirecionar conforme necessário
  {
    path: '**',
    canActivate: [AuthGuard],
    component: PaginaNaoEncontradaComponent,
  },

  {
    path: '',
    loadChildren: () =>
      import('./modules/main-module/main-module.module').then(
        (m) => m.MainModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
