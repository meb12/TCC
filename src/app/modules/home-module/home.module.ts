import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

import { CalendarioComponent } from './pages/calendario/calendario.component';
import { DahsboardComponent } from './components/dahsboard/dahsboard.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CalendarioComponent, DahsboardComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
