import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { PacientesRoutingModule } from './pacientes-routing.module';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';

@NgModule({
  imports: [CommonModule, PacientesRoutingModule, SharedModule],
  declarations: [PacientesComponent, ConsultaComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PacientesModule {}
