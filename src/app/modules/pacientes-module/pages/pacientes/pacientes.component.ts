import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';
import { Router } from '@angular/router';
import { PacientesService } from '../../../../core/services/pacientes.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
  constructor(
    private router: Router,
    private pacientesService: PacientesService
  ) {}

  showModalExclusao = false;
  item: any;
  tipo = '';
  data = '';

  selectData = [
    { value: 1, name: 'Ativos' },
    { value: 2, name: 'Inativos' },
    { value: 3, name: 'Todos' },
  ];

  tableData: any[] = []; // Dados completos da tabela
  filteredData: any[] = []; // Dados filtrados para exibição
  paginatedData: any[] = []; // Dados da página atual

  pageSize = 5; // Número de itens por página
  currentPage = 0; // Página atual do paginator

  tableColumns: ITableColumn[] = [
    { header: 'Nome', key: 'name', type: 'text' },
    { header: 'Código', key: 'id', type: 'text' },
    { header: 'CPF', key: 'cpf', type: 'text' },
    { header: 'Telefone', key: 'cellphone', type: 'text' },
    { header: 'Status', key: 'isActive', type: 'text' },
    {
      header: 'Ações',
      key: 'actions',
      type: 'buttons',
      buttons: [
        {
          label: 'Informações',
          action: (item) => this.infosItem(item),
          condition: () => true,
          img: 'assets/img/icon-consulta.svg',
        },
        {
          label: 'Nova consulta',
          action: (item) => this.novaConsulta(item),
          condition: (item) => item.isActive === true,
          img: 'assets/img/icon-consulta.svg',
        },
        {
          label: 'Editar',
          action: (item) => this.editItem(item),
          condition: () => true,
          img: 'assets/img/editar.svg',
        },
        {
          label: 'Excluir',
          action: (item) => this.deleteItem(item),
          condition: (item) => item.isActive === true,
          img: 'assets/img/excluir.svg',
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.fetchPacientes(); // Carrega os dados dos pacientes
  }

  fetchPacientes() {
    this.pacientesService.getData().subscribe({
      next: (response) => {
        // Mapeia a resposta para incluir o isActive como string
        this.tableData = response;
        this.filteredData = [...this.tableData]; // Inicializa `filteredData` com todos os dados
        this.updatePaginatedData(); // Atualiza os dados paginados
      },
      error: (error) => {
        console.error('Erro ao carregar pacientes:', error);
      },
    });
  }

  onSearchChange(searchValue: string) {
    const lowerSearchValue = searchValue.toLowerCase();
    this.filteredData = this.tableData.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearchValue) ||
        item.id.toString().includes(searchValue) ||
        item.cpf.includes(searchValue) ||
        item.cellphone.includes(searchValue)
    );
    this.currentPage = 0; // Reseta para a primeira página
    this.updatePaginatedData();
  }

  onSelectChange(selectedValue: any) {
    switch (selectedValue) {
      case 1: // Ativos
        this.filteredData = this.tableData.filter(
          (item) => item.isActive === true
        );
        break;
      case 2: // Inativos
        this.filteredData = this.tableData.filter(
          (item) => item.isActive === false
        );
        break;
      case 3: // Todos
      default:
        this.filteredData = [...this.tableData];
        break;
    }
    this.currentPage = 0; // Reseta para a primeira página
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

  // Funções de ações
  isPacienteModalOpen = false;

  closePacienteModal() {
    this.isPacienteModalOpen = false;
  }

  closeModal() {
    this.showModalExclusao = false;
    this.fetchPacientes();
  }

  infosItem(item: any) {
    this.isPacienteModalOpen = true;
    this.data = item;
  }

  editItem(item: any) {
    this.router.navigate([`/cadastro/paciente/${item.id}`]);
  }

  novaConsulta(item: any) {
    this.router.navigate([`/pacientes/consulta`, item.id]);
  }

  deleteItem(item: any) {
    this.showModalExclusao = true;
    this.item = item;
    this.tipo = 'pacientes';
  }

  cadastrar() {
    this.router.navigate(['/cadastro/paciente']);
  }
}
