import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { SharedModule } from '../../shared/shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PerfilComponent } from './pages/perfil/perfil.component';

@NgModule({
  imports: [
    CommonModule,
    CadastroRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  declarations: [CadastroComponent, PerfilComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CadastroModule {}
