import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NovoCompoenteComponent } from './novo-compoente/novo-compoente.component';

export const routes: Routes = [
  {
    path: '',
    component: NovoCompoenteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnotherRoutingModule {}
