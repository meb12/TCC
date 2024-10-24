import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionariosRoutingModule } from './funcionarios-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';

@NgModule({
  imports: [CommonModule, FuncionariosRoutingModule, SharedModule],
  declarations: [FuncionariosComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FuncionariosModule {}
