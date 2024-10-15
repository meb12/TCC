import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicosRoutingModule } from './medicos-routing.module';
import { MedicosComponent } from './pages/medicos/medicos.component';
import { SharedModule } from '../../shared/shared.module';
import { ReceituarioMedicoComponent } from './components/receituario-medico/receituario-medico.component';

@NgModule({
  imports: [CommonModule, MedicosRoutingModule, SharedModule],
  declarations: [MedicosComponent, ReceituarioMedicoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MedicosModule {}
