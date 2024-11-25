import { Component, OnInit, ViewChild } from '@angular/core';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { ToastrService } from 'ngx-toastr';
import { MedicosService } from '../../../../core/services/medicos.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
})
export class MedicosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchValue: string = ''; // Armazena o valor da busca
  selectedValue: number | string = 80; // Valor padrão como "Todos"

  constructor(
    private especialidades: EspecialidadeService,
    private toastr: ToastrService,
    private medicos: MedicosService,
    private router: Router
  ) {}

  showModalExclusao = false;
  tipo = '';
  item: any;
  selectData = [
    { value: 60, name: 'Ativos' },
    { value: 70, name: 'Inativos' },
    { value: 80, name: 'Todos' },
  ];
  especialidadesData = [];

  tableData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  currentPage = 0;
  pageSize = 5;

  tableColumns: ITableColumn[] = [
    { header: 'Nome', key: 'name', type: 'text' },
    { header: 'Código', key: 'id', type: 'text' },
    { header: 'CRM', key: 'doctorData.crm', type: 'text' },
    {
      header: 'Especialidade',
      key: 'doctorData.specialtyType.description',
      type: 'text',
    },
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
    this.getMedicos();
    this.getEspecialidades();
  }

  getEspecialidades() {
    this.especialidades.getData().subscribe({
      next: (response) => {
        const especialidadesOptions = response.map((response) => ({
          value: `especialidade_${response.id}`, // Prefixo para diferenciar especialidades
          name: response.description,
          isEspecialidade: true, // Adiciona uma flag para identificar especialidades
        }));

        // Adiciona as especialidades ao dropdown
        this.selectData = [
          { value: 60, name: 'Ativos' },
          { value: 70, name: 'Inativos' },
          { value: 80, name: 'Todos' },
          ...especialidadesOptions, // Adiciona as especialidades
        ];
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }

  // getMedicos() {
  //   this.medicos.getData().subscribe({
  //     next: (response) => {
  //       this.tableData = response;
  //       this.filteredData = [...this.tableData];
  //       this.updatePaginatedData();
  //     },
  //     error: (error) => {
  //       console.error('Erro ao carregar médicos:', error);
  //     },
  //   });
  // }
  getMedicos() {
    this.medicos.getData().subscribe({
      next: (response) => {
        // Recupera o usuário atual do localStorage
        const currentUser = JSON.parse(
          localStorage.getItem('userInfo') || '{}'
        );

        // Filtra a lista de médicos para remover o médico atual
        this.tableData = response.filter(
          (medico: any) => medico.id !== currentUser.id
        );

        this.filteredData = [...this.tableData]; // Inicializa `filteredData` com todos os itens
        this.updatePaginatedData(); // Atualiza os dados paginados
      },
      error: (error) => {
        console.error('Erro ao carregar médicos:', error);
      },
    });
  }

  applyFilters() {
    const lowerSearchValue = this.searchValue?.toLowerCase().trim() || '';
    const selectedValue = this.selectedValue;

    this.filteredData = this.tableData.filter((item) => {
      // Critérios de busca
      const name = item.name?.toLowerCase() || '';
      const id = item.id?.toString() || '';
      const crm = item.doctorData?.crm?.toLowerCase() || '';
      const description =
        item.doctorData?.specialtyType?.description?.toLowerCase() || '';
      const matchesSearch =
        lowerSearchValue === '' || // Se não houver busca, considera tudo
        name.includes(lowerSearchValue) ||
        id.includes(lowerSearchValue) ||
        crm.includes(lowerSearchValue) ||
        description.includes(lowerSearchValue);

      // Critérios de seleção
      const matchesSelect =
        selectedValue === 80 || // "80" para "todos"
        (selectedValue === 60 && item.isActive === true) || // Ativos
        (selectedValue === 70 && item.isActive === false) || // Inativos
        (typeof selectedValue === 'string' && // Especialidades
          selectedValue.startsWith('especialidade_') &&
          item.doctorData?.specialtyType?.id ===
            parseInt(selectedValue.replace('especialidade_', ''), 10));

      return matchesSearch && matchesSelect;
    });

    // Atualiza a paginação
    this.paginator.length = this.filteredData.length;
    this.currentPage = 0;
    this.paginator.pageIndex = this.currentPage;
    this.updatePaginatedData();
  }

  onSearchChange(searchValue: string) {
    this.searchValue = searchValue; // Armazena o valor da busca
    this.applyFilters(); // Aplica os filtros combinados
  }

  onSelectChange(selectedValue: number | string) {
    this.selectedValue = selectedValue; // Armazena o valor selecionado
    this.applyFilters(); // Aplica os filtros combinados
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
    this.router.navigate([`/cadastro/medico/${item.id}`]);
  }

  deleteItem(item: any) {
    this.showModalExclusao = true;
    this.item = item;
    this.tipo = 'medicos';
  }

  closeModal() {
    this.showModalExclusao = false;
    this.getMedicos();
  }

  cadastrar() {
    this.router.navigate(['/cadastro/medico']);
  }
}
