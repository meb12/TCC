import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
          route: 'cadastro/paciente',
          selecionado: false,
          manutencao: false,
        },
        {
          menu: 'Listagem',
          src: 'bx bx-user',
          route: 'pacientes/listagem',
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
          route: 'cadastro/medico',
          selecionado: false,
        },
        {
          menu: 'Listagem',
          src: 'bx bx-user',
          route: 'medicos/listagem',
          selecionado: false,
        },
        {
          menu: 'Especialidade',
          src: 'bx bx-camera',
          route: 'medicos/listagem',
          selecionado: false,
        },
      ],
    },
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Chama a função de verificação da rota sempre que a navegação for concluída
        this.verificaRota();
      }
    });
  }

  ngOnInit(): void {
    this.verificaRota();
  }

  verificaRota() {
    const urlAtual = this.router.url;
    this.listMenu.forEach((menu: any) => {
      menu.listSubmenu.forEach((submenu: any) => {
        // Verifique se a rota atual coincide com a rota do submenu
        submenu.selecionado = submenu.route === urlAtual;
        // Expanda o menu pai se algum submenu estiver selecionado
        if (submenu.selecionado) {
          menu.open = true;
        }
      });
    });
  }

  selecionarMenu(menu: any) {
    // Alternar o estado de abertura do menu atual
    menu.open = !menu.open;

    // Fechar os outros menus
    this.listMenu.forEach((m: any) => {
      if (m !== menu) {
        m.open = false;
      }
    });
  }

  navegar(event: any) {
    // Verifica se a rota selecionada é a mesma que a atual
    if (this.router.url === event.route) {
      // Se for a mesma, recarrega a rota
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([event.route]);
      });
    } else {
      // Se for diferente, apenas navega
      this.router.navigate([event.route]);
    }

    // Atualiza o estado do menu
    this.listMenu?.map((y: any) => {
      y.listSubmenu?.map((x: any) => {
        if (x.menu == event.menu) {
          x.selecionado = true;
        } else {
          x.selecionado = false;
        }
      });
    });
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

  ngAfterViewInit() {
    this.verificaRota();
  }
}
