import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
  {
    path: '',
    component: CadastroComponent,
  },
  {
    path: ':tipo',
    component: CadastroComponent,
  },
  {
    path: 'perfil/:id',
    component: PerfilComponent,
  },
  {
    path: 'medico/:id',
    component: CadastroComponent,
  },
  {
    path: 'paciente/:id',
    component: CadastroComponent,
  },
  {
    path: 'funcionario/:id',
    component: CadastroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroRoutingModule {}
