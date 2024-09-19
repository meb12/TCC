import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { InputComponentComponent } from './components/input-component/input-component.component';
import { InputValidacaoComponent } from './components/input-validacao/input-validacao.component';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { EsqueceuSenhaComponent } from './pages/esqueceu-senha/esqueceu-senha.component';
import { TituloComponent } from './components/titulo/titulo.component';
import { RedefinirSenhaComponent } from './pages/redefinir-senha/redefinir-senha.component';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    InputComponentComponent,
    InputValidacaoComponent,
    EsqueceuSenhaComponent,
    TituloComponent,
    RedefinirSenhaComponent,
  ],
  imports: [CommonModule, LoginRoutingModule, SharedModule],
  exports: [],
})
export class LoginModule {}
