import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './pages/main/main.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'another',
        pathMatch: 'full',
      },
      {
        path: 'another',
        loadChildren: () =>
          import('../another-module/another.module').then(
            (m) => m.AnotherModule
          ), // Certifique-se de que o nome do módulo está correto
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
