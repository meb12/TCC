import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CalendarioComponent } from './pages/calendario/calendario.component';

export const routes: Routes = [
  {
    path: '',
    component: CalendarioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
