import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ConsultaIndividualComponent } from './pages/consulta-individual/consulta-individual.component';
import { ReceituarioMedicoComponent } from './receituario-medico/receituario-medico.component';

export const routes: Routes = [
  {
    path: 'listagem',
    component: PacientesComponent,
  },
  {
    path: 'consulta/:id',
    component: ConsultaComponent,
  },
  {
    path: 'consulta/individual/:id',
    component: ConsultaIndividualComponent,
  },
  {
    path: 'consulta/receita/:id',
    component: ReceituarioMedicoComponent,
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
