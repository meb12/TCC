import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

import { CalendarioComponent } from './pages/calendario/calendario.component';
import { DahsboardComponent } from './components/dahsboard/dahsboard.component';
import { SharedModule } from '../../shared/shared.module';
import { TiposCalendarioComponent } from './pages/tiposCalendario/tiposCalendario.component';
import { CalendarioMedicoComponent } from './pages/calendario-medico/calendario-medico.component';

@NgModule({
  declarations: [
    CalendarioComponent,
    DahsboardComponent,
    TiposCalendarioComponent,
    CalendarioMedicoComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
