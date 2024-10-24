import { Component, OnInit } from '@angular/core';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';
import { MatDialog } from '@angular/material/dialog';
import { EspecialidadesModalComponent } from '../especialidades-modal/especialidades-modal.component';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css'],
})
export class EspecialidadesComponent implements OnInit {
  constructor(
    private especialidades: EspecialidadeService,
    private toastr: ToastrService
  ) {}
  showModal = false;
  tipo = '';
  item: {
    id: number;
    specialtyName: string;
    intervalBetweenAppointments: string;
    isActive: boolean;
  };
  selectData = [
    {
      value: 1,
      name: 'Ativos',
    },
    {
      value: 2,
      name: 'Inativos',
    },
    {
      value: 3,
      name: 'Todos',
    },
  ];
  tableData = [];

  filteredData = this.tableData;

  tableColumns: ITableColumn[] = [
    { header: 'Nome', key: 'specialtyName', type: 'text' },
    { header: 'Código', key: 'id', type: 'text' },
    { header: 'Intervalo', key: 'intervalBetweenAppointments', type: 'text' },
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
          label: 'Excluir',
          action: (item) => this.deleteItem(item),
          condition: (item) => true,
          img: 'assets/img/excluir.svg',
        },
      ],
    },
  ];

  onSearchChange(searchValue: any) {
    this.filteredData = this.tableData.filter(
      (item) =>
        item.specialtyName.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.id.toString().includes(searchValue)
    );
  }

  onSelectChange(selectedValue: any) {
    console.log(selectedValue, this.filteredData);
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
        this.filteredData = this.tableData;
        break;
      default:
        this.filteredData = this.tableData;
    }
  }

  getEspecialidades() {
    this.especialidades.getData().subscribe({
      next: (response) => {
        this.tableData = response;
        this.filteredData = this.tableData;
        console.log(this.tableData);
      },
      error: (error) => {
        console.error('Erro ao carregar especialidades:', error);
      },
    });
  }

  editItem(item: any) {
    this.showModal = true;
    this.tipo = 'editar';
    this.item = item;
    this.getEspecialidades();
  }

  deleteItem(item: any) {
    const formNovo = {
      id: item.id,
      description: item.specialtyName,
      intervalBetweenAppointments: item.intervalBetweenAppointments,
      isActive: false,
    };

    this.especialidades.putData(formNovo).subscribe({
      next: (response) => {
        this.toastr.success('Especialidade excluída com sucesso!');
        this.getEspecialidades();
      },
      error: (error) => {
        this.toastr.error('Erro, tente novamente!');
      },
    });
  }

  closeModal() {
    this.showModal = false;
    this.getEspecialidades();
  }

  ngOnInit() {
    this.getEspecialidades();
  }
}
