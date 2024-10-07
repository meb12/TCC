import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { AcessoRapidoComponent } from './pages/acesso-rapido/acesso-rapido.component';

@NgModule({
  declarations: [AcessoRapidoComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
