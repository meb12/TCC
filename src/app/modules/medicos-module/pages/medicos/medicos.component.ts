import { Component, OnInit } from '@angular/core';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { ToastrService } from 'ngx-toastr';
import { MedicosService } from '../../../../core/services/medicos.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
})
export class MedicosComponent implements OnInit {
  constructor(
    private especialidades: EspecialidadeService,
    private toastr: ToastrService,
    private medicos: MedicosService
  ) {}

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
    { header: 'Nome', key: 'name', type: 'text' },
    { header: 'Código', key: 'id', type: 'text' },
    { header: 'CRM', key: 'doctorData.crm', type: 'text' },
    {
      header: 'Especialidade',
      key: 'doctorData.specialtyType.specialtyName',
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
          label: 'Excluir',
          action: (item) => this.deleteItem(item),
          condition: (item) => true,
          img: 'assets/img/excluir.svg',
        },
      ],
    },
  ];

  onSearchChange(searchValue: any) {
    const lowerSearchValue = searchValue.toLowerCase();

    this.filteredData = this.tableData.filter((item) => {
      const name = item.name?.toLowerCase() || '';
      const id = item.id?.toString() || '';
      const crm = item.doctorData?.crm?.toLowerCase() || '';
      const specialtyName =
        item.doctorData?.specialtyType?.specialtyName?.toLowerCase() || '';

      return (
        name.includes(lowerSearchValue) ||
        id.includes(lowerSearchValue) ||
        crm.includes(lowerSearchValue) ||
        specialtyName.includes(lowerSearchValue)
      );
    });
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

  getMedicos() {
    this.medicos.getData().subscribe({
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
    this.tipo = 'editar';
    this.item = item;
    this.getMedicos();
  }

  deleteItem(item: any) {
    console.log(item);
    const formNovo = {
      id: item.id,
      cpf: item.cpf,
      documentNumber: item.documentNumber,
      name: item.name,
      dateOfBirth: item.dateOfBirth,
      email: item.email,
      cellphone: item.cellphone,
      userTypeId: item.userTypeId,
      streetName: item.streetName,
      streetNumber: item.streetNumber,
      complement: item.complement,
      neighborhood: item.neighborhood,
      state: item.state,
      cep: item.cep,
      city: item.city,
      gender: item.gender,
      isActive: false,
      doctorData: {
        crm: item.doctorData.crm,
        specialtyTypeId: item.doctorData.specialtyType.id,
        observation: item.doctorData.observation,
      },
    };

    this.medicos.putData(formNovo).subscribe({
      next: (response) => {
        this.toastr.success('Médico excluído com sucesso!');
        this.getMedicos();
      },
      error: (error) => {
        this.toastr.error('Erro, tente novamente!');
      },
    });
  }

  closeModal() {
    this.getMedicos();
  }

  ngOnInit() {
    this.getMedicos();
  }
}
