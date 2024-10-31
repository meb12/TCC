import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CadastroComponent } from './pages/cadastro/cadastro.component';

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
