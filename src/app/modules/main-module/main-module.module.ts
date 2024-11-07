import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MainComponent } from './pages/main/main.component';
import { TituloMenuComponent } from './components/titulo-menu/titulo-menu.component';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { CabecalhoComponent } from './components/cabecalho/cabecalho.component';
import { PaginaNaoEncontradaComponent } from './pages/pagina-nao-encontrada/pagina-nao-encontrada.component';

@NgModule({
  declarations: [
    MainComponent,
    TituloMenuComponent,
    MenuLateralComponent,
    CabecalhoComponent,
    PaginaNaoEncontradaComponent,
  ],
  imports: [CommonModule, SharedModule, MainRoutingModule],
  exports: [PaginaNaoEncontradaComponent],
})
export class MainModule {}
