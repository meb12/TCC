import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginModule } from './modules/login-module/login.module';
import { AppRoutingModule } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MainModule } from './modules/main-module/main-module.module';
import { MedicosModule } from './modules/medicos-module/medicos-module.module';
import { HomeModule } from './modules/home-module/home.module';
import { CadastroModule } from './modules/cadastro-module/cadastro-module.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PacientesModule } from './modules/pacientes-module/pacientes-module.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    LoginModule,
    MainModule,
    MedicosModule,
    HomeModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CadastroModule,
    SharedModule,
    PacientesModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
})
export class AppModule {}
