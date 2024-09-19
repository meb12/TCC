import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor() {}

  isHomeRoute: boolean = false;

  mostrar = false;

  dataSource!: any[];

  cor: string = '';

  onMostrarChange(mostrar: any) {
    this.mostrar = mostrar;
  }

  ngOnInit() {
    // comentando notificacao
    // this.getNotificacao();
    // this.intervalId = setInterval(() => {
    //   this.getNotificacao();
    // }, 300000); // 300000ms = 5 minutos
    // if (!this.authService.isAuthenticated()) {
    //   // Se não estiver logado, redireciona para a página de login
    //   this.router.navigateByUrl('/login');
    // }
    // this.router.events.subscribe(val => {
    //   // Verifica se a rota atual é a rota inicial "/"
    //   this.isHomeRoute = this.router.url === '/';
    //   if (this.router.url === '/') {
    //     this.tituloPagina.defineTitulo('');
    //   }
    // });
  }
}
