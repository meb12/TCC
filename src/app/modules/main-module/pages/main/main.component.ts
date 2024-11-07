import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoaderService } from '../../../../core/services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  isHomeRoute: boolean = false;
  mostrar = false;
  dataSource!: any[];
  cor: string = '';
  isLoading$: Observable<boolean>;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private loaderService: LoaderService
  ) {
    this.isLoading$ = this.loaderService.isLoading$;
  }

  onMostrarChange(mostrar: any) {
    this.mostrar = mostrar;
  }

  ngOnInit() {
    // Escuta as mudanças de rota
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Quando a navegação termina, rola o elemento c-app_conteudo para o topo
        const contentElement =
          this.elementRef.nativeElement.querySelector('.c-app_conteudo');
        if (contentElement) {
          contentElement.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    });
  }
}
