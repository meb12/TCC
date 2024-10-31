import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EspecialidadeService } from '../../../../core/services/especalidades.service';
import { FuncionariosService } from '../../../../core/services/funcionarios.service';
import { ITableColumn } from '../../../../shared/components/tabela/tabela.models';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css'],
})
export class FuncionariosComponent implements OnInit {
  constructor(
    private especialidades: EspecialidadeService,
    private toastr: ToastrService,
    private router: Router,
    private funcionarioService: FuncionariosService
  ) {}
  showModalExclusao = false;
  tipo = '';
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
    dateOfBirth: string; // ou Date se preferir usar um objeto de data
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

  getFuncionarios() {
    this.funcionarioService.getData().subscribe({
      next: (response) => {
        this.tableData = response;
        this.filteredData = this.tableData;
      },
      error: (error) => {
        console.error('Erro ao carregar médicos!!!!:', error);
      },
    });
  }

  editItem(item: any) {
    this.router.navigate([`/cadastro/funcionario/${item.id}`]);
  }

  deleteItem(item: any) {
    this.showModalExclusao = true;
    this.item = item;
    this.tipo = 'funcionario';
    this.getFuncionarios();
  }

  closeModal() {
    this.showModalExclusao = false;
    this.getFuncionarios();
  }

  cadastrar() {
    this.router.navigate(['/cadastro/funcionario']);
  }
  ngOnInit() {
    this.getFuncionarios();
  }
}
