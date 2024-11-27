import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CalendarioComponent } from './pages/calendario/calendario.component';
import { TiposCalendarioComponent } from './pages/tiposCalendario/tiposCalendario.component';

export const routes: Routes = [
  {
    path: '',
    component: TiposCalendarioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
