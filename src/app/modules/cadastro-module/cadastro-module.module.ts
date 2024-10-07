import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { SharedModule } from '../../shared/shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    CadastroRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  declarations: [CadastroComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CadastroModule {}
