import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginModule } from './modules/login-module/login.module';
import { AppRoutingModule } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MainModule } from './modules/main-module/main-module.module';
import { AnotherModule } from './modules/another-module/another.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    LoginModule,
    MainModule,
    AnotherModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
  providers: [provideAnimationsAsync()],
})
export class AppModule {}
