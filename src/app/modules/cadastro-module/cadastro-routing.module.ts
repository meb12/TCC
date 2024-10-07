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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroRoutingModule {}
