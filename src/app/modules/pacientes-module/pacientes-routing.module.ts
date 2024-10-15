import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';

export const routes: Routes = [
  {
    path: 'listagem',
    component: ConsultaComponent,
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
export class PacientesRoutingModule {}
