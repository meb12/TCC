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
    { value: 1, name: 'Ativos' },
    { value: 2, name: 'Inativos' },
    { value: 3, name: 'Todos' },
  ];

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
  }

  getMedicos() {
    this.medicos.getData().subscribe({
      next: (response) => {
        this.tableData = response;
        this.filteredData = [...this.tableData];
        this.updatePaginatedData();
      },
      error: (error) => {
        console.error('Erro ao carregar médicos:', error);
      },
    });
  }

  onSearchChange(searchValue: string) {
    const lowerSearchValue = searchValue.toLowerCase().trim();

    if (lowerSearchValue) {
      this.filteredData = this.tableData.filter((item) => {
        const name = item.name?.toLowerCase() || '';
        const id = item.id?.toString() || '';
        const crm = item.doctorData?.crm?.toLowerCase() || '';
        const description =
          item.doctorData?.specialtyType?.description?.toLowerCase() || '';

        return (
          name.includes(lowerSearchValue) ||
          id.includes(lowerSearchValue) ||
          crm.includes(lowerSearchValue) ||
          description.includes(lowerSearchValue)
        );
      });

      this.paginator.length = this.filteredData.length;
      this.currentPage = 0;
      this.paginator.pageIndex = this.currentPage;
      this.updatePaginatedData();
    } else {
      this.filteredData = [...this.tableData];
      this.paginator.length = this.filteredData.length;
      this.currentPage = 0;
      this.paginator.pageIndex = this.currentPage;
      this.updatePaginatedData();
    }
  }

  onSelectChange(selectedValue: any) {
    switch (selectedValue) {
      case 1:
        this.filteredData = this.tableData.filter(
          (item) => item.isActive === true
        );
        break;
      case 2:
        this.filteredData = this.tableData.filter(
          (item) => item.isActive === false
        );
        break;
      case 3:
        this.filteredData = [...this.tableData];
        break;
      default:
        this.filteredData = [...this.tableData];
    }

    this.paginator.length = this.filteredData.length;
    this.currentPage = 0;
    this.paginator.pageIndex = this.currentPage;
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
