import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';

export const routes: Routes = [
  {
    path: 'listagem',
    component: FuncionariosComponent,
  },
  {
    path: '',
    redirectTo: 'listagem',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuncionariosRoutingModule {}
