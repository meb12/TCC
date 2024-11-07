import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './pages/main/main.component';
import { AuthGuard } from '../../auth.guard';
import { PaginaNaoEncontradaComponent } from './pages/pagina-nao-encontrada/pagina-nao-encontrada.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('../home-module/home.module').then((m) => m.HomeModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'medicos',
        loadChildren: () =>
          import('../medicos-module/medicos-module.module').then(
            (m) => m.MedicosModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'pacientes',
        loadChildren: () =>
          import('../pacientes-module/pacientes-module.module').then(
            (m) => m.PacientesModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'funcionarios',
        loadChildren: () =>
          import('../funcionarios-module/funcionarios-module.module').then(
            (m) => m.FuncionariosModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'cadastro',
        loadChildren: () =>
          import('../cadastro-module/cadastro-module.module').then(
            (m) => m.CadastroModule
          ),
        canActivate: [AuthGuard],
      },

      // Rota catch-all para rotas não encontrada
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
