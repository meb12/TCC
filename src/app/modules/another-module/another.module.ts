// another.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnotherRoutingModule } from './another-routing.module'; // Certifique-se de importar o módulo de roteamento
import { NovoCompoenteComponent } from './novo-compoente/novo-compoente.component'; // Certifique-se de importar o componente corretamente

@NgModule({
  declarations: [NovoCompoenteComponent], // Declare os componentes aqui
  imports: [
    CommonModule,
    AnotherRoutingModule, // Importe o módulo de roteamento
  ],
})
export class AnotherModule {} // Certifique-se de que a classe está corretamente exportada
