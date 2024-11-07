import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TiposUsuariosService } from '../../../../core/services/user-types.service';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css'],
})
export class FuncionariosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Defina o dataSource sem inicializar com tableData
  dataSource = new MatTableDataSource<any>();

  // Adicione essas propriedades para controlar a paginação
  currentPage = 0;
  pageSize = 5; // Número de itens por página
  paginatedData: any[] = []; // Dados da página atual

  selectedFilter: number | null = null;

  constructor(
    private router: Router,
    private funcionarioService: FuncionariosService,
    private tiposUsuarios: TiposUsuariosService
  ) {}

  showModalExclusao = false;
  tipo = '';
  itemsPerPage = 10;
  totalPages = 0;
  filteredData: any[] = [];

  // Inicialize tableData como um array vazio
  tableData: any[] = [];

  displayedColumns: string[] = [
    'name',
    'id',
    'userType.name',
    'isActive',
    'actions',
  ];

  item: {
    id: number;
    specialtyName: string;
    intervalBetweenAppointments: string;
    isActive: boolean;
    cellphone: string;
    cep: string;
    city: string;
    complement: string;
    cpf: string;
    dateOfBirth: string;
    doctorData: {
      crm: string;
      observation: string;
      specialtyType: {
        id: number;
        intervalBetweenAppointments: string;
        isActive: boolean;
        specialtyName: string;
      };
    };
    documentNumber: string;
    email: string;
    gender: string;
    login: string;
    name: string;
    neighborhood: string;
    pacientData: any;
    stateName: string | null;
    streetName: string;
    streetNumber: number;
    userType: {
      id: number;
      name: string;
      isActive: boolean;
    };
  };

  selectData = [
    { value: 10, name: 'Ativos' },
    { value: 20, name: 'Inativos' },
    { value: 30, name: 'Todos' },
  ];

  tableColumns: ITableColumn[] = [
    { header: 'Nome', key: 'name', type: 'text' },
    { header: 'Código', key: 'id', type: 'text' },
    { header: 'Cargo', key: 'userType.name', type: 'text' },
    { header: 'Status', key: 'isActive', type: 'text' },
    {
      header: 'Ações',
      key: 'actions',
      type: 'buttons',
      buttons: [
        {
          label: 'Editar',
          action: (item) => this.editItem(item),
          condition: (item) => true,
          img: 'assets/img/editar.svg',
        },
        {
          label: 'Desativar',
          action: (item) => this.deleteItem(item),
          condition: (item) => item.isActive !== false,
          img: 'assets/img/excluir.svg',
        },
      ],
    },
  ];

  ngOnInit() {
    this.getFuncionarios();
    this.getUserTypes();
  }
  ngAfterViewInit() {
    this.updatePaginatedData();
  }

  getFuncionarios() {
    this.funcionarioService.getData().subscribe({
      next: (response) => {
        this.tableData = response;
        this.filteredData = [...this.tableData]; // Inicializa `filteredData` com todos os itens
        this.paginator.length = this.filteredData.length; // Define o `length` inicial do paginator
        this.updatePaginatedData();
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários:', error);
      },
    });
  }

  onSelectChange(selectedValue: any) {
    switch (selectedValue) {
      case 10:
        // Filtra apenas os itens ativos
        this.filteredData = this.tableData.filter(
          (item) => item.isActive === true
        );
        break;
      case 20:
        // Filtra apenas os itens inativos
        this.filteredData = this.tableData.filter(
          (item) => item.isActive === false
        );
        break;
      case 30:
        // Exibe todos os itens
        this.filteredData = [...this.tableData];
        break;
      default:
        // Filtra pelo cargo usando o selectedValue que corresponde ao id do cargo
        this.filteredData = this.tableData.filter(
          (item) => item.userType?.id === selectedValue
        );
        break;
    }

    // Atualiza o `length` do paginator com base no número de itens filtrados
    this.paginator.length = this.filteredData.length;

    // Redefine para a primeira página dos resultados filtrados
    this.currentPage = 0;
    this.paginator.pageIndex = this.currentPage;

    // Atualiza `paginatedData` para exibir a página correta
    this.updatePaginatedData();
  }

  onSearchChange(searchValue: string) {
    const lowerSearchValue = searchValue.toLowerCase().trim();

    // Aplica o filtro de select baseado no valor selecionado
    const selectedValue = this.selectData.find(
      (option) => option.value === this.selectedFilter
    )?.value;

    // Filtrar os dados com base no valor de pesquisa e no filtro selecionado
    this.filteredData = this.tableData.filter((item) => {
      const name = item.name?.toLowerCase() || '';
      const id = item.id?.toString() || '';
      const crm = item.doctorData?.crm?.toLowerCase() || '';
      const specialtyName =
        item.doctorData?.specialtyType?.specialtyName?.toLowerCase() || '';
      const isActive = item.isActive;

      // Verifica se o item corresponde ao filtro de pesquisa
      const matchesSearch = lowerSearchValue
        ? name.includes(lowerSearchValue) ||
          id.includes(lowerSearchValue) ||
          crm.includes(lowerSearchValue) ||
          specialtyName.includes(lowerSearchValue)
        : true;

      // Verifica se o item corresponde ao filtro selecionado
      const matchesFilter =
        selectedValue === 10
          ? isActive === true
          : selectedValue === 20
          ? isActive === false
          : selectedValue === 30
          ? true
          : item.userType?.id === selectedValue;

      return matchesSearch && matchesFilter;
    });

    // Atualiza o `length` do paginator para refletir o número de resultados filtrados
    this.paginator.length = this.filteredData.length;

    // Redefine a página para a primeira página dos resultados filtrados
    this.currentPage = 0;
    this.paginator.pageIndex = this.currentPage;

    // Atualiza `paginatedData` com os resultados filtrados
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  editItem(item: any) {
    this.router.navigate([`/cadastro/funcionario/${item.id}`]);
  }

  deleteItem(item: any) {
    this.showModalExclusao = true;
    this.item = item;
    this.tipo = 'funcionario';
  }

  closeModal() {
    this.showModalExclusao = false;
    this.getFuncionarios();
  }
  getUserTypes() {
    this.tiposUsuarios.getUserTypes().subscribe({
      next: (response) => {
        // Filtra os tipos de usuário que são diferentes de "Médico" e "Paciente"
        const filteredTypes = response.filter(
          (userType) =>
            userType.name !== 'Médico' && userType.name !== 'Paciente'
        );

        // Adiciona os tipos filtrados ao selectData
        filteredTypes.forEach((type) => {
          this.selectData.push({ value: type.id, name: type.name });
          this.selectData.sort((a, b) => {
            if (a.value === 30) return 1;
            if (b.value === 30) return -1;
            return 0;
          });
        });
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de usuário:', error);
      },
    });
  }

  cadastrar() {
    this.router.navigate(['/cadastro/funcionario']);
  }
}
