import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MedicosComponent } from './pages/medicos/medicos.component';

export const routes: Routes = [
  {
    path: 'listagem',
    component: MedicosComponent,
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
