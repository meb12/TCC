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
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('../home-module/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'medicos',
        loadChildren: () =>
          import('../medicos-module/medicos-module.module').then(
            (m) => m.MedicosModule
          ),
      },
      {
        path: 'cadastro',
        loadChildren: () =>
          import('../cadastro-module/cadastro-module.module').then(
            (m) => m.CadastroModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
