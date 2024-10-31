import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionariosRoutingModule } from './funcionarios-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FuncionariosComponent } from './pages/funcionarios/funcionarios.component';
import { ExclusaoModalFuncionariosComponent } from './pages/exclusao-modal-funcionarios/exclusao-modal-funcionarios.component';

@NgModule({
  imports: [CommonModule, FuncionariosRoutingModule, SharedModule],
  declarations: [FuncionariosComponent, ExclusaoModalFuncionariosComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FuncionariosModule {}
