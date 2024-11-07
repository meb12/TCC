import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { PacientesRoutingModule } from './pacientes-routing.module';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ModalInformacaoPacienteComponent } from './pages/modal-informacao-paciente/modal-informacao-paciente.component';
import { ExclusaoModalPacienteComponent } from './pages/exclusao-modal-paciente/exclusao-modal-paciente.component';

@NgModule({
  imports: [CommonModule, PacientesRoutingModule, SharedModule],
  declarations: [
    PacientesComponent,
    ConsultaComponent,
    ModalInformacaoPacienteComponent,
    ExclusaoModalPacienteComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PacientesModule {}
