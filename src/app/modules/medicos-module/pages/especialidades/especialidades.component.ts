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
  showModalExclusao = false;
  tipo = '';
  item: {
    id: number;
    description: string;
    intervalBetweenAppointments: string;
    isActive: boolean;
    cellphone: string;
    cep: string;
    city: string;
    complement: string;
    cpf: string;
    dateOfBirth: string; // ou Date se preferir usar um objeto de data
    doctorData: {
      crm: string;
      observation: string;
      specialtyType: {
        id: number;
        intervalBetweenAppointments: string;
        isActive: boolean;
        description: string;
      };
    };
    documentNumber: string;
    email: string;
    gender: string;
    login: string;
    name: string;
    neighborhood: string;
    pacientData: any; // Defina o tipo se houver uma estrutura específica para paciente
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
    { header: 'Nome', key: 'description', type: 'text' },
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
          label: 'Desativar',
          action: (item) => this.deleteItem(item),
          condition: (item) => item.isActive !== false,
          img: 'assets/img/excluir.svg',
        },
      ],
    },
  ];

  onSearchChange(searchValue: any) {
    this.filteredData = this.tableData.filter(
      (item) =>
        item.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.id.toString().includes(searchValue)
    );
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
    this.showModalExclusao = true;
    this.item = item;
    this.tipo = 'especialidade';
    this.getEspecialidades();
  }

  closeModal() {
    this.showModal = false;
    this.showModalExclusao = false;
    this.getEspecialidades();
  }

  ngOnInit() {
    this.getEspecialidades();
  }
}
