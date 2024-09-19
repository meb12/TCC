import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
})
export class MenuLateralComponent implements OnInit {
  openMenu: boolean = false;
  listMenu: any = [
    {
      modulo: 'Pacientes',
      open: false,
      src: 'assets/img/icone-pacientes.svg',
      listSubmenu: [
        {
          menu: 'Criar',
          src: 'bx bxs-dashboard',
          route: 'recursos-humanos/dashboard',
          selecionado: false,
          manutencao: false,
        },
        {
          menu: 'Listagem',
          src: 'bx bx-user',
          route: 'recursos-humanos/pessoas',
          manutencao: false,
          selecionado: false,
        },
      ],
    },
    {
      modulo: 'Médicos',
      open: false,
      src: 'assets/img/icone-medicos.svg',
      listSubmenu: [
        {
          menu: 'Criar',
          src: 'bx bxs-dashboard',
          route: 'encarregado/dashboard',
          selecionado: false,
        },
        {
          menu: 'Listagem',
          src: 'bx bx-camera',
          route: 'encarregado/ponto',
          selecionado: false,
        },
      ],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificaRota();
  }

  verificaRota() {
    const urlAtual = this.router.url;
    if (urlAtual != '/manutencao') {
      this.listMenu?.map((y: any) => {
        y?.listSubmenu.map((x: any) => {
          if (x.route == urlAtual) {
            x.selecionado = true;
            y.open = true;
          }
        });
      });
    }
  }

  selecionarMenu(event: any) {
    this.listMenu?.map((x: any) => {
      if (x.modulo == event.modulo) {
        x.open = !x.open;
      } else {
        x.open = false;
      }
    });
  }
  navegar(event: any) {
    this.listMenu?.map((y: any) => {
      y.listSubmenu?.map((x: any) => {
        if (x.menu == event.menu) {
          x.selecionado = true;
        } else {
          x.selecionado = false;
        }
      });
    });
    this.router.navigate([event.route]);
  }

  openAndCloseMenu() {
    this.openMenu = !this.openMenu;
    if (this.openMenu == false) {
      this.listMenu.map((x: any) => {
        x.open = false;
      });
    }
    console.log('open', this.openMenu);
  }

  navegarHome() {
    this.router.navigate(['home']);
  }
}
