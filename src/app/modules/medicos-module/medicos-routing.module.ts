import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MedicosComponent } from './pages/medicos/medicos.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';

export const routes: Routes = [
  {
    path: 'listagem',
    component: MedicosComponent,
  },
  {
    path: 'especialidades',
    component: EspecialidadesComponent,
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
export class MedicosRoutingModule {}
