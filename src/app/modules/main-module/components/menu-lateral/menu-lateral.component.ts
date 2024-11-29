import { Component, ElementRef, OnInit } from '@angular/core';
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
          menu: 'Cadastrar',
          src: 'assets/img/criar.svg',
          route: 'cadastro/paciente',
          selecionado: false,
          manutencao: false,
        },
        {
          menu: 'Listagem',
          src: 'assets/img/listagem.svg',
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
          menu: 'Cadastrar',
          src: 'assets/img/criar.svg',
          route: 'cadastro/medico',
          selecionado: false,
        },
        {
          menu: 'Listagem',
          src: 'assets/img/listagem.svg',
          route: 'medicos/listagem',
          selecionado: false,
        },
        {
          menu: 'Especialidade',
          src: 'assets/img/especialidades.svg',
          route: 'medicos/especialidades',
          selecionado: false,
        },
      ],
    },
    {
      modulo: 'Funcionários',
      open: false,
      src: 'assets/img/icone-medicos.svg',
      listSubmenu: [
        {
          menu: 'Cadastrar',
          src: 'assets/img/criar.svg',
          route: 'cadastro/funcionario',
          selecionado: false,
        },
        {
          menu: 'Listagem',
          src: 'assets/img/listagem.svg',
          route: 'funcionarios/listagem',
          selecionado: false,
        },
      ],
    },
  ];
  permissoes: any;
  permissoes1: any;

  constructor(private router: Router, private elementRef: ElementRef) {}

  ngOnInit(): void {
    const permissoesString = localStorage.getItem('userInfo');
    if (permissoesString) {
      this.permissoes1 = JSON.parse(permissoesString);
      this.permissoes = this.permissoes1.userType.permissions;
    } else {
      console.log('Nenhuma permissão encontrada no localStorage.');
    }

    // Chama o scroll no topo ao carregar a página
    this.scrollToTop();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop(); // Rola para o topo após a navegação
      }
    });

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
    const urlAtual = this.router.url;

    // Atualiza o estado dos itens selecionados no menu
    this.listMenu?.forEach((menu: any) => {
      menu.listSubmenu?.forEach((submenu: any) => {
        submenu.selecionado = submenu.menu === event.menu;
      });
    });

    // Se a rota for a mesma, recarrega a rota
    if (urlAtual === event.route) {
      this.router
        .navigateByUrl('/dummy-route', { skipLocationChange: true })
        .then(() => {
          this.router.navigate([event.route]);
          this.scrollToTop(); // Chama o scroll no topo após a navegação
        });
    } else {
      // Navega para a nova rota se for diferente
      this.router.navigate([event.route]);
      this.scrollToTop(); // Chama o scroll no topo após a navegação
    }

    // Fecha o módulo que contém o submenu selecionado
    this.listMenu.forEach((menu: any) => {
      if (
        menu.listSubmenu.some((submenu: any) => submenu.menu === event.menu)
      ) {
        menu.open = false; // Fecha o módulo atual
      }
    });

    // Fecha o menu lateral completo (se necessário)
    this.openMenu = false;
  }

  openAndCloseMenu() {
    this.openMenu = !this.openMenu;
    if (this.openMenu == false) {
      this.listMenu.map((x: any) => {
        x.open = false;
      });
    }
  }

  navegarHome() {
    this.router.navigate(['home']);
    this.scrollToTop(); // Certifica-se de rolar para o topo ao navegar para a home
  }

  // Função para rolar para o topo da área de conteúdo
  scrollToTop() {
    const contentContainer =
      this.elementRef.nativeElement.querySelector('.container');
    if (contentContainer) {
      contentContainer.scrollTo({
        top: 0,
        behavior: 'smooth', // Comportamento suave opcional
      });
    }
  }

  shouldDisplayMenu(item: any): boolean {
    // Verifica a permissão para cada módulo baseado no nome do módulo
    if (item.modulo === 'Pacientes') {
      if (item.listSubmenu.menu == 'Cadastrar') {
        return this.permissoes['canEditInfoPatient'];
      }
      return this.permissoes['listOfPatients'];
    } else if (item.modulo === 'Médicos') {
      return this.permissoes['listOfDoctors'];
    } else if (item.modulo === 'Funcionários') {
      return this.permissoes['listOfEmployees'];
    }
    return false;
  }

  isPacienteCadastrar(subItem: any): boolean {
    if (subItem.route == 'cadastro/paciente' && subItem.menu == 'Cadastrar') {
      return this.permissoes['canEditInfoPatient'];
    }
    if (subItem.route == 'pacientes/listagem' && subItem.menu == 'Listagem') {
      return this.permissoes['listOfPatients'];
    }
    if (subItem.route == 'medicos/listagem,' && subItem.menu == 'Listagem') {
      return this.permissoes['listOfDoctors'];
    }
    if (
      subItem.route == 'funcionarios/listagem,' &&
      subItem.menu == 'Listagem'
    ) {
      return this.permissoes['listOfEmployees'];
    }

    return true;
  }
  sair() {
    this.router.navigate(['login']);
    localStorage.clear();
  }
}
