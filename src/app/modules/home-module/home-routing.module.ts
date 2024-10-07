import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AcessoRapidoComponent } from './pages/acesso-rapido/acesso-rapido.component';

export const routes: Routes = [
  {
    path: '',
    component: AcessoRapidoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
